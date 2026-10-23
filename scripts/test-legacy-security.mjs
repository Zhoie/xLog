import assert from "node:assert/strict"
import {
  createHash,
  createPrivateKey,
  createPublicKey,
  verify,
} from "node:crypto"
import { readFileSync } from "node:fs"
import test from "node:test"
import elliptic from "elliptic"
import decode from "decode-uri-component"

const vectors = JSON.parse(
  readFileSync(
    new URL("./security-vectors/p521-rfc6979.json", import.meta.url),
  ),
)

test("RFC 6979 preserves the full nonce length, including leading zero bytes", () => {
  const ec = new elliptic.ec("p521")
  for (const vector of vectors.tests) {
    const digest = createHash("sha512")
      .update(Buffer.from(vector.msg, "hex"))
      .digest()
    const signature = ec.sign(digest, vector.privateKey).toDER("hex")
    assert.equal(signature, vector.sig, `published vector ${vector.tcId}`)
  }
})

test("secp256k1 wallet signatures remain verifiable by Node OpenSSL", () => {
  const ec = new elliptic.ec("secp256k1")
  const privateBytes = Buffer.alloc(32)
  privateBytes[31] = 1
  const key = ec.keyFromPrivate(privateBytes)
  const publicBytes = Buffer.from(key.getPublic().encode("array", false))
  const privateKey = createPrivateKey({
    key: {
      kty: "EC",
      crv: "secp256k1",
      d: privateBytes.toString("base64url"),
      x: publicBytes.subarray(1, 33).toString("base64url"),
      y: publicBytes.subarray(33).toString("base64url"),
    },
    format: "jwk",
  })
  const message = Buffer.from("xLog security compatibility check")
  const signature = Buffer.from(
    ec.sign(createHash("sha256").update(message).digest(), key).toDER(),
  )
  assert.equal(
    verify("sha256", message, createPublicKey(privateKey), signature),
    true,
  )
})

test("the fixed URI decoder retains valid UTF-8 and handles long malformed input", () => {
  assert.equal(decode("hello%20world"), "hello world")
  assert.equal(decode("%E4%B8%AD%E6%96%87"), "中文")
  const malformed = "%FF".repeat(100000)
  assert.equal(decode(malformed), malformed)
  assert.equal(decode("%FF%C3%A5"), "%FFå")
  assert.throws(() => decode(null), TypeError)
})
