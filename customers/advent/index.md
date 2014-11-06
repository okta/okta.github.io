---
layout:             customer_story
customer_url:       "http://www.advent.com/"
customer_link_name: "www.advent.com"

index_image:    advent-index.png
bg_image:       advent-header.jpg
xxxdiagram_image:  advent-diagram.png

title:          Advent Secures Online Community For Thousands of Clients with Okta
title_tagline: >
  Okta provides a robust cloud-based identity platform for Advent Direct™, Advent's cloud platform for investment management professionals.  With thousands of financial institutions accessing the online Advent Direct™ Community, Advent uses Okta's identity layer to enhance security while providing seamless access to help Advent clients, partners, and employees connect with the content and people most relevant to their needs.


index_blurb: >
  TBD

sidebar_testimonial: >
  The Okta platform provides Advent with a complete identity management platform that enabled us to quickly provide secure access for our clients to our cloud applications.
sidebar_testimonial_attribution: Ken Schaff
sidebar_testimonial_meta: Director, Global Solutions Development at Advent Software

sidebar_copy: >
  * Advent needed an identity framework to provide more than 4,500 customers with seamless access to an on-premises product, a new SaaS product, and a 3rd party community portal.

  * The Okta Identity Platform provides the complete identity layer for Advent's products and provides users with a fully Advent-branded experience.

  * Building on the Okta Platform has allowed the Advent team implement comprehensive and future-proof identity and access management while freeing up engineering resources to focus on building new features that customers demand.
---




## About Advent

Advent Software, Inc. (www.advent.com), a global firm, has provided trusted solutions to the world's financial professionals since 1983.  Advent's proven solutions can increase operational efficiency, reduce risk, and eliminate the boundaries between systems, information and people so you can focus on what you do best.  With more than 4,500 client firms in over 60 countries, Advent has established itself as a leading provider of mission-critical solutions to meet the demands of investment management operations around the world.  Advent is the only financial services software company to be awarded the Service Capability and Performance certification for being a world-class support and services organization. 


## Situation

Advent historically provided valuable insights to its clients through its web portal, Advent Connection.  With clients from thousands of firms, Advent saw social collaboration as a key driver that would bring its users closer together, sharing ideas and suggestions with each other, while recognizing the contributions of key participants.  The result was the launch of the Advent Direct™ Community, which combined functionality of the on premises Advent Connection with a new cloud-based collaboration application into a single seamless social platform for Advent's clients, partners, and employees.

The nature of Advent Direct™ Community being a composite application created some key challenges in the area of identity management for Ken Schaff, Director of Global Solutions Development at Advent Software, and his team.  The first part of an identity lifecycle is onboarding.  With several different applications that are stitched together to comprise the Community, Advent needed to efficiently and securely provision user accounts.  Each end user is bound to a specific client, and clients could have different levels of entitlement, which could translate to different levels of access in the composite applications.  As Schaff explains, "We wanted to be able to automatically onboard Advent's clients with the correct entitlements, and with an initial set of users, and then allow our clients to securely self-administer their own users."  With approximately 4,500 existing clients, managing large volumes of firms and users was going to be a challenge.

User experience has always been a key to Advent's success.  As with the onboarding problem, there are different requirements at the end user and firm level.  The first thing a user experiences is the login flow.  From an end user standpoint, she should be able to login once and have access to everything with a single username, password, and session.  This is easier said than done – especially with the composite nature of Advent Direct™ Community.  "Advent needed to be able to manage user accounts and access levels across multiple underlying systems:  Saas/Cloud based systems, on premise vendor provided applications, and homegrown .NET Web applications," Schaff says.  Once authenticated, there is the added complexity of maintaining sessions across these applications to ensure a smooth experience while the user is navigating across the various components within the community.

For Advent, an important requirement was a fully branded user experience behind Advent's user interface.  And this goes beyond login and access to the community.  Password management lifecycle poses another huge challenge.  What Advent looks for is a password infrastructure that provides support for the entire workflow – from the initial password registration to forget-password and password reset.  "Given that Advent's clients are in the financial services industry," Schaff continues, "they expect a secure experience.  We needed to be able to provide login, password, and reset policies that are compliant, and do all of that with a fully branded user interface."  

And because of the industry, many of Advent's clients want to be able to enforce their own policies - leading to the need to support firm-specific features – such as firm-specific password policies and authentication/federation requirements.  One such requirement is Multi-factor Authentication - which has been demanded by many firms.

To address these challenges, Schaff deliberated between two primary options.  As a software company, Advent could build the identity layer themselves.  Alternately, Advent could partner with a leading identity provider and build on top of their platform.  There were a number of factors that Advent needed to consider before making this decision, including scalability, security, and future-proofing a solution that could grow with Advent's plans to move more of their solutions into the cloud.


## Solution

When evaluating Okta as the possible identity platform, Schaff and his team focused on a few key areas.
First and foremost, Advent was looking for a cloud-based solution.  With Advent Direct™ Community itself leveraging cloud-based products, Advent understands the advantage of a robust and scalable cloud platform.  Okta's Identity Platform is 100% on-demand providing a cloud-based directory along with many of the identity features that Advent is looking for to support authentication, single sign-on, and provisioning.
Next is the need for a flexible platform.  There are other identity solutions out there, but Advent is looking to build Advent Direct™ Community on top of, not just an identity solution, but an identity platform.  From day one, the focus was on leveraging all the needed features through Okta's REST APIs.  The entire user onboarding flow, login and single sign-on, and password lifecycle management are all performed through Advent's User Interface, while leveraging the Okta platform REST APIs.  The Okta platform is embedded completely within Advent's infrastructure so the user experience is entirely consistent with the Advent interfaces.  The experience extends beyond the firms' end users to the administrators.  Advent has built an administration console for managing users and firms – effective managing the Okta environment inside the Advent product. As Schaff notes, "To gain operational efficiencies, we needed to give our client administrator's full self-service control over maintaining their own users".
The flexibility of the Okta platform allows Advent to tackle the sophisticated security requirements via Okta.  Okta password management API gives Advent the ability to fully control user password lifecycle within its interface.  Moreover, Okta offers an architecture that allows Advent to provide firm-specific password policies for individual password policy with various degrees of password strength and password history settings.
Okta's password lifecycle support includes the use of a secondary challenge question during password reset and forgotten-password flow for added security.  The login infrastructure provides Advent with the ability to validate credentials.  Okta also appropriately handles deep links from the underlying applications to ensure end users are brought to the right content upon login.  "With Okta, our users are able to seamlessly sign-in once and access any part of the Advent Direct™ Community," Schaff continues, "regardless of whether they are accessing the site through a bookmark, a link in an email, from our products, or from the login page directly."
It was also important to Schaff to find a future-proof solution.  As Advent Direct™ Community continues to evolve, it is important that the Okta platform can keep up with any new identity requirements. "It was important for us to find a partner that could grow with us," Schaff says. "For example, we are in the process of implementing Multi-Factor Authentication capabilities for our clients and the Okta development team has been a great partner in providing us with new Platform capabilities and APIs that will allow us to be successful."


## Benefits

Okta's cloud-based identity platform has provided Advent with immediate and impactful results.

### Modern Identity Platform

With its basis in the cloud, Okta's platform allows Advent to centralize access management for their customer facing web applications across the entire lifecycle.  By leveraging the Okta Platform's advanced APIs, Advent has built an integrated and automated solution for onboarding new firms and users, managing firm and user entitlements, providing single-sign-on and password and policy management to connect to both cloud and on premise web applications, vendor supplied systems and homegrown applications, within the Advent Direct™ Community and beyond.    "With the Okta APIs," Schaff continues, "we have control over all of the Okta capabilities that we needed to automate the entire identity lifecycle."

### Development Partnership & Time to Market

With assistance from Okta Professional Services and close collaboration with the Okta Product team, Advent was able to launch their first iteration of identity management, powering the Advent Direct™ Community, in approximately four months.  During this initial release, Okta released several new Platform features that were necessary capabilities for Advent's implementation.  "Okta was able to deliver on their roadmap, which allows us to plan our development cycles on top of their API and meet our delivery schedule." Schaff says. Advent's development lifecycle makes heavy use of Okta's Preview environments, which allows the Advent development team early access to new platform features.  Advent is continuing to invest in building on top of the Okta platform, providing new features to their clients and also expanding the reach into additional applications.

### Full Control over User Experience and Branding

When Advent launched the updated Advent Direct™ Community and underlying Identity management platform (powered by Okta), Advent was also updating their client-facing branding.  It was important to be able to have full control over the end-user experience to be able to expose a consistent brand to clients. Okta's APIs allows Schaff and his team at Advent to create their own user interface outside of the Okta platform that encompasses new user onboarding, the entire login flow, password resets, and self-service user administration. "We were able to successfully obfuscate the entire Okta UI from our clients and make it an Advent experience."
