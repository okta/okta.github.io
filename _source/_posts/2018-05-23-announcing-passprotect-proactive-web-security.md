---
layout: blog_post
title: "Announcing PassProtect - Proactive Web Security"
author: rdegges
description: "A look at our new developer library (and browser extension): PassProtect. PassProtect integrates with haveibeenpwned to check credentials you use against breached data lists, and notifies you when something bad happens."
tags: [security, developer, javascript, chrome, browser]
tweets:
- "We built a thing. It's called PassProtect. Learn more here!"
- "We just released our new open source browser extension and developer library: PassProtect. It's powered by @troyhunt's @haveibeenpwned service. Check it out!"
- "Want to know when the credentials you use everyday have been exposed in a data breach? Check out PassProtect, our newest open source project:"
---

If you're reading this article you probably care about web security. You probably use a password manager to manage your passwords, you've probably got [multi-factor authentication](https://2fanotifier.org/) setup for all of your services, and you're probably already subscribed to [Have I Been Pwned?](https://haveibeenpwned.com/) so you're alerted when one of your logins have been involved in a data breach.

But *you're* not most people.

Most web users are completely disconnected from the incredible advancements that have been made in the web security world over the last handful of years. Most web users aren't notified when their credentials are leaked in a data breach, and to make matters worse, most users whose credentials *are* breached never reset their passwords.

Wouldn't it be great if the websites that users visited every day could automatically notify users when the credentials they're using are unsafe? This would give them the opportunity to change their unsafe passwords before attackers can take advantage of them. It would give them the knowledge they need to take the security of their personal information into their own hands.

This is what our new developer library, [PassProtect](https://github.com/oktasecuritylabs/passprotect-js), enables.

Instead of being the victim during a breach, PassProtect transforms even the most casual internet users into data security experts on par with you and I.

The way PassProtect works is simple, by including a single JavaScript tag in your web pages, your users will instantly start getting notifications if the credentials they've entered on your site are unsafe.

```html
<html>
  <head>
    <!-- ... -->
  </head>
  <body>
    <!-- ... -->
    <script src="https://cdn.passprotect.io/passprotect.min.js"></script>
  </body>
</html>
```

What do users see? An informative notification that gives them the information they need to make a good choice:

{% img blog/passprotect/passprotect-demo.gif alt:"PassProtect Demo" %}{: .center-image }

PassProtect is built with casual users in mind, and provides simple but informative notifications. To avoid being annoying, PassProtect uses smart caching to ensure notifications are never repeated in a single session in any way that would hurt user experience.

Furthermore, PassProtect piggybacks off the fabulous [Have I Been Pwned?](https://haveibeenpwned.com/) service, the largest database of breached credentials on the internet (created by our friend, [Troy Hunt](https://www.troyhunt.com/)).

And because the data PassProtect works with is so sensitive (user passwords), we ensure that PassProtect never stores, collects, or send any password data over the network. Instead, PassProtect relies on [k-anonymity](https://blog.cloudflare.com/validating-leaked-passwords-with-k-anonymity/) (created by our friends at Cloudflare), which just so happens to be the best way to verify that a password exists in a remote database without ever sending that password (or the full hash of that password) over a network. =)

Don't believe me? Check out [the source](https://github.com/oktasecuritylabs/passprotect-js)!

This all sounds great, right!? The only problem is that our goal of dramatically improving the security of casual web users will only be realized if every developer embeds PassProtect in their websites. This is why I also went ahead and built a Chrome Extension for PassProtect as well. Firefox support will be coming soon.

This way, web users who want to go ahead and take advantage of PassProtect directly can do so—this way *every* website they visit will instantly inherit PassProtect's functionality automatically!

Nothing is truly secure. At some point or another, all systems will be subject to a vulnerability of some sort. Security will always be a cat-and-mouse game between attackers and defenders, and to win you need to hope for the best but prepare for the worst.

We sincerely hope that PassProtect will help make the negatives (data breaches) a lot more positive by empowering individual users to reset their credentials when necessary and take charge of their personal data security.

If you'd like to get PassProtect for your website, please check out our [GitHub repo](https://github.com/oktasecuritylabs/passprotect-js) (which contains far more information). If you'd like to use PassProtect in your browser, please check out our [Chrome Extension](https://chrome.google.com/webstore/detail/passprotect/cpimldclklpfifolmdnicjnfbjdepjnf).

Be safe out there! &lt;3

**PS**: If you've had a chance to play around with [PassProtect](https://www.passprotect.io) please let me know what you think!  Leave a comment down below or shoot me [an email](mailto:randall.degges@okta.com).
