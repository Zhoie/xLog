# Elliptic nonce-length backport

Private local package based on elliptic 6.6.1. The sole algorithm change preserves the generated nonce byte array until `_truncateToN` reads its original length, avoiding loss of leading zeros when constructing a BN first (CVE-2025-14505 / GHSA-848j-6mx2-7j84). Custom nonce callbacks retain the upstream API. No audit suppression is configured.

Primary evidence: https://github.com/indutny/elliptic/issues/321

Regression vectors: https://github.com/bleichenbacher-daniel/Rooterberg/blob/main/test_vectors/ecdsa/ecdsa_rfc6979_secp521r1_sha_512.json

Original lib/elliptic/ec/index.js SHA-256: `668741c0c921bf5174439104e8fd20636578373cbbd28736ccbcd8e59a5aeafc`

The full upstream MIT notice is retained in UPSTREAM-README.md and the package archive.
