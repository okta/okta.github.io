---
layout: blog_post
title: "The Hardest Thing About Data Encryption"
author: rdegges
description: "Key management is the hardest part about data encryption. Learn
how to handle encryption keys properly in this short guide."
tags: [security, cryptography]
tweets:
- "What's the hardest thing about data encryption?"
- "Data encryption is hard, but there's something a lot harder that most developers don't consider:"
- "Want to learn a bit about data encryption and key management? Check out our short post on the subject."
image: blog/the-hardest-thing-about-data-encryption/useful-cryptography.png
---

{% img blog/the-hardest-thing-about-data-encryption/useful-cryptography.png alt:"useful cryptography" %}{: .center-image }

Encrypting data is all about making sure that only the right people can view the data you've encrypted. There are two primary forms of data encryption: symmetric and asymmetric.

While you can easily Google "symmetric encryption best practices" and figure out the best algorithms and developer libraries to use (more on this later) to encrypt and decrypt data, one thing *isn't so easy*: figuring out how to properly store and manage your data encryption keys.

The hardest thing about encrypting data isn't encryption, it's *key management*.

## Symmetric vs Asymmetric Encryption

As I mentioned before, there are two primary forms of encryption: symmetric and asymmetric.

Symmetric encryption is the type of encryption most people are familiar with. Symmetric encryption works by using a secret key (password) to encrypt some data. To decrypt symmetrically encrypted data, you need that same secret key. In essence, as long as you know the secret key, you can encrypt or decrypt whatever data you want, no problem!

{% img blog/the-hardest-thing-about-data-encryption/symmetric-encryption.png alt:"symmetric encryption" %}{: .center-image }

When you think about symmetric encryption, think password-protected PDF files: you have to know the password to decrypt.

Asymmetric encryption is a completely different beast.

Let's say you want to send sensitive data to your friend over the internet, how would you do that? If you used symmetric encryption to encrypt your data, your friend would need to know what secret key you used to encrypt the data (so they could use that same secret key to decrypt it).

This begs the question: how do you securely send your friend that secret key? Unless both you and your friend are meeting in person to exchange a secret key (password) like they used to in [the old days](https://en.wikipedia.org/wiki/Gilbert_Vernam), sharing a secret key between untrusted parties is nearly impossible. 

Asymmetric encryption provides a better solution for the untrusted parties problem: instead of using a single secret key for both encryption and decryption, asymmetric encryption works off a multi-key system.

Each party (Alice and Bob, for example) has two keys in this asymmetric model: a public key and a private key.

{% img blog/the-hardest-thing-about-data-encryption/asymmetric-encryption.png alt:"asymmetric encryption" %}{: .center-image }

Each user's public key can be sent freely over the internet, email, or any other untrusted medium. If Bob wants to encrypt some data for Alice, he can use his *private* key in conjunction with Alice's *public* key to securely encrypt data and send it to her.

Alice can then use her *private* key in conjunction with Bob's *public* key to decrypt the data. It's the old switcharoo! Each party needs only *their* private key and the other person's *public* key to either encrypt or decrypt data.

Asymmetric encryption is useful in situations where you need to share data securely between parties that can't safely share a secret key. With the asymmetric model, neither party needs to expose their *secret* key to the other: both parties need only to exchange their *public* keys (which they can do without compromising the cryptosystem).

## The Challenge with Data Encryption

Surprisingly, the biggest challenge with data encryption, by far, is *key management*. How do you safely store secret keys for either symmetric or asymmetric cryptosystems?

### Symmetric Encryption Key Management

Symmetric encryption key management is the stuff of nightmares. It's easiest to explain through a more complex, but common, scenario.

Let's say you are running a website and need to encrypt sensitive user records. On your web server, you generate a long, random secret and use that to encrypt each new user record before storing the resulting encrypted file on a file server. What could go wrong in this scenario?

- If you accidentally publish or leak your secret key, *all* of your encrypted files are now vulnerable because they were all encrypted using the same key. You'll not only have to re-download all of these files, but you'll also need to re-encrypt all of them with a different key.
- If an attacker is able to grab hold of your files and is able to brute force your secret key, they can now decrypt *all* of your files for the same reason mentioned above.
- If you lose your secret key or change it, you can no longer decrypt your files.

Knowing that, let's say you smarten up. Instead of using the same secret key to encrypt all of your files, you instead decide to create a new secret key for each file you intend to encrypt. While this is a far better solution, where do you store and keep track of all these keys? In your database server? In your web server somewhere? No matter what happens, you've now have the added burden of keeping and protecting an ever-increasing number of secret keys. That's a lot of work!

### Asymmetric Encryption Key Management

While symmetric key management is a nightmare, there are no easy key management solutions for asymmetric cryptosystems either.

You need to find ways to validate public keys belong to the person you *think* they do and you need to protect each party's private keys. You have twice as many keys (or more) when dealing with asymmetric cryptosystems and lots of room to make mistakes.

In general, it's extremely hard to [manage cryptographic keys well](https://latacora.micro.blog/2019/07/16/the-pgp-problem.html).

## Data Encryption Key Management Solutions

Managing keys is terrible, but fortunately, there are some strategies you can use to make life easier.

For starters, if you need to encrypt data symmetrically, you can use [Amazon KMS](https://aws.amazon.com/kms/) (as recommended by our friends at [ latacora](https://latacora.micro.blog/2018/04/03/cryptographic-right-answers.html)). Amazon KMS (key management service) uses hardware devices to manage cryptographic keys for your applications and an incredibly useful technique for data encryption known as [envelope encryption](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#enveloping).

{% img blog/the-hardest-thing-about-data-encryption/symmetric-encryption-best-practices.png alt:"symmetric encryption best practices" %}{: .center-image }

In short, the way it works is:

- You generate a master key using KMS
- Each time you want to encrypt data, you ask AWS to generate a new *data key* for you. A *data key* is a unique encryption key generated for each piece of data you need to encrypt.
- You then encrypt your data using the *data key*
- Amazon will then encrypt your *data key* using the master key
- You will then merge the encrypted *data key* together with the encrypted data to create an *encrypted message*. The *encrypted message* is your final output, what you would store as a file or in a database somewhere.

The reason this is so convenient is that you never need to worry about keeping keys safeguarded -- the keys needed to decrypt any data are always unique and safe.

To decrypt data, all you need to do is take the *encrypted message* and break it into two pieces: the *encrypted data key* and the *encrypted data*. You then ask AWS to decrypt the *encrypted data key* using the master key AWS maintains -- this gives you the original *data key*. Finally, you decrypt the *encrypted data* using the *data key* that you just decrypted.

{% img blog/the-hardest-thing-about-data-encryption/symmetric-decryption-best-practices.png alt:"symmetric decryption best practices" %}{: .center-image }

Bam! Just like that, you've solved the key management issue.

Unfortunately, for asymmetric cryptosystems... There are simply no easy answers. For years cryptographers have found issues in existing key management infrastructure and there are a seemingly unending number of vulnerabilities, weaknesses, and trust issues surrounding public key infrastructure.

The best thing you can do when building asymmetric cryptosystems is whatever you can to keep private keys safe and validate the authenticity of public keys when performing key exchanges (ideally using some form of authentication).

The real answer, however, is that "it depends" based on what you're doing. For a more in-depth analysis of the challenges and solutions around using asymmetric cryptography, check out [this fabulous article](https://latacora.micro.blog/2019/07/16/the-pgp-problem.html#the-answers) which discusses this topic in much more depth.

## Data Encryption Wrapup

Even though key management can be tricky, if you stick to best practices and outsource the underlying cryptography as much as possible, you should be OK.

Most developers will at some point in their career need to encrypt data. If you need to safely encrypt data for your own purposes, use Amazon KMS. If you *need* to use asymmetric crypto, talk to [an expert](https://latacora.com/) who can help you do the right thing.

And finally, if you need help managing user accounts or user authentication and authorization, you may want to [check us out](https://developer.okta.com/). Our API service lets you store users securely, log them in, reset their passwords, handles social login and single sign-on, etc. It's quite nifty.

Be sure to [tweet at us](https://twitter.com/oktadev) if you're interested in more stuff like this. If you have any ideas for future articles, tech talks, [screencasts](https://www.youtube.com/c/oktadev), etc., let us know!
