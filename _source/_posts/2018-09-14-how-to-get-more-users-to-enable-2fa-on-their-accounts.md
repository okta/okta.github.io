---
layout: blog_post
title: 'How to Get More Internet Users to Enable 2FA on Their Accounts'
author: cgilsenan
description: "Interested in ways to improve two-factor authentication for your users? We'll teach you how to grow two-factor adoption and build a more secure userbase."
tags: [security, mfa]
tweets:
 - "Want to build a more secure userbase? Get your users to enable two-factor authentication! Our buddy @conorgil wrote an awesome guide you might enjoy on the topic:"
 - "We love two-factor! Learn how @conorgil is helping push for 2fa adoption in our latest post:"
 - "Multi-factor authentication is a great security tool, but it only works if users enable it! Learn how to increase user adoption of 2fa in our latest article, written by the one-and-only @conorgil:"
image: blog/2fa-notifier/2fa-enabled.png
---

If you are reading this article on the Okta Developer blog, chances are high that you are already quite familiar with two-factor authentication (2FA) and how it helps keep hackers out of user accounts even if they're using compromised passwords.

You probably already have 2FA enabled on all of your online accounts.

Sadly, you are in the significant minority.

## Most People are Not Using 2FA

Duo Security conducted a survey to research perceptions and adoption rates of 2FA among average internet users. The results, published in the State of the Auth, were sobering.

They found that only ~28% of people in the US currently use 2FA. That means the other ~72% of average internet users are only securing their accounts with a password. That is frightening, especially considering that the [majority of passwords are complete garbage](https://www.troyhunt.com/86-of-passwords-are-terrible-and-other-statistics/) because [people are downright awful at creating good passwords](https://www.troyhunt.com/science-of-password-selection/).

That 28% figure also generally aligns with the low 2FA adoption rates reported by some major service providers. In January 2018, [Google stated](https://www.theregister.co.uk/2018/01/17/no_one_uses_two_factor_authentication/) that less than 10% of active Google accounts have enabled 2FA. Though a bit dated and hopefully improved in recent years, Dropbox [said](https://blogs.dropbox.com/business/2016/02/dropbox-customer-data-safety/) that their 2FA adoption rate was **less than 1%** as of June 2016.

Even more concerning, the same report found that only ~56% of people even knew what 2FA was before they took the survey. *Let that sink in a moment.* While you and I likely have 2FA enabled on all of our accounts right now, the majority of average internet users do not even know what 2FA even is! Certainly, they won't go about enabling it on their accounts if they don't know that it exists.

For those who do know that 2FA exists, many still can't identify it when they see it. Pew Research Center conducted a [cybersecurity quiz](http://www.pewinternet.org/2017/03/22/what-the-public-knows-about-cybersecurity/) in which only 10% of users could correctly identify two-step authentication when presented with a set of options including a code sent to an email account, a reCaptcha, some knowledge-based security questions, and one of those ridiculous "security image" prompts.

**There is a fundamental education gap between the majority of internet users and the tech literate when it comes to 2FA.**

## Close the 2FA Education Gap

I see two parallel approaches to address the education gap.

First, we need to build better authentication solutions. Users should be leveraging strong authentication on all of their accounts without even realizing it. Milestones like the major browsers announcing [support for the WebAuthN API](https://motherboard.vice.com/en_us/article/8xkvb3/webauthn-google-chrome-microsoft-edge-mozilla-firefox) are an exciting step in that direction. However, it's still early days, and WebAuthN likely won't become ubiquitous for the average internet user anytime soon.

In the meantime, the second approach is to continue educating users about existing 2FA solutions that they can use to protect their accounts today. There are some great resources aimed at helping users do just that.

The site [twofactorauth.org](https://twofactorauth.org/) maintains a searchable list of websites and whether or not they support 2FA. Websites that do support 2FA also have a link to their support documentation explaining how to enable 2FA on your account.

Another helpful resource is [turnon2FA.com](https://www.turnon2fa.com/), which provides step-by-step tutorials to enable 2FA on hundreds of different sites.

As useful as these resources are, the main drawback of both is that users need to go out of their way to *proactively* use them. The old saying "out of sight, out of mind" seems fitting here. I focus on 2FA professionally, and even I often forget to check those resources regularly to see if a new service I am signing up for supports 2FA. I think the average internet user is likely to forget too.

## Enable Wider 2FA Adoption Passively

Wouldn't it be awesome if we could educate users about which sites they visit support 2FA without them having to do anything?

That is what [2FA Notifier](https://2fanotifier.org/) makes possible.

2FA Notifier is an [open source web extension](https://github.com/conorgil/2fa-notifier) for Chrome and Firefox built by [yours truly](https://twitter.com/conorgil) and my partner in crime, [Ray Gonzales](https://ray-gonzales.com/), that notifies users anytime they visit a site that supports 2FA.

{% img blog/2fa-notifier/2fa-notifier.png alt:"2fa Notifier" width:"600" %}{: .center-image }

The extension leverages data from [twofactorauth.org](https://twofactorauth.org/) and other sources to determine whether the site in the current browser tab supports 2FA. If it does, then the user gets a notification directly in their browser window letting them know! Better yet, users can click the notification to go directly to the site's support documentation telling them how to actually enable 2FA on their account.

Even if the user misses the notification, the extension icon also updates to indicate whether the current site supports 2FA or not. Clicking on the icon opens a menu that clearly explains whether 2FA is supported and also provides a link to the setup documentation.

{% img blog/2fa-notifier/2fa-enabled.png alt:"2fa Enabled" width:"600" %}{: .center-image }

Users can also easily tell 2FA Notifier that they have already enabled 2FA for the current site, which prevents it from throwing notifications in their face every time they visit that site. The goal is to provide users with the information they need to take action and then get out of the way.

Install [2FA Notifier](https://2fanotifier.org/) and take it for a spin. See which sites you visit support 2FA and make sure to enable it if you haven't already. Most importantly of all, share 2FA Notifier with your friends, family, and coworkers who would benefit the most from a friendly reminder to enable 2FA on all of their accounts!

PS: You can follow me on Twitter ([@conorgil](https://twitter.com/conorgil)) to hear about 2FA Notifier feature improvements and read my articles on 2FA and related topics at [AllThingsAuth.com](https://allthingsauth.com/).
