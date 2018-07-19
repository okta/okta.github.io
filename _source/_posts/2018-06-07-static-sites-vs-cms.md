---
layout: blog_post
title: "Static Sites vs CMS"
author: rdegges
description: "Are you trying to decide whether or not to build your website using a static site generator or a content management system? If so, you'll enjoy this."
tags: [programming]
tweets:
 - "Static sites or content management systems? Which do you prefer? Read the smackdown by @rdegges >:)"
 - "We love static sites! Read more about why in our latest article by @rdegges about tools like #jekyll and #hugo"
 - "Static Sites VS Content Management Systems: only one can survive!! Read our thoughts about #web development in @rdegges' new article:"
---

{% img blog/static-sites/nerd-fight.gif alt:"Nerd fight!" %}{: .center-image }

There's a frequent debate amongst development and marketing teams at companies around the world about whether or not their blog or website should be managed through a content management system (CMS) like Wordpress, Drupal, Squarespace, etc. or through a static site generator like Jekyll or Hugo. I've been blogging since 2006, writing websites since 2002, and I've built just about every possible type of website. Today I'd like to explain why static sites are the superior choice in almost every possible circumstance.

**Disclaimer**: This advice is specifically for web teams comprised of technical people (mainly developers). If your company doesn't have technical staff I still hope you'll find this information useful, but my advice may not apply.

So, why are static sites the best?

## Static Sites are Fast

There are no faster websites in the world than websites built using static site generators. This is a fact.

The reason this is true is because dynamic websites, like those powered by Wordpress and Drupal, require that you (the site creator) have a web server running some code (PHP in this case), which responds to incoming web requests, then displays some content (a blog post, etc).

This is a very **slow** way of doing things, because it means that for each user who visits the site, the PHP code running behind the scenes need to start up, talk to a database, potentially talk to one (or more) caching servers, and execute a lot of logic before being able to render or display the page.

When you use a static site generator like Jekyll or Hugo, however, these tools take your content (your articles, your HTML, etc.) and run some code **once** to transform them into their final output formats: HTML, CSS, and JavaScript. This way, a visitor to your site is sent the static page files directly without any processing.

This is **much** faster and simpler.

**Fun Fact**: *Googlebot and all of Google's search ranking algorithms heavily favor fast websites over slow ones.* When two sites have similar content, but one is faster: the faster one will usually have a higher page rank. See: [https://moz.com/blog/how-website-speed-actually-impacts-search-ranking](https://moz.com/blog/how-website-speed-actually-impacts-search-ranking) for details.

## Static Sites are Secure

CMS systems (especially those built on PHP like Wordpress and Drupal) have abysmal security records. It can be incredibly difficult to maintain a CMS, keep it up-to-date, and constantly apply security patches to ensure it won't be easily abused by attackers. Unless you're an expert in the CMS and spend all your time managing it, security issues are bound to crop up.

Google "Drupal hack" or "Wordpress hack" to see what I mean. Millions of Drupal and Wordpress sites are compromised *all the time*. Here are some examples:

- [Millions of Websites Hit by Drupal Hack (BBC)](http://www.bbc.com/news/technology-29846539)
- [Drupal Patches Critical Password Reset Vulnerability](https://thehackernews.com/2015/03/hacking-drupal-website.html)
- [Drupal SQL Injection Vulnerability Leave Millions of Websites Open to Hackers](https://thehackernews.com/2014/11/drupal-sql-injection-vulnerability_2.html)
- [Your Drupal site got hacked. Now what?](https://www.drupal.org/docs/develop/security/your-drupal-site-got-hacked-now-what)
- [Etc...](https://duckduckgo.com/?q=drupal+hack&atb=v18&ia=web)

There are hundreds of tools that anyone can easily download and run which attempt to compromise existing Wordpress and Drupal sites automatically, by trying all previously known vulnerabilities against the CMS systems, looking for holes.

This is such a common occurrence that CMS systems like Wordpress and Drupal require specialized hosting systems to ensure this does not happen, and that the scope of security vulnerabilities (when discovered) are minimized as much as possible. The amount of maintenance required to keep a Wordpress / Drupal site secure is a job on its own.

Static sites, on the other hand, are impossible to hack: there is no code running, and thus no vulnerabilities to exploit! For a security company like [Okta](https://developer.okta.com/), where security is fundamental to the company's mission and objective, this is a great benefit.

## Static Sites are Friendly for Developers

At Okta, our developer documentation and blog are primarily written / edited / managed by a technical group of people. Using Git and Git tools are inherently native to the team. If your company's site is managed by a primarily technical audience, some subset of this may also be true.

Static site generator tools are well known in the developer community at large. They carry a very positive reputation and almost everyone is familiar with them. Using one is a sign that an organization understands engineers and engineering problems, and is committed to providing quality user experiences.

As web teams continue to scale out the amount of contributors / editors / staff that are working on web projects, sticking to the 80/20 rule is paramount: get 80% of the benefit with 20% of the work. Static site generators are the way to go here:

- They are easy to understand for developers and non-technical users alike.
- With very minimal instruction ANYONE in the organization can contribute. There is a very low barrier to entry.
- They allow for much more controlled editorial than CMS systems do, something that is particularly important when writing technical content.
- They allow for more precise editing (eg: code blocks, technical project testing, etc.) These things are not easy to accomplish in CMS systems using their web editors.

Most developers enjoy working with static site generators, and are much happier using those than CMS systems.

For more info: google "Drupal sucks" and "Wordpress sucks". Here are some examples:

- [Top 6 Reasons Drupal Sucks](https://www.freelock.com/blog/john-locke/2011-10/top-6-reasons-drupal-really-sucks-developer-edition)
- [The Death of the CMS](https://medium.com/@davide.borsatto/the-death-of-the-cms-cec078a0d1b9)
- [Why I Hate Drupal](https://www.slideshare.net/owenbrierley/why-i-hate-drupal-with-a-nod-to-james-wagner)
- [Etc...](https://duckduckgo.com/?q=drupal+sucks&atb=v18&ia=web)

**PS**: Don't even bother looking at [HackerNews](https://news.ycombinator.com/) comments about Drupal. They're savage.

## Static Sites Provide Simple Permissioning

CMS systems like Wordpress and Drupal have their own permission systems. You can create users, admins, and assign people certain types of privileges.

This is also true regarding static site generators if they are built use Git and GitHub, which has a very sophisticated security model that allows very specific controls around who can do what, and when.  You can have project admins with unlimited powers, read-only editors who can submit suggested changes to articles pending review, and editors who can review and release changes to the website. Furthermore, most companies already use GitHub to manage employee access to projects, so this fits perfectly into existing workflows.

This model works well in terms of editing privileges for any large editorial team. Furthermore, this process has been used successfully even for **enormous** websites and teams. For instance: healthcare.gov (the website that powers all health plan selections and receives millions of visitors all the time) is built 100% with Jekyll with tremendous success: [https://developmentseed.org/blog/2013/10/24/its-called-jekyll/](https://developmentseed.org/blog/2013/10/24/its-called-jekyll/).

**Fun Fact**: Remember how much backlash heathcare.gov got when it first came out? The main reason for the really poor initial launch was that they used a CMS system which was unable to withstand user demand and caused a majority of their issues. See: [http://www.newsweek.com/inside-healthcaregovs-failure-1449](http://www.newsweek.com/inside-healthcaregovs-failure-1449).

After saving the healthcare.gov project by switching to Jekyll, the new standards group inside the government team started rolling out Jekyll as a new standard for modern, secure, government websites.

## Static Sites are Scalable

Because websites and blogs are an important channel for any company, uptime, speed, and reliability are paramount.

In this arena, static sites shine through above all other options.

- They are infinitely scalable when hosted on Amazon (S3 + Cloudfront). Or, if you'd like a simpler solution: [Netlify](https://www.netlify.com/).
- They can be easily deployed worldwide so that users in China see your website just as fast as a user in Kenya, or Tokyo, or California.
- They can be globally cached in an extremely simple way that requires no ongoing technical maintenance.
- They can be deployed and updated near-instantaneously, without delay.

The above features are not always true of CMS systems (like Wordpress and Drupal). These systems often have caching plugins that must be used to handle higher visitor traffic, and these typically cause technical issues when you want to immediately deploy changes to a website, or recover from mistakes. Getting these working properly can be a very difficult job (we had tremendous issues with this at my previous company, and I've personally seen these issues cause problems at many other companies).

Using CMS systems means that the database server which stores the content (web page content, article content, etc.) must also be highly available. These CMS systems use MySQL as their database and require not only web server scalability, but also database scalability, cache scalability, and other things. Doing a good job at scaling a CMS website is exponentially more difficult than doing so with a static site, which is designed for scale without any additional infrastructure, web servers, or work.

## Static Sites are Cheap

Running a static site is inexpensive. For a site serving millions of visitors per month that is globally cached and is highly optimized for speed / availability: most companies would need to spend only a few dollars per month in hosting costs.

Compare this to the cost of running a Drupal website, you would need to pay for:

- A company to host the site (this can easily cost thousands of dollars per month or more, for even small installations).
- Ongoing support / maintenance costs from contractors (this can be very expensive as well).
- Lots of time updating the system every few months, applying patches, taking backups, etc.
- Working with contractors to customize the behaviors of Drupal to make it suitable for team needs, etc.

The cost comparison is greatly in favor of static sites in every possible way. Static sites require less time, energy, manpower, and infrastructure cost.

## Static Sites are Easy to Use

In order to use a CMS system like Drupal to manage a website, blog, etc., there is a lot that each contributor needs to learn to be successful:

- How to request / receive permissions to write / make changes.
- How to navigate through the UI and edit / create / manage articles / pages.
- How to insert code blocks and other special types of markup using the built-in web editors.
- How to publish articles, go through a review process, and preview articles.
- How to modify existing articles to fix issues, how to make suggested edits to other people's content / pages, etc.
- And many other things..

To successfully run a static site project, there is really almost nothing contributors need to know other than:

- How to open a text editor and write their article / content. (this is called markdown)
- What folder to store their article in. These folders are usually very easy to find (eg: `2017/my-article-name.md`).

Instead of needing to request / get permissions to the website, all someone needs to do is visit the website repository on GitHub, fork it, and then add whatever they want (this includes fixing other people's typos, grammar, etc. in a simple way). This can all be done in the web browser with limited technical knowledge required.

Once someone has made changes to the website, they can create a pull request and an editor on the team will be immediately notified that someone has changes available, can review them, and then either merge them in or ask the contributor to make modifications. GitHub makes collaboration extremely easy.

Static sites can be set up to automatically deploy user changes into a staging environment to make it easier for editors to review changes, and require zero command line knowledge to work.

## Static Sites Provide Powerful Editorial

There is no system more powerful for managing large projects and websites than Git and GitHub. The system is designed from the ground up to make collaborating with other project contributors as simple (and powerful) as possible:

- You can instantly review any past changes to a page, article, etc. Going back to the beginning of time.
- You can easily switch back and forth between changes, edits, etc. Making it possible to fix mistakes instantly and precisely.
- You never have to worry about things getting accidentally deleted or removed because Git holds onto these memories indefinitely.
- Anyone can get started contributing to the website without any prior permissions needed (they can add their changes, and submit them for review).
- Editors immediately are notified when a contributor want to make changes, and can instantly review their changes and either accept or reject them. This makes contributing extremely simple and painless for all parties.

Compare this to the way CMS systems like Wordpress and Drupal manage editorial:

- Each contributor must be given access to the system (this is management overhead).
- Each contributor must be given special permissions so they know what they are allowed / not allowed to do.
- To have editorial notifications enabled, you must use special third party plugins.
- Edit history storage is not unlimited, and is very hard to switch out. EG: If someone edits an article incorrectly, and you want to "revert" their changes, it is a very large hassle.
- Edit history is limited, so if you delete something accidentally: this can be a massive issue. There may be no way to easily recover this information.
- Editing is done "inline": this means editors must modify content directly as opposed to in a separate state where changes can be tested / agreed upon by both parties.

If you compare the two: it is clear that the Git workflow provides more control, safety, and ease of use for editorial for all parties involved.

## Static Sites are Customizable

Content management systems are massive programs. They are very complicated, and have many moving parts: the platforms get updated, plugins (first and third-party) get updated, and there are many areas that can be customized.

Customizing CMSes can be an extremely time consuming, difficult, and error-prone task, even for experts.

For instance: supporting developer-friendly web editors that output Markdown, handling custom permissions and workflows to accommodate editorial, and even managing theme files, stylesheets, and custom JavaScript code can become a very time consuming process.

Compare this work with that of customizing a static site generator website: it is vastly simpler. Instead of having to have a contractor spend many hours tweaking things, team members can directly make changes they need, can easily review changes, merge them in, and roll out fixes.

Using a static site generator also enables **anyone** at your company to easily suggest or contribute changes to the website: style fixes, new components, etc. By enabling more people to easily get involved and contribute, you can greatly scale up output with very little effort. This would be impossible to do using a CMS system.

Another huge part of customization is SEO. This is always a concern. For instance: having tools that can measure things like keyword density, ensure that titles are the correct length, ensure that meta description tags are the correct length, etc.

These things are significantly more powerful using static sites as you can automate these items and codify rules around them. You don't need to install third-party plugins and learn new flows: you can codify this behavior and instantly enforce it across the entire project.

In regards to more advanced SEO editing (for instance, using HTML5 metadata which Google includes in their search algorithm rankings): a static site generator is your only choice. CMS systems like Wordpress and Drupal don't support this level of customization at all (unless you're willing to manually edit each and every article's raw HTML), because you're essentially controlling the output of the program directly. With static site generators, however, there are numerous ways to accomplish this, to ensure that things like:

- Dates are correctly formatted and marked up with HTML5.
- Time ranges are correctly formatted and marked up with HTML5.
- Assets that need to be preloaded or prefetched can be included to speed up rendering of complex code samples / media.
- Etc.

Overall: there is nothing more customizable / powerful than a static site generator for contributors or editors to use.

## Static Sites Provide "Ownership"

I strongly believe that owning core parts of your product leads to a good user experience.

For instance: here at Okta, we are a security company. Because of this, we have an in-house security team which helps ensure Okta products are held to a higher standard. For our core IT dashboard service: we hire in-house engineers who spend their time and care carefully building quality products for Okta users.

We would not outsource our core engineering team: and thus we should not outsource our technical blog and documentation, either.

Because our blog (and developer docs) are critically important to our success, we should completely own and control this part of the product to ensure we can hold it up to extremely high quality standards.

This is something that becomes vastly more difficult when a third-party company is managing our website, our CMS, and making changes and fixes to our web properties.

Take a look at any outsourced products, and compare them to in-house products: with very few exceptions, in-house projects are almost always better.

## Static Sites are Portable

CMS systems like Drupal and Wordpress store all content inside of a database, using very specific formatting. If your company ever decides to migrate to another platform in the future, migrating is a **very** hard thing to do.

This is because there is no easy way to export your data out of Drupal or Wordpress into a plain text format that can be easily imported into other systems.

CMS systems like Wordpress / Drupal provide a lot of vendor lock in which makes porting your project to another system incredibly hard in the future.

Compare this with static site generators like Jekyll and Hugo: your content is stored in its original format, without modification, forever. Moving from a static site generator to any other system is incredibly easy as there is no vendor lock in whatsoever. This gives you the flexibility in the future to shift to other systems with as little effort as technically possible.

## Static Sites are Reliable

One of the major reasons companies prefer static site generators is reliability. Using a static site generator like Jekyll or Hugo allows you do things like:

- Automatically test articles for broken URLs.
- Automatically find broken images and image links.
- Look for broken style rules and obvious UI errors.

Doing these things with a CMS system requires heavy customization and is very brittle.

Using a static site generator gives your organization much more control over the quality of your edits and articles, because you can easily automate testing for them! This reduces the editor's burden, as well as the burden of the team itself.

## Static Sites vs CMS: A Summary

Using a static site generator provides numerous benefits over what any CMS can provide:

- They are secure
- Developers enjoy using them
- They are fast
- The are easy to use even for those with minimal technical expertise
- They scale with 0 effort
- They cost exponentially less money to operate
- They require minimal maintenance effort
- They have a positive reputation in the developer community, and signify a strong engineering culture and team to outsiders
- They support more advanced, useful editorial than any CMS provides
- The enable anyone in the organization to contribute to the website, blog, documentation. You can leverage this to more easily expand contribution efforts.
- If you decide to move to another platform in the future, migrating away from a static site generator is *much* easier than anything else

If this post was helpful, you might really enjoy taking a look at our service, Okta: [https://developer.okta.com](/).

We're an API company that stores user accounts and handles things like authentication, authorization, social login, single sign-on, etc. It's easy to get started and we have an **epic** free plan for developers (like you). If you want to give it a go, you can create a free account here: [https://developer.okta.com/signup/](https://developer.okta.com/signup/).

And just in case you're wondering, the answer is **yes**. The blog you're currently reading is powered by a static site generator (and open source on GitHub). We're currently built using Jekyll but are transitioning to Hugo. =)
