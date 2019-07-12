---
layout: blog_post
title: "Cookie Banners: What's The Real Impact on Web Security (And Does Your Site Need One)?"
author: amarch
description: "Do cookie banners impact web security? Does your site need a cookie banner? If these questions are bugging you, we've got answers!"
tags: [security, privacy, laws]
tweets:
- "Do cookie banners impact your website's security footprint? We'll tell you >:)"
- "Are cookie banners actually protecting web users? Or is it just another form of security theater?"
- "Does your website require a cookie banner? Find out!"
image: blog/featured/okta-cookie-banner.png
---

How many times this week have you dealt with an obtrusive, annoying website banner informing you of the site’s cookie policy? Developers are increasingly including boilerplate cookie tracking disclaimers, warning users that they are being tracked, or that their data is being collected. And there’s no real-world need for them as they don’t make a difference to your site’s privacy or security capabilities.

We'll pick apart why these banners are sprouting up now and explain the current legal requirements regarding cookies and consent. We'll also explore whether the banners achieve--well, anything--and whether developers should spend their valuable time implementing them.

## Cookies, Cookie Banners, and the Law

For the last year, developers have been panicking about cookie banners because of language in the EU's [General Data Protection Regulation](https://gdpr-info.eu/) (GDPR), which came into effect on 25 May 2018 and regulates how organizations use the personal data of European users. Some organizations took the drastic step of blocking all European users to avoid the legislation. Most organizations found it easier to apply GDPR regulations to all their activities rather than trying to isolate users by location. GDPR's [Recital 30](https://gdpr-info.eu/recitals/no-30/) defines cookies as online identifiers because companies can combine them with other server information in order to profile and identify people.

Because cookies represent personal data under GDPR, companies technically have to get user consent before using them. Violating GDPR carries potentially hefty fines (as high as 20 million euros), so companies are taking this issue seriously.

This isn't the first EU document mandating the use of cookie banners—[Directive 2002/58](https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX%3A32002L0058) (the ePrivacy Directive) required web sites to get consent for the use of cookies almost 20 years ago. The EU has [proposed](https://ec.europa.eu/digital-single-market/en/news/evaluation-and-review-directive-200258-privacy-and-electronic-communication-sector) a new electronic privacy regulation to simplify the rules around cookies and remove the need for cookie banners. It would enable users to set and forget their cookie preferences once in their browser so that all sites can read them automatically rather than having to ask for consent each time. Unfortunately, this has become [ensnared in bureaucracy](https://eylaw.ey.com/2018/10/04/the-eprivacy-regulation-proposal-a-new-data-protection-framework-for-electronic-communications/) and is still not in force.

Now, as US states implement their own GDPR-like privacy laws, the cookie banner issue is spreading. The [California Consumer Privacy Act](https://www.isipp.com/resources/full-text-of-the-california-consumer-privacy-act-of-2018-ccpa/) has similar language around cookies to GDPR's.

## Do Cookie Banners Work?

Cookie banners may be annoying, but at least they protect user privacy. Right?

*Nope*. Many of them contravene GDPR rules in a clumsy attempt to comply. GDPR demands that organizations give users a legitimate option when asking for consent; they should be able to say no. Yet many cookie consent forms operate on a take-it-or-leave-it principle by omitting the option to refuse. They force visitors to accept the tracking tokens if they want to view the site's content.

The Dutch data protection authority (DPA) calls these faux-choice forms cookie walls, and in March 2019 it issued [guidance](https://autoriteitpersoonsgegevens.nl/nl/nieuws/websites-moeten-toegankelijk-blijven-bij-weigeren-tracking-cookies) explaining that they're illegal. The latest guidance from the German Authorities published in April (partial translation [here](https://deutschland.taylorwessing.com/de/documents/get/1820/guidance-from-german-authorities-for-telemedia-providers-partial-translation.PDF_show_on_screen)) agrees but offers a potential Hail Mary: declaring your use of cookies a legitimate interest for the company.

Proving that you have a legitimate interest in personal data under GDPR can eliminate the need for consent. The problem is, this is subject to a complex interpretation process. Cookies focused on improving visitor experience are more likely to fall under this category. Cookies shared with third parties or across several web sites are not.

## Does Your Site Need a Cookie Banner?

The legal landscape around cookies and consent is still solidifying—and confusing—but generally, whether or not you need a banner depends on how the cookies you collect are used. [Legal advice](https://blogs.dlapiper.com/iptgermany/2019/05/03/conference-of-german-data-protection-authorities-issues-guidance-on-tracking-and-cookies/) says you can tweak your cookie usage with measures like shortening cookie lifetimes and not processing full IP addresses to fall under legitimate interests. However, this approach will take some serious evaluation by your legal team.

Google [advises developers](https://www.google.com/about/company/user-consent-policy-help.html) to use a cookie banner with its cookies—even the ones that concentrate on measures that protect users, like fraud detection—because of the ePrivacy Directive. Remember, GDPR isn't your only concern.

As soon as you get into other tracking activities, the need for explicit consent becomes much clearer because you're being sneakier about how you gather information. These include any tracking measure designed to get around cookie blockers, such as fingerprinting. This technique measures browser properties, including the size of the display portal and its color depth, to identify the browser across multiple sessions, and it's a common technique among advertisers. Other techniques like web bugs (pixels embedded in web pages and emails that communicate information back to their owners) also generally require consent.

## How Should Web Developers Handle Cookie Banners and Web Security?

Cookie banners can arguably have a negative impact on security. It's just one more annoying button to click before they can get to recipes and cat pictures, increasing background noise and making the next legitimate security alert even less noticeable. But how do you escape them?

You have three choices.

First, you can try to prove legitimate interest and drop the cookie banner. Unfortunately, that can be risky. You'd want to have a good legal argument for why you don't need consent and be sure to reflect that reasoning in your privacy policy.

Second, you can play it safe, use a banner, and—there's no getting around this--irritate your visitors. If you take this approach, consider black-boxing this task by entrusting it to a knowledgeable vendor rather than placing yet another burden on your developer team. Google [offers a list](https://www.cookiechoices.org/) of pre-baked solutions configured by experts. Also, provide an opt-out option so that people can withdraw consent. You can also forego more opaque techniques such as fingerprinting and web bugs. Respecting Do Not Track (DNT:1) browser requests would also put you ahead of the privacy curve because [most sites don't](https://gizmodo.com/do-not-track-the-privacy-tool-used-by-millions-of-peop-1828868324).

Your final option is the simplest: just *don't track your users*.

The **worst** thing to do would be to assume that a cookie banner absolves you from the need to properly secure your web-based applications. You'll be hard pressed to find a company that has put users in danger by not displaying a cookie banner. Far more companies fall foul of poorly-written web apps that can leak user data or compromise user sessions. The Open Web Application Security Project (OWASP) publishes a [list](https://www.owasp.org/images/7/72/OWASP_Top_10-2017_%28en%29.pdf.pdf) of the top ten application vulnerabilities that its partners see on a regular basis. The second most prevalent one is poor user authentication. OWASP explains that relying solely on passwords for authentication is one of the biggest threats to web application security (and therefore, privacy). Constant rotation of passwords encourages users to reuse them, write them down, or use easily-guessable passwords. This leaves them open to dictionary attacks and credential stuffing attacks. OWASP also calls out poorly managed application session timeouts as another common problem in user management.

It's time to clear up real security problems like these, rather than using cookie banners to tick a box. In most cases, it's just a compliance tool to give companies peace of mind should regulators come knocking. Until regulators catch up with modern security and user experience needs, companies are trapped with the best of a set of bad options.

## Learn More

Looking for more developer security content? Check out these blogs for insights into developer privacy and security issues:

- [7 Ways an OAuth Access Token is like a Hotel Key Card](/blog/2019/06/05/seven-ways-an-oauth-access-token-is-like-a-hotel-key-card)
- [Is the OAuth 2.0 Implicit Flow Dead?](/blog/2019/05/01/is-the-oauth-implicit-flow-dead)
- [How to Configure Better Web Site Security with Cloudflare and Netlify](/blog/2019/04/11/site-security-cloudflare-netlify)
- [Why OAuth API Keys and Secrets Aren't Safe in Mobile Apps](/blog/2019/01/22/oauth-api-keys-arent-safe-in-mobile-apps)
- [Stolen Access Tokens and You](/blog/2018/10/22/stolen-access-tokens)

For more awesome content, follow [@oktadev](https://twitter.com/oktadev) or subscribe to [our YouTube channel](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q).
