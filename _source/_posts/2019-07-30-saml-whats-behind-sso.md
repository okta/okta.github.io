---
layout: blog_post
title: "SAML: What's Behind SSO"
author: jf
description: "In this short article you'll learn what SAML is and how it works."
tags: [saml, sso, security]
tweets:
- "Do you understand #SAML? If not, check out our new article:"
- "Interested in upping your identity game? Check out our latest article about the #SAML protocol!"
- "We <3 @jf and his breakdown of the #SAML protocol. Check it out!"
image: blog/saml/saml-flow.png
---

Apple's recent announcement of a single sign-on (SSO) solution, [Sign in with Apple](/blog/2019/06/04/what-the-heck-is-sign-in-with-apple), has developers everywhere thinking about how to incorporate it into their application's infrastructure. Apple is hardly the first organization to introduce SSO—it's a security-focused methodology that has been available for years—and one of the protocols behind it is SAML.

The SAML protocol lets users prove their identities across multiple applications with just one set of login credentials. It was ratified in 2002 by the Organization for the Advancement of Structured Information Standards (OASIS), pulling together a number of existing standards. At its core, SAML allows identity providers (IdPs) to store user identity data and authenticate those users to other applications using public-key cryptography. For developers, this means SAML lets users log into their applications without using passwords.

An identity provider (IdP) can be a cloud-based identity service like [Okta](/signup/), or an internal enterprise resource like Active Directory. Meanwhile, a service provider (SP) is the application a user wants to access, like Salesforce or Slack. As long as the IdP can authenticate the user, the service provider (SP) will let them in.

## How SAML Works

When a user logs into an application using SAML, the IdP will send a SAML assertion to their browser that is then sent to the SP. In many circumstances, the IdP will want to very the user before issuing a SAML assertion (using multi-factor authentication (MFA), for example).

The SAML assertion is an XML file with three statement types: authentication, attribution and authorization. The first contains details about when and how the subject is authenticated; the second provides details about the user, such as group membership or their role within a hierarchy; and the third tells the SP the level of authorization the user has across different resources. This way, SAML goes beyond mere authentication and authorizes the user for different privileges, protecting your application in the process.

## How SAML Keeps Your Apps Secure

Without SAML or other SSO technologies, applications would have to rely on passwords to verify their users, which is problematic. It's no secret that passwords are an easy target for attackers, particularly when people resort to commonly-used or easily-guessed options like "123456", or reuse the same password across various applications. Because of this, it's costly and risky for organizations to store passwords on their own systems.

With SAML, SPs only have to store public keys, which are useless to attackers without the private keys held by the IdP. This shifts the responsibility of storing sensitive information or credentials to the IdP. So if an SP is hacked, or a disgruntled employee leaves their company with sensitive data, all they'll have access to are names—not passwords. In the same way, when an account is disabled, the user will no longer have access to their systems because they will be unable to create a SAML assertion to prove their identity.

## Why Do Organizations Still Trust SAML?

Despite the fact that SAML is not the most secure SSO protocol—OAuth 2.0 and [OpenID Connect](/blog/2017/07/25/oidc-primer-part-1) were designed to improve on its weaknesses—SAML still sees a great rate of adoption. It is the protocol most organizations associate with and use for SSO and enterprise security. The primary appeal comes from the fact that SAML helps reduce the attack surface for organizations and improves customer experience when logging in.

At the enterprise level, large organizations that provide their employees or customers with access to multiple third-party applications will likely refuse to onboard an application that doesn't support SAML. As a result, application developers looking to sell their product to these companies are aware of the need to implement SAML into their infrastructure.

## How Should You Implement SAML?

Before you even consider SAML, you'll need to change your application to operate with an IdP for user authentication. Usually, this means changing your login page from prompting for a username and password to *just* a username. Then, if a user's account is managed by a third-party IdP, you can then redirect the user to that IdP so they can authenticate directly there, before being redirected back into your application.

While SAML may seem simple to implement, a lot can go wrong if you choose to do it yourself. A small mistake can have a massive negative impact. You should bring in a specialist who knows how to implement the right off-the-shelf SAML software for your application.

## How Does Okta Support SAML?

Within the SAML workflow, Okta can act as both the IdP and SP. When a user requests access to a third party application registered with Okta, they are redirected to the Okta dashboard. Okta can additionally support MFA prompts, etc. to improve your application's security footprint. As the IdP, Okta then delivers a SAML assertion to the user's browser, which it then uses to authenticate itself to the SP.

{% img blog/saml/saml-flow.png alt:"SAML flow" width:"600" %}{: .center-image }

Alternatively, Okta can also act as a SAML SP. In this scenario, if a user tries to log in to Okta, they would be redirected to an IdP like CA SiteMinder or Tivoli Access Manager for authentication. The IdP would return the SAML assertion (after the user has successfully authenticated) which is what the user's browser would then use to access Okta's service.

{% img blog/saml/saml-third-party-flow.png alt:"SAML third-party flow" width:"600" %}{: .center-image }

Of all the functionalities under the SAML 2.0 umbrella, Okta only supports the components with consistent industry use. This includes the assertion query and request, authentication request, and HTTP redirect and post protocols. A number of other features aren't used anymore, and new emerging protocols like OpenID Connect streamline SSO for SPs and IdPs alike.

If you want to learn more about SAML and the benefits of SSO, check out this content from the Okta developer blog:

- [A Breakdown of the New SAML Authentication Bypass Vulnerability ](blog/2018/02/27/a-breakdown-of-the-new-saml-authentication-bypass-vulnerability)
- [Get Started with Spring Boot, SAML, and Okta](/blog/2017/03/16/spring-boot-saml)
- [What the Heck is OAuth?](/blog/2017/06/21/what-the-heck-is-oauth)
