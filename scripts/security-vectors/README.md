# RFC 6979 regression data

The numeric test cases in `p521-rfc6979.json` are a subset of Daniel Bleichenbacher's published Rooterberg P-521/SHA-512 RFC 6979 vectors:

https://github.com/bleichenbacher-daniel/Rooterberg/blob/main/test_vectors/ecdsa/ecdsa_rfc6979_secp521r1_sha_512.json

The subset retains the original case identifiers and expected signatures, including all `SpecialK` cases. These exercise nonce candidates with leading zero bytes. The full 1,560-case source set was also checked during remediation: the backport passed every case, while unmodified elliptic 6.6.1 failed seven. Rooterberg describes these vectors as experimental; no separate license declaration was present in its repository when retrieved on 2026-10-23.
