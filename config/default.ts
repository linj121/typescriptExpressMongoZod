export default {
  port: 1337,
  dbUri: "mongodb://localhost:27017/restapi-tut",
  saltWorkFactor: 10,
  accessTokenTtl: "-1",
  refreshTokenTtl: "1y",
  publicKey: `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEArmwhi0gO1dJXIYa2k7XD
RIKa7LSbhSyb68bsAJQLb1o7jvNSCKmQZKv0ryjIyt6HMno0DggF8VmhUUIWvFAC
9xbx/2JVC36YGPhS0j8V2DkccwksJ9YuUAwTCu1n8moH18bzE3rAiCC+JZIKzECs
WBPDlsik6w2gDVZ3hXLrAguSOidVWeSZo3JRH/+P5RKxTJ8bp6aIAz0IxlfgB413
jX7bIPsB1oBvBzwzmd/5W8cZ4GCGcgjIiroxfwwwDxhek5m3bxh7FKFDjN/7Uphm
U9lzWdxQurZHQjSytwTGZyQ8Zg/4Jvm3ljKe1ZG7Vvb8O7MzCta9SbtP57ELiZ00
tZYPP4IN4tSKCPiDbtnjLps0EdJcSACiuf/x27IZX5edW5KZ77r+/wcktFxzAVDQ
Q2k26+xeQDkqLi+dLwh9b/AUpCyvCkFoyrsWT/5EdElKIV1VFYGkfIEGvGg+Bhlh
r/sNnAKmsCov7dr8jq8wpUMb6Ac7OzoNUNKj8PxfB8dbS552oLeU6E4Icv8j2c+V
42Rr4EvOOCoKYz1/GelnBJ6tc746UuXCOTAsSiUE7yfMoZEdYaKy62lxut+fpdre
Jy/aaB1260FrxLwqXw9cKH5R3vFt44xdV9ypGpWfaxyIAgP1MtCKtnaUPjpiG6a6
CARBptoZB6hJHqDR+ibKlRUCAwEAAQ==
-----END PUBLIC KEY-----`,
  privateKey: `-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----`
};
