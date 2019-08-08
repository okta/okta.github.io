---
layout: blog_post
title: "Secure Applications with Certificate Pinning"
author: jf
description: "In this short article you'll about TLS certificate pinning."
tags: [ssl, tls, certificate pinning]
tweets:
- "TLS certificate pinning can help prevent man-in-the-middle attacks. Learn how:"
- "Want to improve your application's security posture? Check out our short article on TLS certificate pinning!"
- "Learn how certificate pinning works in our new article!"
image: blog/featured/okta-java-headphones.jpg
---

In the famous 1993 cartoon from the New Yorker, one canine sits at a PC, looking at another, and says, "On the Internet, nobody knows you're a dog." More than a quarter of a century later, digital certificates have made us more certain who we're talking to online, but there are still problems that mean we can't be 100% sure. Certificate pinning serves to close that gap by narrowing down the certificates we accept from our peers.

## What is Certificate Pinning?

Certificate pinning associates a host with its expected public key. Unless the host has the expected key, the client won't connect to it.

To understand what this means, let's first review how digital certificates work. When one party, such as a browser, a mobile app, or even a server connects securely to an online service, it uses Transport Layer Security (TLS). This serves two purposes: it encrypts the traffic between the two parties and the service proves its identity by sending a certificate containing a public key to the client, signed by a trusted party. For our canine friend, it's the digital equivalent of producing a dog license.

But how can we know the certificate is valid? Certificate validity is determined by an electronic signature from a certificate authority (CA), which is a trusted third party (the issuer of the digital dog license). The user's operating system or web browser maintains a list of CAs it trusts.

There are two problems with this model, however. The first being that certificates aren't always secure. For example, in June 2019, the FBI warned people that crooks were getting certificates for their phishing sites illegitimately. Having an SSL certificate convinces the browser to display the green padlock, but that doesn't mean the organization using it is legitimate! For that, it needs an extended validation certificate, which involves more expensive and complex hoop jumping with the CA. Most users can't tell the difference.
 
The second problem is that CAs aren't infallible. In the past, we have seen them mistakenly issue certificates to the wrong people including a 2013 case where Google [found](https://security.googleblog.com/2013/01/enhancing-digital-certificate-security.html) an unauthorized digital certificate for the google.com domain that was issued by an intermediate CA (an intermediate CA gets permission to issue certificates from a root CA). It turned out that the intermediate CA shouldn't have attained that status at all—the root CA had allowed it by mistake! A mistake that meant that an imposter could have spoofed Google's domain structure until the CA revoked the certificate.

## The Importance of Certificate Pinning

Those are not the only instances, but they illustrate the problem: a fraudulent certificate can lead to a man-in-the-middle attack. The person possessing it can position themselves between the client and server to use the fraudulent certificate to decrypt, analyze, and re-encrypt traffic. Or even direct the client to a malicious destination.

Certificate pinning helps by telling the client **exactly** what certificate to expect. It looks for a specific fingerprint within a certificate and if it doesn't find that fingerprint, it will refuse the connection to the server. This enables individual trusted organizations like [Okta](/) to manage and verify the relationship between the server and the endpoint directly.

## How Okta Uses Certificate Pinning

Okta uses certificate pinning in all of its mobile applications and on browser sessions with its website to protect its users. Rather than relying on root CA certificates, we create our own. We maintain a list of public keys (known as pins) on our servers, hashed using the SHA-256 cryptographic hashing algorithm.

When the user visits an okta.com website, they get one of these public key pins, bound to the active certificate. We also create three backup public key pins, each with a max-age expire property. The browser caches them all until they expirey date and looks for them every time the user accesses an Okta service.

## Certificate Pinning Implementation Guidelines

Here's how we use these keys in our certificate pinning code, accessible via [this GitHub repo](https://github.com/jpf/okta-openvpn/blob/master/okta_openvpn.py). This connection verification class illustrates how a third-party app can connect with Okta's certificate pinning system.

```python
class PublicKeyPinsetConnectionPool(urllib3.HTTPSConnectionPool):
    def __init__(self, *args, **kwargs):
        self.pinset = kwargs.pop('assert_pinset', None)
        super(PublicKeyPinsetConnectionPool, self).__init__(*args, **kwargs)

    def _validate_conn(self, conn):
        super(PublicKeyPinsetConnectionPool, self)._validate_conn(conn)
        if not conn.is_verified:
            raise Exception("Unexpected verification error.")

        cert = conn.sock.getpeercert(binary_form=True)
        public_key = x509.load_der_x509_certificate(cert, default_backend()).public_key()
        public_key_raw = public_key.public_bytes(
            serialization.Encoding.DER,
            serialization.PublicFormat.SubjectPublicKeyInfo)

        public_key_sha256 = hashlib.sha256(public_key_raw).digest()
        public_key_sha256_base64 = base64.b64encode(public_key_sha256)

        if public_key_sha256_base64 not in self.pinset:
            pin_failure_message = (
                'Refusing to authenticate '
                'because host {remote_host} failed '
                'a TLS public key pinning check. '
                'Please contact support@okta.com with this error message'
            ).format(remote_host=conn.host)
            log.critical(pin_failure_message)
            raise PinError("Public Key not found in pinset!")
```

The class gets the pin set from a list of pre-defined Okta-based sources. Then, it gets the certificate from the server it is connecting to and extracts its public key. It hashes that key using SHA-256, and then compares the digest with the four pins that it has cached. If the key isn't there, then it refuses the connection, logs the event, and raises an error.

Certificate pinning is the last step in confirming that you are indeed talking to a specific dog on the Internet—and not just any old shih tzu, german shepherd, or poodle. It works via APIs just as easily as it does via web browsing sessions, and it's a key tool that we use to ensure our users and industry partners that we are who we say we are. When it comes to security, there are no fleas on us.

## Further Security Reading

Want to read more security content? Check out these other security resources:

- [Transport Layer Security](/books/api-security/tls/)
- [What Happens If Your JWT is Stolen?](/blog/2018/06/20/what-happens-if-your-jwt-is-stolen)
- [An OpenID Connect Primer](/blog/2017/07/25/oidc-primer-part-1)
