---
layout: blog_post
title: "User Migration: The Definitive Guide"
author: rdegges
description: "This is the ultimate guide to migrating your userbase from one user management system to another."
tags: [user migration, programming, user management]
tweets:
  - "Need to migrate your users from one user management system to another? We just published the definitive guide on the subject:"
  - "Migrating your users from one system to another can be a huge pain.  @rdegges wrote a guide breaking it down, step-by-step."
  - "User migration is a huge pain. We published a new guide on the subject to make it a little less painful."
image: blog/user-migration/user-migration.png
---

{% img blog/user-migration/user-migration.png alt:"user migration" width:"700" %}{: .center-image }

Migrating sensitive user data from one system to another can be difficult (to say the least). While making incremental changes in your codebase to get rid of technical debt can be easy, replacing (or upgrading) something as critical and deeply-intertwined as your user management system can be a nightmare.

In this guide, you'll learn the best strategies and methods for migrating your user accounts from one backend to another in the simplest (and most secure) possible ways.

Everything we'll be covering below comes from years of experience storing hundreds of millions of user accounts and managing one of the largest user identity services worldwide. We've carefully outlined the processes we've seen (and made work) in real-life scenarios while including useful information for practical application. Because user account migration can dramatically impact your end-users, we'll also be discussing how different migration scenarios impact user experience in different ways.

## Why Migrate Your Users?

{% img blog/user-migration/confused-stick-figure.png alt:"confused stick figure" width:"100" %}{: .center-image }

The first question you should ask yourself before heading down the user migration path is: *Do I really need to migrate my users in the first place?*

While changing a database backend from MySQL to Postgres can be a difficult and tricky task, migrating critical and sensitive application data (like your user accounts) involves a whole other level of planning and analysis.

If you can avoid migrating your users to a new platform, you should!

With that being said, here are the main reasons you might want to migrate your users into a new user management system.

### Your User Management System is Legacy

{% img blog/user-migration/legacy-user-management-system.png alt:"legacy user management system" width:"400" %}{: .center-image }

If you're working on an application that's been around for a while, odds are, many components of your application need updating.

While it may be possible to spend a day or two updating components of a small codebase, for larger applications, this can be incredibly difficult. Developers at large companies who are working on older codebases often run into more severe problems that don't have easy fixes, things like:

- Proprietary vendor software that is no longer supported
- Systems that were built a long time ago which no current employees know how to maintain/access
- Systems that are built in older programming languages which would require rewrites to modify

If your current user management system is suffering from one of the issues above, a migration may be the right answer.

### You Have Security Concerns

{% img blog/user-migration/computer-cracker.jpg alt:"computer cracker" width:"400" %}{: .center-image }

More often than not, developers tend to build user management themselves. They'll do things like hash passwords, handle password reset workflows, etc.

These types of operations are typically brittle and can break over time as best practices change and evolve. Not having your user management system built by security-focused developers can be a risk.

If you have concerns about the security of your user data or aren't confident maintaining your current systems properly, a migration to another user management system might be a good option.

### You Need to Support Features Your Current System Does Not Have

{% img blog/user-migration/frustrated-programmer.jpg alt:"frustrated programmer" width:"400" %}{: .center-image }

This is mainly a problem I've seen in larger companies. Developers might be building applications that talk to an old vendor that handles user management, usually something on-premise, and need to add features or change functionality but don't know how (or maybe they don't have access/expertise).

In situations like this, you really don't have much of a choice, you can either choose to find some domain experts to maintain your old system or migrate to a more modern option.

### You Want to Reduce Ongoing Maintenance

{% img blog/user-migration/happy-programmer.jpg alt:"frustrated programmer" width:"400" %}{: .center-image }

This is probably the most common reason I see developers use for justifying a migration to a new user management system. If you are spending a good portion of your time handling user data, user security, and various protocols for authentication and authorization, getting rid of that ongoing maintenance burden can be a real time and money saver.

My only advice on this one is to be careful. Are you sure that the new system you're considering migrating to will save you time in the long run? Make sure you aren't trading one problem for another: spend time and fully research your options before committing to a migration.

## How Migration Works

The concept of user migration is simple. The goal is to take all of your user data (emails, password hashes, first names, last names, and profile data), and migrate it to another system with as little headache as possible.

I'm using the word "system" here liberally: a user management system for you might be as simple as a "users" database table that contains some string information, or it may be as complex as a massive proprietary, on-prem solution. Whatever system you are migrating to and from, however, these concepts should remain the same.

**NOTE**: In this section, you'll be guided through the migration steps. In a later section, you'll learn what types of migration strategies there are, and how to choose a strategy based on your requirements.

### Step 1: Find All Your User Data

{% img blog/user-migration/find-your-data.png alt:"find your data" width:"700" %}{: .center-image }

The first phase of any user migration is to discover where *all* your existing user data resides. This sounds easy, but in practice, you might be surprised to find your user data in many disparate locations.

The first place you'll typically want to look is in your database(s). Most user account data is stored there. For relational databases, you'll often have a "users" table that contains basic user information (and maybe a "user profile" table that contains additional user profile information).

If you're using a proprietary solution (like an API service for user management), you'll want to refer to the API documentation for your system and figure out how to extract *all* of an individual user's information from the platform pragmatically.

Next, you'll want to scour your database(s) looking for any related user information. In relational databases, it's common to store references to your user accounts in other tables via foreign keys and many-to-many style relationships -- so look for user IDs, usernames, and any other pieces of user data that might be lurking about. If you don't identify some of this information before a migration, it can have disastrous consequences later on.

Finally, you'll want to analyze your codebase(s), looking for any references to user information. Make sure you understand *how* your application is making use of user data today, and where it retrieves it from.

Once you have all this information you should compile a list of:

- What user data you've found
- Where you found it
- What code is referencing it

This discovery process may take a few hours, a few days, or a few weeks, depending on how large your application is -- but whatever you do, don't expedite this process! Stick with it, and you'll avoid trouble later.

**NOTE**: If you're using any sort of caching databases (like Redis/memcache), search databases (like ElasticSearch/solr), or NoSQL databases (like MongoDB/DynamoDB), you'll want to be extra careful as you analyze your data looking for user references. In systems where your data is denormalized, you may find that your user data has been duplicated many times for performance purposes -- **beware**.

### Step 2: Figure Out How to Copy One User's Information into Your New User Management System

{% img blog/user-migration/migrate-one-user.png alt:"migrate one user" width:"400" %}{: .center-image }

Now that you've got your user data identified and mapped out, the next thing you need to do is figure out how to take a single user's information (all of it!) and get it imported into your new user management system.

Take a simple example where the only user data you need to migrate consists of an email address and a password hash (string).

In this case, if you were moving to a new homegrown system on a new database server or servers, you might simply create a new users table in your new database, ensure the table has an email and password column (with the appropriate types), then try creating a new row in this table with your existing user data.

In this example, you'd pick out a single user (for testing), grab their email and password hash, then create some similar looking test data and manually copy it over into your new database (as a test). Look for anything odd:

- Are your new columns defined properly?
- Are they "wide" enough to fit your longest user's email?
- Etc.

This is a good opportunity to figure out the basics and (hopefully) start to get a good feel for how much effort your migration will take.

If you're using a hosted user management service like [Okta](/), Cognito, or Auth0, you'll want to check out their respective documentation, install your preferred client library, and try to copy over a single user account using a simple script.

In this example, you'll also want to be conscious of any edge cases as you run through your single-user test:

- Can you import your specific password hashes?
- What algorithm are you using?
- Etc.

The good news is that once you've figured out how to import a single user into your new system, this is substantial progress! Yey!

**NOTE**: When you're following through with this process of taking a single user's information and copying it over into your new user management system, **don't use real user information**! Use test data, instead. I've personally seen instances where developers are testing user migration and end up copying *real*, sensitive user data into "testing" systems that aren't properly secured. This can become a disaster, so it's far better to use fake data that matches your production schema. Be safe!

### Step 3: Run a Test Migration

{% img blog/user-migration/run-a-test-migration.png alt:"run a test migration" width:"400" %}{: .center-image }

Now that you've figured out how to successfully import a single user into your new user management system, it's time to attempt a test migration.

The goal of a test migration is to copy over fake (test) user data into your new user management system mirroring a real-world migration scenario.

For example: if your production app has 1,000,000 users stored, you'll want to populate 1,000,000 fake user accounts, and try migrating them into your new user management system in bulk.

This usually involves building scripts (whether that be a database COPY command or a more complex program that calls out to various systems/API services) and running them on a timer.

The things you'll want to keep track of as you run your test migration are:

1. **Does the migration actually work?** You should verify that once your migration has finished running, the original data you migrated is intact in your new system.
2. **Do you have any runtime errors?** As your migration runs, do you notice any errors? Maybe a certain piece of data is UTF-16 encoded and that breaks something? Be mindful of any runtime errors and try to resolve them.
3. **How does your migration work in error scenarios?** If your migration script loses the network connection for a minute, what happens? Will the entire migration fail? The more users you need to migrate, the more errors can occur. Make sure your migration script is resilient to common error scenarios.
4. **How long does your migration take to run?** A few years ago I was migrating a customer who had nearly *ten million users* into a new user management system. The total time that migration would have taken to run using my single-threaded migration script was 27 days. The lesson here is to know how long you expect your migration to take, and what the tradeoffs are, as this will impact your migration strategy later on.

### Step 4: Build a Secure Migration Environment

{% img blog/user-migration/secure-user-migration-environment.png alt:"secure user migration environment" width:"700" %}{: .center-image }

Migrating test users is one thing, but migrating real user account data is another.

When moving sensitive data between systems, you need to be very careful and consider:

- Where will the system running the migration be located?
- What protections will the migration system have?
- Who has access to the migration system/data?
- Who has access to the new user management system?
- Will log files be generated? If so, where will they be stored?
- Will any sensitive data be transmitted to any employee or machine in an untrusted environment?

There's no one size fits all rule here, so I won't harp on specifics, but spend some time to answer the questions above and understand what the implications of your migration process will be.

In all circumstances, you want to minimize:

- The number of people who have access to any user data
- The number of ways your user data (and migration system) can be accessed. For example, if you're going to be running a migration tool on an Amazon server, you'd want to make sure that the server is provisioned pragmatically, that the migration tool will run on it, and that the server will be decommissioned immediately afterward. While the server is running, it shouldn't have SSH access enabled, web servers enabled, etc. Keep things as slimmed down as possible to avoid potential security issues.
- The number of people involved in the migration process. If possible, the user migration process should be completely automated so that no human intervention is required. This minimizes the possibility for sensitive user data (or other data) to be seen or leaked by any human parties.

Make sure that before you move forward with your migration, you carefully look into each of the bullet points above, and think critically about avoiding exposure.

### Step 5: Run a Test Migration (Again!)

{% img blog/user-migration/run-a-test-migration-again.png alt:"run a test migration (again)" width:"400" %}{: .center-image }

By now you should have your migration tooling built, as well as a secure migration environment. So what you'll want to do next is run a test migration that takes your staging (or production) user data and migrates it into your new user management system in an asynchronous way.

The idea here should be to fully test out your migration tooling, but this time with real (or a copy of the real) data.

Before running this test migration, be wary of any performance penalties your production/staging environment(s) might incur, and plan accordingly. If you're going to be running a massive `SELECT *` type query on your production database to grab 10,000,000 users all at once, for example, that probably isn't going to end well. =)

Carefully analyze your test migration run, and ensure nothing unexpected occurred.

- Was your migration environment automatically provisioned/deprovisioned? You don't want to leave sensitive data lying around.
- Were all of your users copied over? Are the user counts in your existing system the same as your new system?
- Did you need to manually perform any part of the migration process? If so, how can you remove yourself from the equation to reduce exposure?

### Step 6: Develop Against Your New User Management System 

{% img blog/user-migration/programming.gif alt:"programming (gif)" width:"400" %}{: .center-image }

Once you've gotten your test migrations working, and any issues sorted out, it's time for the real work to begin: creating a new branch of your codebase that uses your *new* user management system.

Unfortunately, I can't give much advice here (since everyone's codebase is completely different), but here are the high-level things I personally do when handling user migration:

- Maintain a new branch in your codebase that works against your *new* user management system -- don't try to have conditionals in your codebase that reference both systems unless absolutely necessary, this will become a maintenance nightmare.
- Follow through with whatever processes you currently use -- don't go rogue. If you typically test your code against a staging environment, make sure you have a suitable staging environment with your *new* user management system on it that you can test against. Don't take shortcuts, as this is where most problems arise.
- Reach out to any engineers internally working with user information and point them to your experimental branch for feedback. It isn't unusual for code that touches user data to be spread out all over the place. Making sure that the engineers who work on parts of the codebase associated with user information know what to expect.

### Step 7: Ship It!

{% img blog/user-migration/ship-it.png alt:"ship it!" width:"200" %}{: .center-image }

Once you've got everything ready to go, all you need to do is ship it!

Pick a time when your app won't be getting much usage, and schedule a few hours (based on how long you know it takes to migrate data + cut a new release), then start the migration.

Once your migration has finished, cut a release of your codebase that contains bindings to work with your new user management system, and bam, you're done.

In the next section, I'll explain the different types of migration strategies (how to actually handle this cutover) as well as what you need to consider in each scenario.

## User Migration Strategies

{% img blog/user-migration/look-what-i-did.gif alt:"look what i did (gif)" width:"600" %}{: .center-image }

Now that we've got the high-level stuff out of the way, let's get into the really interesting part of this guide: the different types of user migration strategies.

Whenever you're moving from one user management system to another, you really only have two options when it comes to migrating your users over:

- You can opt for a "bulk" migration, in which you incur downtime as you migrate your users to a new system.
- You can opt for a "just-in-time (JIT)" migration, in which you don't incur any downtime, but will have a substantially more complex migration.

Regardless of what type of system you're moving to or from, these are the only two fundamental options available to you.

Let's take an in-depth look at each strategy.

### Bulk User Migration

{% img blog/user-migration/bulk-user-migration.png alt:"bulk user migration" width:"400" %}{: .center-image }

A bulk migration is exactly what it sounds like: a migration where you essentially take your app offline, migrate your user data from one system to another, release the new version of your codebase that talks to users in your new system, then bring your app back online.

This type of migration is the simplest option because your app will be offline when it is done:

- You eliminate the risk of user data changing mid-migration, which can cause consistency issues
- You gain the ability to test your new user management system thoroughly before bringing your app back online
- You can usually bulk load users in a few synchronous transactions, which minimizes complexity
- You can get rid of your old user management system (and it will no longer be in use) once the migration has completed

Bulk migrations are my preferred method due to their simplicity. If you can afford to have some downtime in your application, I'd strongly recommend going this route.

The most important factors to consider when determining if you can do a bulk migration are:

- Does your new user management system support the type of password hash that you're using in your current user management system? For example, if your user’s password are currently stored in the bcrypt format, will your new user management system be able to interpret these hashes properly? 
- How much time would it take you to migrate all of your users from your old user management system into your new one? What do your tests tell you?
- How long will it take you to cut a release of a new version of your codebase, so that no code referencing your old user management system is running in production?
- Can your application afford that much downtime?

If that answer to either the first or final question is "no", sorry. :( Keep reading! If the answer to those questions is "yes", then you can safely stop reading now and go get to work! =)

**NOTE**: The reason it's important that your new user management system support your current password hashing scheme is that if it doesn't, your users won't be able to log in with their existing passwords once you migrate. I've seen some developers go this route anyway, but that ends up causing massive user experience issues, as you've then essentially got to *force* all of your users to reset their passwords, which can be a nightmare.

### Just-In-Time (JIT) User Migration

{% img blog/user-migration/jit-user-migration.png alt:"jit user migration" width:"700" %}{: .center-image }

So your app has to be up all the time, eh? OK then! It sounds like JIT user migration is for you!

JIT migrations modify your codebase such that when a user attempts to log into your app, you look up the user in your *new* user management system.

If the user exists in your new user management system, then try to authenticate the user against your new user management system. If they successfully authenticate, let them in. Otherwise, reject their login because they have invalid credentials.

If the user *doesn't* exist in your new user management system, check to see if the user is in your *old* user management system. If so, attempt to authenticate them against your old user management system.

If the user is able to successfully authenticate against your *old* user management system, then before authenticating them, complete the following steps:

1. Grab *all* of the user's information out of the old user management system (username, first name, last name, any other user data you’re storing)
2. Grab the user's plain text password from the authentication request body. Because the user is trying to authenticate, you should be able to grab their plain text password from memory. **NOTE**: I've included some information later on about the risks involved with using the plain text password.
3. Take the user's account data (along with their plain text password) and create a new user in your *new* user management system with this user's information. In this step, you're basically just copying the user over from the old system to the new.
4. Now that the user has been copied over, go ahead and log them in.

The nice thing about JIT migrations is that once they've been deployed, as your users log into your app, they'll gradually be migrated over to your new user management system behind the scenes without any downtime or user experience issues. The downside, of course, is that you'll need to maintain your existing user management system indefinitely, until every single one of your users log into your application (thereby moving them over to the new system).

The other problem I often see with JIT migrations is that they can open you up to potential security risks. For instance, grabbing the user's plain text password and using it to create new records can be risky. Anytime you're touching a plain text password you run a lot of risk: Who can access it? Is it being properly handled? Is it being logged somewhere? Etc.

The trick to completing a successful JIT migration is patience. My advice for you, if you're embarking on a JIT migration, is to:

- Carefully plan out your JIT migration. Know exactly what you're doing in every scenario.
- Test your JIT migration code thoroughly before running it in production. Whatever happens, you don't want to risk leaking sensitive user information.
- Be patient. Most applications don't have user bases that are active every day. This means it may take a long time before a majority of your users have been migrated over into your new user management system.
- Set a clear expectation of how you intend to handle users who do not log into your application within some specified timeframe. Will you force them to reset their password manually? Will you delete their accounts after some date? Will you maintain your legacy user management system indefinitely?

## User Migration Advice

{% img blog/user-migration/stick-figure-advice.jpg alt:"stick figure advice" width:"200" %}{: .center-image }

Having migrated many production applications from one user management system to another, the key piece of advice I have for you is this: *keep things as simple as possible*.

If you can avoid needing a complex JIT migration, go for the simpler bulk migration strategy outlined above.

When building your user migration code, keep things simple. Start by writing a single-threaded program that handles migrating one user at a time. If that isn't fast enough, considering making it async and test migrating users in faster ways. But don't prematurely optimize. You might be surprised to discover that even though you have a lot of users, your migration operation is inexpensive and can be run quickly in a serial way.

Finally: when picking a new user management system to migrate to, make sure it meets all of your needs. Figure out what's going to reduce your maintenance and risk burdens in the future, etc. Try to use something that's going to last you a long time and seamlessly keep itself updated as security best practices change, standards evolve, etc.

And, if you're looking for a user management service that fits that criteria, you might want to check [us out](/). ;)

## User Migration Example

If you'd like to see an example of a user migration tool, you can check out this [.NET migration program](https://github.com/oktadeveloper/okta-user-migration-dotnet) we built.

This is a simple example that shows how to perform a JIT migration that moves user accounts from an LDAP server into Okta's API service. This example is specific to .NET developers, but highlights some of the strategies we've talked about above.

Have questions or comments? Drop me a note below and I'll do my best to get back to ya! Finally, be sure to follow [@oktadev](https://twitter.com/oktadev) on Twitter to stay up-to-date with the latest things we're publishing.
