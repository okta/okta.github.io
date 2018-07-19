---
layout: blog_post
title: "How to Expand Your UX to a New Audience"
author: adahl
tags: [design, okta, ux, process]
description: "Interested in expanding your UX to a new audience? So were we! Read more about how we did it here."
tweets:
  - "How do you expand your UX to a new audience? Here's how we did it at Okta."
  - "Designing for different types of users is hard. Here's how to take it step by step."
  - "What's going on inside the minds of your designers? Take a peek at how one of ours worked through a project."
---

As your business grows, you'll probably reach a point where you need to grow your audience as well. Not just acquire more customers in your target segment, but expand to more segments and new types of customers. How do you adapt your product to your new audience? How do you avoid a "least common denominator" solution that isn't great for anyone?

At Okta, we faced these questions when [the Stormpath team joined](https://www.okta.com/blog/2017/03/stormpath-welcome-to-Okta/) the company last year. The Okta Identity Cloud is a complex enterprise platform that was designed for IT administrators who manage employee identity. As a product designer who joined Okta from Stormpath, I faced a big challenge. How could we ensure a great experience for an additional audience: developers building customer identity into their apps?

I had previous experience pivoting to different audiences at other startups, where we kept the core product while replacing who it was for. But at Okta, this wasn't a pivot: we needed to provide great experiences for multiple audiences with very different perspectives and use cases. And we needed to solve this as new hires on a team going through big changes.

## Set Expectations Within Your Design Team

**Get buy-in from your team, and support from management.** This is a big project.

While Okta's executives had clearly made this a priority, I was worried that individual team members might see us as outsiders or resist doing things differently. Thankfully, everyone was open to new ideas and focused on delivering the best experience for our users.

The designer working on developer experience before me, Shawn, gave a great handoff and encouraged me to find my own paths.

<div style="max-width: 560px; margin: 0 auto">
<em>"In design, there are usually multiple ways to tackle a problem, and it can constrain the new person's creativity and problem solving if they need to run with the decisions made before them. I think our best work, and ultimately the best solution for our users, comes out when designers have the freedom to explore and try many solutions." &mdash;Shawn Gupta, Product Design Architect at Okta</em>
</div>

With an open road ahead of you, adding a new audience can feel a lot like starting over. You have to [figure out what to build](https://www.invisionapp.com/blog/how-do-you-decide-what-to-build/): what does your audience need?

But it's different than doing it from scratch. **Don't throw out the good stuff.** Your team learned a lot building for your existing audience, and you had good reasons behind what was designed before. Be prepared to investigate which of those reasons are also relevant to the new audience. If nothing you've done still makes sense, do you have the right audience?

## Understand Your Audience

**Research, research, research.** Application developers were a different audience for Okta, so our design team had already started user interviews and usability testing before I arrived. The team that joined from Stormpath had a lot of institutional knowledge, but it wasn't well-documented.

One of my first activities was to codify and consolidate everything we knew about our audience into our team wiki. Segments, personas, use cases, success criteria, peer companies – it's all in one place for anyone in the company to reference.  I maintain this documentation today as a living document and guiding star.

## Analyze What Exists Today

**Survey your current landscape.** What's the experience currently like?

We did an inventory of all current features, and documented all the touchpoints where developers would interact with Okta. This is more than just UIs – for us it includes email campaigns, technical documentation, even how people sign up and pay.

What features are missing? What needs to change for your new audience? How is their mental model different?

Crucially, **what can be the same for both audiences?** If it ain't broke, don't fix it. When flagging a problem for our new audience, we also evaluated if our existing audience would benefit from improvements in that area.

## Explore and Execute

Now you've identified problems you need to solve. It might be a lot, but take them one at a time. **What are different ways you could solve these challenges?**

A big challenge for us was to decide on an overall architecture. Could we evolve a single experience to work for both audiences? Or would we need to develop completely separate products optimized for each audience? There was no clear answer, but a lot of tradeoffs.

From a user perspective, we ultimately decided to fork into two separate products. IT customers continue use our existing admin UI, while developers sign in to a [new developer console](/blog/2017/09/25/all-new-developer-console). The flows, information architecture, and branding are designed to serve each audience's specific needs. But under the hood, both products are in a single codebase and share many components and views.

With a core architecture decided, it's time to go to work. While special concerns will keep coming up, it's mostly your normal design process. **Make sure to stay agile**, and not get stalled in the search for something perfect. We needed to move very quickly, so our goal was to ideate and converge with a bias toward velocity.

{% img blog/how-to-expand-your-ux-to-a-new-audience/expand-ux-dashboard.png alt:"Developer Dashboard Wireframes" width:"560" %}{: .center-image }

<center><small><a href="https://dribbble.com/shots/3805509-Okta-Developer-Dashboard-Exploration">Some of our exploration</a> for a new developer dashboard.</small></center>

## Validate Your New UX

**Don't forget to keep researching.** Are the decisions you're making actually going to work?

Even though we were moving fast, we made sure to test our hypotheses. Through moderated usability tests with an Invision prototype, we got real feedback from potential customers before we shipped. We learned some things were really successful, and other things weren't.

Based on what we learned, we made a number of changes before our first release. Other problems needed more time to dig in deeper, so we documented additional issues to improve upon later.

## Ship It!

To keep the feedback cycle going, ship as soon as you can. Maybe that's a small beta, or maybe it's a big release. In our case, we were privileged to have a major conference demo.

<div style="max-width: 560px; margin: 0 auto">
<p><em>"I wasn't expecting applause just for showing the developer dashboard, but people were excited. I knew we were on the right track." &mdash;Nate Barbettini, Product Manager at Okta</em></p>
<p></p>
</div>

<div style="max-width: 560px; margin: 0 auto">
<iframe width="560" height="315" src="https://www.youtube.com/embed/53jnHhfS00o?start=4170" frameborder="0" allowfullscreen></iframe>
</div>

**Celebrate!** It wasn't easy getting to this point, so make sure to enjoy it. Even if you start hearing criticisms and shortcomings from your new audience, that's a huge accomplishment – take all the feedback and start addressing it.

## Reflect and Iterate

Once your MVP is out the door, now what? **Look at your past decisions, and think about how to carry them forward.**

How will you maintain your products? Who is responsible for designing for each audience? How will you stay in sync?

Because we decided to fork, we now have two overlapping products. This is a win for our users, but adds some overhead for us. Okta's design team uses [sprint planning](https://www.invisionapp.com/blog/ux-sprint-planning-okta/) to cross-pollinate ideas and share knowledge about upcoming projects.

How is your product working for your new audience? What are the high-prio issues to tackle next? As your knowledge and constraints change, how should the product evolve?

These are big questions, and you'll never be finished with them.

At Okta, we've got a [big vision and roadmap for developer experience](https://youtu.be/2vao69fQufo). As we make improvements for each type of user, we'll loop through this process and see which changes can be shared to benefit others. Now that we're serving multiple audiences, we're focused on making all of them successful at every step forward. Keep an eye out for more updates by following our team on Twitter [@oktadev](https://twitter.com/OktaDev)!
