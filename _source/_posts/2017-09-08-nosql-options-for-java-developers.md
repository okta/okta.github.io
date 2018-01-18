---
layout: blog_post
title: 'NoSQL Options for Java Developers'
author: mraible
tags: [nosql, java, redis, mongodb, cassandra, neo4j, postgresql, spring boot, spring data]
redirect_from:
  - "/blog/2017/10/10/nosql-options-for-java-developers-part-i"
---

The Java community is one I know and love, so even though a NoSQL database is rarely tied to a language I'm writing this article for you, Java developers around the world. In this article, I'll show you several options for NoSQL databases. After exploring all the options, I'll narrow the choices down to the top five based on Indeed Jobs, GitHub stars, and Stack Overflow tags. Then I'll let you know if they're supported by Spring Data and Spring Boot. 

## Why NoSQL?

NoSQL databases have helped many web-scale companies achieve high scalability through [eventual consistency](https://en.wikipedia.org/wiki/Eventual_consistency): because a NoSQL database is often distributed across several machines, with some latency, it guarantees only that all instances will eventually be consistent. Eventually consistent services are often called BASE (basically available, soft state, eventual consistency) services in contrast to traditional ACID properties.

## Selecting NoSQL Candidates

Defining the top five can be difficult. Many folks have attempted to this recently. See the [Research & Notes section](#research--notes) at the end of this article for reference.

In mid-August, I told my followers on Twitter that I was writing this article. I asked for good/bad stories about NoSQL databases and received a number of options people wanted me to include.

<div style="margin: 0 auto; max-width: 500px">
<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">I&#39;m writing an article about NoSQL options for <a href="https://twitter.com/java">@Java</a> developers. I&#39;d 💙 to hear what you prefer, as well as good/bad stories in production.</p>&mdash; Matt Raible (@mraible) <a href="https://twitter.com/mraible/status/897492857170280448">August 15, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

I received many suggestions, listed in alphabetical order below:

1. ArangoDB
1. Cassandra
1. Couchbase
1. DynamoDB
1. FaunaDB
1. Hazelcast
1. MongoDB
1. Neo4j
1. PostgreSQL JSON
1. Redis
1. (JetBrains) Xodus

People also mentioned [Hibernate OGM](http://hibernate.org/ogm/) (JPA for NoSQL) and [NoSQLUnit](https://github.com/lordofthejars/nosql-unit/) as tools to help access and test NoSQL databases.

Note that I didn't receive any requests for CouchDB, HBase, Elasticsearch, or Solr. CouchDB and Couchbase are often confused because of similar names, but [they're quite different](https://www.couchbase.com/couchbase-vs-couchdb). Since CouchDB is a document store, I included it in my rankings. I also added HBase since it is mentioned by ITBusinessEdge, KDnuggets, and DB-Engines (in Research & Notes section). I didn't include Elasticsearch or Solr because I believe those aren't often used as the primary data store.

## Raible's Ranking Technique

I used Indeed Jobs, GitHub Stars, Stack Overflow tags, and Docker pulls to develop my system of ranking the top five NoSQL databases.

### Indeed Jobs

I searched on [Indeed Jobs](https://www.indeed.com/jobs) without a location and found very few surprises, save for Amazon's DynamoDB showing up as a top contender.

{% img blog/nosql-for-java/indeed-jobs.png alt:"Indeed Jobs, September 2017" width:"700" %}{: .center-image }

**NOTE:** It's difficult to search for "PostgreSQL JSON" because most listings specify "PostgreSQL" as a requirement, not its NoSQL support. I searched for "postgres + json". Xodus is the name of a company, so I had to tack on "JetBrains" to ensure accurate results.

### GitHub Stars

I searched and found the top five NoSQL options by GitHub stars are Redis, MongoDB, ArangoDB, Neo4j, and Cassandra. 

{% img blog/nosql-for-java/github-stars.png alt:"GitHub Stars, September 2017" width:"700" %}{: .center-image }

**NOTE:** Cassandra, HBase, PostgreSQL are mirrored repositories. DynamoDB, Couchbase, and FaunaDB don't have their servers on GitHub, so I counted stars for their Java-based drivers. Using number of stars for each option's Java driver is a good idea, but [there's 11 just for Redis](https://redis.io/clients#java).

You can use Tim Qian's [star-history project](https://github.com/timqian/star-history) to see the star growth of these five.

{% img blog/nosql-for-java/github-stars-growth.png alt:"GitHub Star History" width:"700" %}{: .center-image }

### Stack Overflow Tags

I searched on Stack Overflow for tags for each and found that MongoDB and PostgreSQL are the most popular, followed by Neo4j, Cassandra, and Redis.

{% img blog/nosql-for-java/stackoverflow-tags.png alt:"Stack Overflow Tags, September 2017" width:"700" %}{: .center-image }

### Docker Pulls

I searched on [Docker Hub](https://hub.docker.com/) for images and found the stats to be 10M+ for a few, 5M+ for Neo4j, and 1M+ for many others. FaunaDB and JetBrains Xodus don't seem to have images available.

{% img blog/nosql-for-java/docker-pulls.png alt:"Docker Pulls, September 2017" width:"700" %}{: .center-image }

After gathering this information, it didn't seem very relevant to include these stats in my ranking. My reason is two-fold: because the numbers aren't exact and because there weren't "official" images for each option.

## NoSQL Options Matrix

I created a matrix to combine jobs, stars, and tags. I awarded 1-5 points based on the ranking they scored in each category. If an option didn't make the top five, it received a zero. The results -- MongoDB, Redis, Cassandra, Neo4j, and PostgreSQL -- are in the table below.

| NoSQL Option  | Jobs | Stars | Tags | Total |
|---|:---:|:---:|:---:|:---:|
| MongoDB | 5 | 4 | 5 | 14 |
| Redis | 3 | 5 | 1 | 9 |
| Cassandra | 4 | 1 | 2 | 7 |
| Neo4j | 0 | 2 | 3 | 5 |
| PostgreSQL | 0 | 0 | 4 | 4  |
| ArangoDB | 0 | 3 | 0 | 3 |
| HBase | 2 | 0 | 0 | 2 |
| DynamoDB |  1 | 0  | 0  | 1 |
| Couchbase | 1  | 0 | 0 | 1 |
| CouchDB | 0 | 0 | 0 | 0 |
| Hazelcast | 0 | 0 | 0 | 0 |
| JetBrains Xodus | 0 | 0 | 0 | 0 |
| FaunaDB | 0 | 0 | 0 | 0 |


If you look at [DB-Engines Ranking](https://db-engines.com/en/ranking) for their top five options, you'll find PostgreSQL, MongoDB, Cassandra, Redis, and HBase. 

{% img blog/nosql-for-java/db-engines-ranking.png alt:"DB-Engines Ranking, September 2017" width:"800" %}{: .center-image }

Will you look at that - our top five results are pretty close! 

## Overview of NoSQL Options

Since my top five results are pretty close to what DB-Engines has, I'll use mine as the top five. Below is an overview of each one, along with information about their Spring Boot support.

You might ask "Why Spring Boot?" My answer is simple: because Spring Boot adoption is high. According to [Redmonk's recent look at Java frameworks](http://redmonk.com/fryan/2017/06/22/language-framework-popularity-a-look-at-java-june-2017/), Spring Boot adoption grew 76% between September 2016 and June 2017.

{% img blog/nosql-for-java/java-frameworks-growth.png alt:"The Spring Boot Explosion" width:"800" %}{: .center-image }

And things haven't slowed down since June: [Maven downloads in August 2017 were 22.2 million](https://twitter.com/PieterHumphrey/status/905131222094929920).

### MongoDB

MongoDB was founded in 2007 by the folks behind DoubleClick, ShopWiki, and Gilt Groupe. It uses the Apache and GNU-APGL licenses on [GitHub](https://github.com/mongodb/mongo). Its many large customers include Adobe, eBay, and eHarmony.

- **Available on start.spring.io?** Yes, including embedded MongoDB for testing.
- **Supported by Spring Data?** Yes, via [Spring Data MongoDB](https://projects.spring.io/spring-data-mongodb/).
- **Bonus:** Supported by Hibernate OGM, NoSQLUnit, and [JHipster](http://www.jhipster.tech).

### Redis

Redis stands for REmote Dictionary Server and was started by [Salvatore Sanfilippo](http://invece.org/). It was initially released on April 10, 2009. According to [redis.io](https://redis.io/), Redis is a BSD-licensed in-memory data structure store and can be used as a database, cache, and message broker. [Well known companies using Redis](https://redis.io/topics/whos-using-redis) include Twitter, GitHub, Snapchat, and Craigslist.

- **Available on start.spring.io?** Yes.
- **Supported by Spring Data?** Yes, via [Spring Data Redis](https://projects.spring.io/spring-data-redis/).
- **Bonus:** Supported by NoSQLUnit. Hibernate ORM support is in progress.

### Cassandra

[Cassandra](http://cassandra.apache.org/) is "a distributed storage system for managing structured data that is designed to scale to a very large size across many commodity servers, with no single point of failure" (from ["Cassandra – A structured storage system on a P2P Network"](https://www.facebook.com/notes/facebook-engineering/cassandra-a-structured-storage-system-on-a-p2p-network/24413138919) on the Facebook Engineering blog). It was initially developed at Facebook to power its Inbox Search feature. Its creators, Avinash Lakshman (one of the creators of Amazon DynamoDB) and Prashant Malik, released it as an open-source project in July 2008. In March 2009, it became an Apache Incubator project and graduated to a top-level project in February 2010.

In addition to Facebook, Cassandra helps a number of other companies achieve web scale. It has some [impressive numbers about scalability on its homepage](http://cassandra.apache.org).

> One of the largest production deployments is Apple's, with over 75,000 nodes storing over 10 PB of data. Other large Cassandra installations include Netflix (2,500 nodes, 420 TB, over 1 trillion requests per day), Chinese search engine Easou (270 nodes, 300 TB, over 800 million requests per day), and eBay (over 100 nodes, 250 TB).

- **Available on start.spring.io?** Yes.
- **Supported by Spring Data?** Yes, via [Spring Data Cassandra](https://projects.spring.io/spring-data-cassandra).
- **Bonus:**  Supported by NoSQLUnit and JHipster. Hibernate ORM support is in progress.

### Neo4j

Neo4j is available as GPL3-licensed "community edition" with some extensions licensed under the Affero GPL. The community edition is limited to running on one node and does not contain clustering support or hot backups. Neo4J's "enterprise edition" has scale-out capabilities, in-memory page cache, and hot backups. A 30-day trial is available; no pricing is provided.

Neo4j is best known as a graph database, where everything is stored as an edge, node, or an attribute. Version 1.0 was released in February 2010 and has been developed by Neo4j, Inc. since its beginning. Its [large customers](https://neo4j.com/customers/) include Walmart, Airbnb, Monsanto, and eBay. 

- **Available on start.spring.io?** Yes.
- **Supported by Spring Data?** Yes, via [Spring Data Neo4j](https://projects.spring.io/spring-data-neo4j).
- **Bonus:**  Supported by Hibernate ORM and NoSQLUnit.

### PostgreSQL JSON

PostgreSQL is a traditional relational database management system (RDBMS) that has NoSQL support via its native JSON support (added in version 9.2). In 9.4, they added support for Binary JSON (aka [JSONB](https://www.postgresql.org/docs/current/static/datatype-json.html)) and indexes. 

Leigh Halliday explains how you can [unleash the power of storing JSON in Postgres](https://blog.codeship.com/unleash-the-power-of-storing-json-in-postgres/) in a blog post dated June 2017. Halliday goes on to show how this can be used with Ruby on Rails. A blog post from Umair Shahid shows [how to process PostgreSQL JSON & JSONB data in Java](https://blog.2ndquadrant.com/processing-json/). 

I'm not sure that PostgreSQL and its JSON support should be included as a recommend NoSQL option. However, it likely makes sense if you're already using PostgreSQL and want to make your data schema more free-flowing. As [Dj Walker-Morgan says](https://www.compose.com/articles/could-postgresql-9-5-be-your-next-json-database/), "PostgreSQL 9.5 isn't your next JSON database, but it is a great relational database with a fully fledged JSON story."

- **Available on start.spring.io?** Yes.
- **Supported by Spring Data?** Yes, via [Spring Data JPA](https://projects.spring.io/spring-data-jpa/).

## Recommendation

I feel good about how this analysis played out, and as a committer on the [JHipster](http://www.jhipster.tech) project, I'm both well aware of the strength of that team and think that its support for MongoDB and Cassandra is a pretty strong endorsement. It's interesting to see that there's [work-in-progress to add Couchbase](https://github.com/jhipster/generator-jhipster/issues/6086) too.

But I'm not stopping there. I shared this analysis with a few experts I know in the Java and NoSQL communities and asked them the following questions:

1. Do you agree with my choices of the top 5 NoSQL options (MongoDB, Redis, Cassandra, Neo4j, and PostgreSQL with its JSON support)?
2. Do you have any good or bad stories about using any of these databases in production?
3. Have you found any of these databases particularly difficult to get started with or maintain over time?
4. What is your favorite NoSQL database and why?
5. Anything else you'd like to share?

Please check back in a few weeks! I'll post the answers to these questions from the experts I interviewed. I'll also update this post to point to it when I do. If you're an expert on NoSQL databases, let me know! I'd be happy to include your answers in the interview. Just send me a message to [@mraible on Twitter](https://twitter.com/mraible) or matt.raible@okta.com.

**Update:** [Part II has been published](/blog/2017/10/10/nosql-options-for-java-developers-part-ii). Many thanks to Justin McCarthy, Rafal Glowinski, Vlad Mihalcea, and Laurent Doguin for answering these questions!

## Research & Notes

ITBusinessEdge has a [slideshow about the top five NoSQL databases](http://www.itbusinessedge.com/slideshows/top-five-nosql-databases-and-when-to-use-them.html). However, there's no date on the article, and it says Redis Labs made the selection. The slideshow lists MongoDB, Cassandra, Redis, Cassandra, CouchDB, and HBase. 

[Matthew Mayo](https://twitter.com/mattmayo13), editor of KDnuggets, wrote a similar article about [Top NoSQL Database Engines](http://www.kdnuggets.com/2016/06/top-nosql-database-engines.html) in June 2016. Mayo used [db-engines.com ranking](http://db-engines.com/en/ranking) and Google Trends to select the top five: MongoDB, Cassandra, Redis, HBase, and Neo4j.

Hackernoon has an [Infographic of the most popular NoSQL databases](https://hackernoon.com/top-4-nosql-databases-infographic-b6acc389befc) that are "worth your notice." This article is from June 2017, and the comments say the rankings are based on stats from <https://db-engines.com/en/ranking_trend>. 

{% img blog/nosql-for-java/hackernoon-infographic.png alt:"Hackernoon Infographic" %}{: .center-image }

**NOTE:** If you look at this ranking today (September 6, 2017), you'll see that Redis has replaced Couchbase. Or maybe Hackernoon skipped over Redis? It also begs the question: is Elasticsearch a NoSQL database, or a search engine? Should Solr be considered a NoSQL database as well? Both show up in [DB-Engines Ranking Trends](https://db-engines.com/en/ranking_trend).

{% img blog/nosql-for-java/db-engines-ranking-graph.png alt:"DB-Engines Ranking Graph" width:"800" %}{: .center-image }

JAXenter published the results of their annual survey of [top database trends](https://jaxenter.com/top-databases-2017-132912.html) on March 30, 2017. They list Elasticsearch and Solr as databases. They also include Apache Spark and Hadoop. MongoDB, Cassandra, Redis, and Neo4j are the most interesting "NoSQL" databases. Hazelcast is listed as the top in-memory data grid, over CouchDB and Oracle.

{% img blog/nosql-for-java/jaxenter-top-databases.png alt:"JAXenter Top Database Trends" width:"645" %}{: .center-image }

**Changelog:**

* Oct 10, 2017: Updated to link to [Part II blog post](/blog/2017/10/10/nosql-options-for-java-developers-part-ii) with answers from experts.