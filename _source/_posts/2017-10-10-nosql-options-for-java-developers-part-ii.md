---
layout: blog_post
title: 'NoSQL Options for Java Developers, Part II'
author: mraible
description: "A follow up article to NoSQL Options for Java Developers. This article asks a number of experts if they agree that the top five NoSQL options are MongoDB, Redis, Cassandra, Neo4j, and PostgreSQL."
tags: [nosql, java, redis, mongodb, cassandra, neo4j, postgresql, spring boot, spring data]
redirect_from:
  - "/blog/2017/09/08/nosql-options-for-java-developers-part-ii"
  - "/blog/2017/10/11/nosql-options-for-java-developers-part-ii"
---

Last month, I wrote about [NoSQL Options for Java Developers](/blog/2017/09/08/nosql-options-for-java-developers). I analyzed the data available from a variety of sources (Indeed jobs, GitHub stars, Stack Overflow tags) to pick the top five options: MongoDB, Redis, Cassandra, Neo4j, and PostgreSQL. After writing this article, I shared it with a few experts I know in the Java and NoSQL communities and asked them the following questions:

1. Do you agree with my choices of the top 5 NoSQL options (MongoDB, Redis, Cassandra, Neo4j, and PostgreSQL with its JSON support)?
2. Do you have any good or bad stories about using any of these databases in production?
3. Have you found any of these databases particularly difficult to get started with or maintain over time?
4. What is your favorite NoSQL database and why?
5. Anything else you'd like to share?

Today I'm happy to share their answers with you. But first, some introductions.

[**Justin McCarthy**](https://www.linkedin.com/in/justinmccarthy/)
Justin is the CTO and co-founder of [strongDM](https://www.strongdm.com/), a company that provides secure access to databases (permissions, monitoring, and compliance reporting). He's also an Okta customer.

[**Rafal Glowinski**](https://twitter.com/GlowinskiRafal)
Rafal is a Team Leader for the largest Polish e-commerce: allegro.pl. His teams are using lots of Cassandra and MongoDB in their daily operations, and there are many many stories to be told about their struggle with them both when it comes to performance, ease of use (or lack of it), HA+ replication, developer errors, etc.

[**Vlad Mihalcea**](https://www.linkedin.com/in/vladmihalcea/)
Vlad is the CEO of Hypersistence and also a Developer Advocate for the Hibernate project. He is the author of [High-Performance Java Persistence](https://leanpub.com/high-performance-java-persistence) and an expert on most things related to databases.

[**Laurent Doguin**](https://twitter.com/ldoguin)
Laurent is the VP of Developer Relations at Clever Cloud. Before Clever Cloud, he was a Developer Advocate for Couchbase and has a vast amount of NoSQL and cloud experience.

Now that you've met everyone let's take a look at my questions and their answers about NoSQL options for Java developers.

## 1. Do you agree with my choices of the top 5 NoSQL options?

**Justin:** MongoDB, Redis, Cassandra, Neo4j are the leading representatives of some important and orthogonal categories of non-relational databases: document, in-memory KV, petabyte KV, and graph.

Redis and Cassandra look more like KV stores than Mongo, Neo4j or PG. The principal discriminator between Redis and Cassandra is the intended and expected scale. It's natural to run dozens or hundreds of Cassandra nodes in one coherent store, something that very few would attempt on Redis -- even with the Cluster enhancements Redis released back in 2015.

Regarding the Top 5, I would argue for introducing DynamoDB as a burgeoning success story (possibly replacing PG in the Top 5). Amazon did not invent the notion of object storage, but they implemented and priced S3 well enough that it's now shorthand for all object storage (S3 API compatibility is pervasive among storage products). Similarly, DynamoDB is capturing share across verticals (presumably from both Redis and Mongo). DynamoDB could be on a path to become the de facto choice for sub-Cassandra, non-RDBMS use cases deployed to AWS.

Finally, on Postgres, and Postgres+hstore+JSON: Postgres is great. It can be incredibly fast and remains the most featureful open source database. It does documents. It does key-value. There are patterns for both horizontal and vertical scalability. There's a huge community of operational skills. Developers breaking ground on a new project should probably have to make a case for not using Postgres -- and that case should probably include QPS values > 200k, storage volume > 10TB, or a fundamental graph structure in the data.

**Rafal:** Absolutely. For me, top three are MongoDB, Cassandra, and Redis. They complement each other nicely and are easy to start with.

**Vlad:** I agree. Although PostgreSQL is weird to be included there because all major RDBMS support JSON these days.

**Laurent:** I completely agree. What I found very interesting here is that they can mostly be complementary. You could use Mongo or PG as a primary datastore with Redis for cache, neo4j for graph specific queries and Cassandra if you need to do heavy scale CQRS or analytics.

## 2. Do you have any good or bad stories about using any of these databases in production?

**Justin:**

Good stories:

* Redis has never let me down operationally. No crashes, no disappointments. Good for putting up huge benchmark numbers and making the most of minimal hardware allocations.

Bad stories:

* Cassandra: we misunderstood important Cassandra-specific schema design practices, causing production-impacting compaction and memory pressure problems. Unlike a relational database which could provide a performant in-database data manipulation, we could not simply migrate from schema A to A' as an online operation. Instead, the system needed to be coded to perform lazy migrations, reading from the old and writing to the new. Multiply this across several schema objects and several major releases. Weeks of inconsistent state, while firefighting crashing nodes!
* MongoDB: the classic Mongo problem -- insufficient data validation and incomplete migrations leading to corrupt documents. Data integrity checks forced into the main codebase that would, in most relational systems, be expressed declaratively at schema design time and enforced by the database itself.
* Redis: excessive creativity! Redis is a data structure store, meaning almost any arrangement of memory you could imagine in your most clever, pointerful C code is possible to recreate through the Redis protocol. Excellent for performance; awful for legibility, diagnostics, and recoverability. Strong recommendation to discuss and review each new type of Redis structure (or even command) that is introduced into your codebase; be sure to ask questions about how you will verify the integrity of these data structures and perform migrations on them over time.

**Rafal:** Oh yes, quite a few. We use MongoDB in lots of our microservices and it does a good job (MongoDB 3.x obviously) and is easy to use especially when combined with a DDD-like approach. Cassandra can be blazingly fast, but only when it is used properly. At first, we treated it a bit like a silver-bullet which lead us to learn few lessons the hard way, but now everything is (mostly) under control.

**Vlad:** I used MongoDB on a project where, if PostgreSQL supported JSON back then, we would have never chosen Mongo. We were using for storing non-structured data, coming from 3rd party real-estate agencies, so we're using it as a JSON store.

**Laurent:** From the Clever Cloud trenches: Anything you can do with Mongo, you can do it better with PostgreSQL. We have had performance issues, we have had some surprises with the loose typing of Javascript that never happened with PLSQL. We also lost some data with MongoDB after a split brain.

We also had issues with Cassandra tombstones, Neo4J hardly scale up.

The only problem we have with Postgres is regarding an upgrade that requires you to have both versions on the machine. Postgres10 fixes this.

## 3. Have you found any of these databases particularly difficult to get started with or maintain over time?

**Justin:** Cassandra has the steepest learning curve and is the most sensitive to the interplay between schema design and operational tuning parameters. The data volumes and query rates are typically so high that metrics collection and aggregation is essential for understanding what's happening; you can't just run `top` and diagnose a problem.

Again due to the sizes involved, Cassandra seems to be the store most vulnerable to oscillation between an over-provisioned condition (where the CPUs are asleep, memory and IO are not taxed) and a hair-on-fire emergency.

**Rafal:** MongoDB is a breeze to start with. It is even simpler if you can use Spring Data MongoDB project for data access. I recommend reading about its architecture (master-slave + replicas, how Write Concerns work and when to use them) to all developers using MongoDB.

Cassandra is also quite easy to setup and to start with, but once your data volume and traffic grow high enough, things can get hairy. When that happens, be ready for a deep dive into Cassandra's architecture and internal details, because you will need to understand them really well to solve some problems you will encounter. A good example would be the way that tombstones are handled in Cassandra: all values are read into memory and then filtered out, which can cause a considerable amount of stress on Garbage Collection.

**Vlad:** Starting with Mongo is pretty straightforward. I think that's why it's so popular even if it didn't use to excel on consistency or reliability. However, 3.4 has come a long way and even passes Jepsen tests now.

**Laurent:** I found that getting started for any of these databases is a breeze. Never had any issues. It might be why they are so popular. Neo4J might be a little different in that regard since it's the only Graph DB out of the five selected.

About maintaining them over time, I guess it really depends on what you do with them. We aim at having as less downtime as possible. So we love when you can do rolling upgrade. So one big point for Mongo and Cassandra. We never really tried with the others. So they are a little bit harder to maintain. Can't wait for Postgres10! :)

## 4. What is your favorite NoSQL database and why?

**Justin:** Redis, but mainly for romantic/emotional reasons: it inspires me to cleverness, which is ... great for prototypes. It's also great in production -- as long as you reduce the cleverness to the minimum necessary for your use case.

**Rafal:** MongoDB 3.x. Don't want to repeat myself too much, so I will keep it short: it just works, it is flexible (no schema, ad-hoc queries), great support for DDD-like approach, amazing data access framework: Spring Data MongoDB (kudos to Oliver Gierke and Spring Data Team!).

**Vlad:** CockroachDB because it speaks the PostgreSQL protocol, therefore offering ACID guarantees while distributing data globally. Google Spanner is only very interesting, being the DB used by many Google products, like Google Analytics.

**Laurent:** Out of these five, Postgres would be my favorite. It's the most versatile to me. The one I have the more experience with and where you will find the best resources online. Redis would come close second because of their recent module system. I am expecting it to grow a lot more. They have the user base already, and they are adding more and more features.

## 5. Anything else you'd like to share?

**Justin:** These are all awesome options. In many technical disciplines, generational successors tend to completely replace their predecessors (the front-end / JS ecosystem for example); by contrast, our NoSQL choices have mostly proven to be additive to traditional RDBMS and glut object storage, leading to fewer uncomfortable compromises and happier developers & operators.

**Rafal:**

Some tips to any future MongoDB users:

* Use Spring Data Mongo if you can.
* MongoDB will let you think more in a DDD way than any other DB (well maybe PostgreSQL with JSON support would too).
* Don't be afraid to create more complex documents (artifacts) - atomicity is guaranteed on document level only.
* Even with large collections, response times are predictable.
* Learn (and I do mean LEARN) about Write Concerns in MongoDB. Especially that writes always go to primary and reading from secondary can give you stale data).
* It allows you to perform queries on any field. Yes, they can be slow, but you can still perform them. Even if just once a week or two to verify something.
* Its schema-less approach is awesome when adding new fields, which can be a huge pain in some of a well known RDBMS.

Things don't look so bright for Cassandra:

* It is not a silver bullet. It is a fantastic database, but be sure to learn about proper use cases. Don't use it if yours is not one of those.
* It is a JVM-based database, which means that at some point you will have to worry about Garbage Collection throughput. Then you will have to decide if it is cheaper to continually tune the GC or go for Azul's Zing JVM.
* Build many separate clusters for different usage patterns. There is no "one size fits all" when it comes to configuring Cassandra cluster.
* Avoid running any Spark Jobs on a shared cluster. Spark Job (even more so an ill-configured one) can quickly max out Cassandra nodes and lead to a failure of the entire cluster.
* Dive into the gory details of how Cassandra works internally. Sooner or later you will need that knowledge.
* Be sure your developers know when and how to use it. Proper clustering/partitioning keys, TTL handling will help you not to kill any nodes and achieve the best performance.

Redis and Couchbase:

Other teams use Redis and Couchbase a lot, but I cannot really give you many details. I know we have had a lot of problems with Couchbase's babysitter demon dying quite often and that we have found a major bug in Couchbase's async (Rx) driver. Not much to tell other than that.

**Vlad:** Although not in the NoSQL category, being a NewSQL database, VoltDB is very promising because it's very well suited for operating entirely in memory. When NVM storage will become mainstream, it's going to be very well prepared to get the most out of these storage devices, unlike other disk-based oriented SQL or NoSQL databases.

**Laurent:** There are roughly two reasons to go NoSQL. Scale or non relational storage. Anyone looking into NoSQL for scale should read [Aphyr's blog post series](https://aphyr.com/tags/jepsen) before making any choice.

Thanks to Justin, Rafal, Vlad, and Laurent for sharing all their NoSQL knowledge! I hope you learned something from these questions and answers.



