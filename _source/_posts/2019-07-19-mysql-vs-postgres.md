---
layout: blog_post
title: "MySQL vs PostgreSQL -- Choose the Right Database for Your Project"
author: krasimir
description: "Which is better? MySQL or Postgres? In this post we'll compare the strengths and weaknesses of each."
tags: [database, mysql, postgres, postgresql]
tweets:
- "MySQL vs Postgres, which one is the best?"
- "Wondering whether you should use #MySQL or #Postgres for your next project? Read this first!"
- "Let's finally settle the debate between MySQL and Postgres for your next project"
image: blog/mysql-vs-postgres/mysql-vs-postgres.png
---

The choice of a database management system is usually an afterthought when starting a new project, especially on the Web. Most frameworks come with some object-relational mapping tool (ORM) which more or less hides the differences between the different platforms and makes them all equally slow. Using the default option (MySQL in most cases) is rarely wrong, but it's worth considering. Don't fall into the trap of familiarity and comfort – a good developer must always make informed decisions among the different options, their benefits and drawbacks.

## Database Performance

Historically, MySQL has had a reputation as an extremely fast database for read-heavy workloads, sometimes at the cost of concurrency when mixed with write operations. 

PostgreSQL, also known as Postgres, advertises itself as "the most advanced open-source relational database in the world". It was built to be feature-rich, extendable and standards-compliant. In the past, Postgres performance was more balanced - reads were generally slower than MySQL, but it was capable of writing large amounts of data more efficiently, and it handled concurrency better.

The performance differences between MySQL and Postgres have been largely erased in recent versions. MySQL is still very fast at reading data, but only if using the old MyISAM engine. If using InnoDB (which allows transactions, key constraints, and other important features), differences are negligible (if they even exist). These features are absolutely critical to enterprise or consumer-scale applications, so using the old engine is not an option. On the other hand, MySQL has also been optimized to reduce the gap when it comes to heavy data writes.

When choosing between MySQL and PostgreSQL, performance should not be a factor for most run-of-the-mill applications – it will be good enough in either case, even if you consider expected future growth. Both platforms are perfectly capable of replication, and many cloud providers offer managed scalable versions of either database. Therefore, it's worth it to consider the other advantages of Postgres over MySQL before you start your next project with the default database setting.

## Postgres Advantages over MySQL

Postgres is an object-relational database, while MySQL is a purely relational database. This means that Postgres includes features like table inheritance and function overloading, which can be important to certain applications. Postgres also adheres more closely to SQL standards. 	

Postgres handles concurrency better than MySQL for multiple reasons:

Postgres implements Multiversion Concurrency Control (MVCC) without read locks 
Postgres supports parallel query plans that can use multiple CPUs/cores
Postgres can create indexes in a non-blocking way (through the `CREATE INDEX CONCURRENTLY` syntax), and it can create partial indexes (for example, if you have a model with soft deletes, you can create an index that ignores records marked as deleted)
Postgres is known for protecting data integrity at the transaction level. This makes it less vulnerable to data corruption.

## Default Installation and Extensibility of Postgres and MySQL

The default installation of Postgres generally works better than the default of MySQL (but you can tweak MySQL to compensate). MySQL has some outright weird default settings (for example, for character encoding and collation).

Postgres is highly extensible. It supports a number of advanced data types not available in MySQL (geometric/GIS, network address types, JSONB which can be indexed, native UUID, timezone-aware timestamps). If this is not enough, you can also add your own datatypes, operators, and index types.

Postgres is truly open-source and community-driven, while MySQL has had some licensing issues. It was started as a company product (with a free and a paid version) and Oracle's acquisition of MySQL AB in 2010 has led to some concerns among developers about its future open source status. However, there are several open source forks of the original MySQL (MariaDB, Percona, etc.), so this is not considered a huge risk at the moment.

## When to Use MySQL

Despite all of these advantages, there are still some small drawbacks to using Postgres that you should consider.

Postgres is still less popular than MySQL (despite catching up in recent years), so there's a smaller number of 3rd party tools, or developers/database administrators available.

Postgres forks a new process for each new client connection which allocates a non-trivial amount of memory (about 10 MB). 

Postgres is built with extensibility, standards compliance, scalability, and data integrity in mind - sometimes at the expense of speed. Therefore, for simple, read-heavy workflows, Postgres might be a worse choice than MySQL.

These are only some of the factors a developer might want to consider when choosing a database. Additionally, your platform provider might have a preference, for instance Heroku prefers Postgres and offers operational benefits to running it. Your framework may also prefer one over the other by offering better drivers. And as ever, your coworkers may have opinions!

If you have a view on database selection please add a comment below - we would love to hear your thoughts. If you liked this, you should [follow us on Twitter](https://twitter.com/oktadev). Check out our [YouTube channel](https://www.youtube.com/c/oktadev) where we publish screencasts and other videos.
