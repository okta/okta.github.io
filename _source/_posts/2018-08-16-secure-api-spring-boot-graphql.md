---
layout: blog_post
title: "Build a Secure API with Spring Boot and GraphQL"
author: moksamedia
description: "This post shows you how to build an GraphQL API with Spring Boot, then lock it down with Spring Security, OAuth 2.0, and Okta."
tags: [graphql, spring boot, spring security, oauth]
tweets:
- "Learn how to build a secure API with @springboot and @GraphQL →"
- "Have your heard of GraphQL as an alternative to building REST APIs? This post shows you what it is and how it works with @springboot. It's #bootiful!"
---

GraphQL is a data query language developed by Facebook in 2012 to solve a shortcoming of REST APIs and traditional database models. All too often, when programmers write REST API data queries, they default to retrieving entire data structures when they need only a part of it. For example, if you want to find out the number of comments on a blog post, a developer might typically retrieve the entire post and all associated fields along with all the comments and all their associated fields **only to** count the number of comments in the resulting array.

This is pretty inefficient. However, modern computers are fast. Even a shared server these days is pretty damn fast, as long as you have hundreds or thousands of users. However, when you get to Facebook scale, reaching a sizeable portion of the human beings on the internet, this breaks down. This kind of inefficiency becomes either unworkable or expensive.

It is possible, of course, to write a better SQL query (or NoSQL query) and write a specific API front end call to count the number of blog posts that is far more efficient - but you have to do this for every specific data query case.

There's also the problem of wanting more data. What if you want a set of users blog posts and their associated comments AND you also want another set of unrelated data? Typically you make two separate calls to the REST API. In fact, a REST API interaction can result in dozens of calls over the course of a specific API interaction as all necessary data is retrieved. Again, on modern broadband and with relatively few users, this is functional. With hundreds of millions or even billions of users, it breaks down. Milliseconds of efficiency matter. Reducing the number of network calls matters.

There has to be a better way, a more generalized way to allow a front end to request only the data it wants, and to reduce the number of network interactions by combining requests for data.

This is why Facebook developed GraphQL. It provides a framework to describe your data model and allow consumers of the data to ask for exactly what they want and to retrieve predictable results.

## When Would I Use GraphQL?

GraphQL is enormously powerful and flexible, and when used at internet scale, can provide a significant performance improvement over traditional REST APIs. So why **wouldn't** you use it? Well, in my experience, on smaller projects, I felt like I was often just moving a lot of REST logic into GraphQL schema definitions, where validation and authorization code ended up being nested into a fairly ugly gigantic schema. I also felt like I was duplicating my data type definitions: once in GraphQL and another time in my ORM (this may not be a problem with all implementations). 

GraphQL also brings a unique set of security concerns - there's nothing wrong with it; it's just going to be different than using REST APIs or SQL queries so you need to spend a little time researching security. I would consider using it in a situation where an application was going to scale quickly or where the data set might evolve significantly over time. If I had a limited set of well defined data on a smaller project, I'd probably just stick with a REST API.

## How Do I Use GraphQL?

From a developer perspective, there are two major components: 

* the type descriptions
* the query language

The type descriptions end up looking a lot like ORMs (if you're familiar with those). You define types and fields on those types. Later you also define functions to retrieve that information from your database.

For example, let's look at a very simple blog post definition.

```GraphQL
type Post {  
    id: ID!  
    text: String!  
}
```

Pretty basic. A `post` has an `id` and a `text` field. Let's add some comments to the Post type definition.

```GraphQL
type Post {  
    id: ID!  
    text: String!  
    comments: [Comment!]!  
}  
  
type Comment {  
    id: ID!  
    text: String!  
}
```

Now the type Post contains an array of type Comments. How do we turn this into a usable GraphQL schema definition? 

We need to do two things: 

 1. Define a "Query" type--the entry point for all GraphQL queries into our data
 2. Write methods for each field on each type that return the requested field from the data type

## Define Your GraphQL Schema Query

In the simple example application we're building, we would want to be able to query for Posts, so lets add a Query type with a `post` field of type Post. Our GraphQL schema would now look like this:

```GraphQL
type Query {  
    post(id: ID!): Post  
}

type Post {  
    id: ID!  
    text: String!  
    comments: [Comment!]!  
}  
  
type Comment {  
    id: ID!  
    text: String!  
}
```

Just to reiterate, the types Post and Comment directly describe our data structure, and the type Query is a GraphQL-ism, a special type that defines the read-only entry point for the schema. There is also a Mutation type that provides a mutable access point in the schema.

Another thing to note is that fields can have arguments. If you look at the `post` field on the Query type, you'll notice it has an argument of type ID. This argument can be specified in the query and will be passed to the function that is called to retrieve the data.

The exclamation points, by the way, simply mean that the type is non-nullable.

## Types in GraphQL

GraphQL is basically about defining fields on types and querying for those fields. It is strongly typed, and has 5 built in scalar types: 

* Int: a 32-bit integer
* Float: A signed double-precision floating-point value
* String: A UTF‐8 character sequence
* Boolean: true or false
* ID: unique identifier, serialized as a String

Custom Scalar types can also be defined, such as a Date type, for example, and methods must be provided for serialization, deserialization, and validation.

Enums and Lists/Arrays can also be specified. We created a List of `Comments` in our `Post` type above.

The [official GraphQL documentation](http://graphql.github.io/learn/schema/) have more information on types and schemas.

## Using GraphQL in Java

In this tutorial, we are going to use a project called `graphql-tools` to integrate GraphQL with Spring Boot. According to the [project github page](https://github.com/graphql-java/graphql-java-tools) readme, `graphql-tools` "allows you to use the GraphQL schema language to build your [graphql-java](https://github.com/graphql-java/graphql-java) schema and allows you to BYOO (bring your own object) to fill in the implementations." 

It works great if you have, or want to have, plain old java objects (POJO) that define your data model. Which I do.

What would our POJOs look like?

```java
class Post {  
  
    protected int id;  
    protected String text;  
  
    Post(int id) {  
        this.id = id;  
        this.text = "";  
        this.comments = new ArrayList<Comment>();  
    }  
  
    Post(int id, String text, ArrayList<Comment> comments) {  
        this.id = id;  
        this.text = text;  
        this.comments = comments;  
    }  
  
    protected ArrayList<Comment> comments;  
  
}

class Comment {  
  
    private int id;  
    private String text;  
  
    Comment(int id, String text) {  
        this.id = id;  
        this.text = text;  
    }  
      
}
```

These classes would define the basic types of our data model, and would correspond to the types in the GraphQL schema. They would be defined in separate java class files. (See what I mean about having duplicate data definitions?)

We would also need to define a couple "Resolvers". Resolvers are used by `graphql-tools` to resolve non-scalar types. Each type in our GraphQL schema that contains non-scalar types needs to have an associated Resolver. Thus our `Query` type and our `Post` type need resolvers, but our Comment` type does not.

Here is what the Post Resolver might look like:

```java
class PostResolver implements GraphQLResolver<Post> {  
  
    public List<Comment> getComments(Post post) {  
        return post.comments;  
    }  
}
```

And here is a skeleton for the Query Resolver:

```java
class Query implements GraphQLQueryResolver {  
 
    Post getPost(int id) {
	    // Do something to retrieve the post
    }  
}
```

## Download the Spring Boot Example App

So now we get to the exciting part! Building a Spring Boot application that uses GraphQL, and securing that application with Okta (which we'll get to last, and which Okta has made super easy).

Now would be a great time to go ahead and download [our example application](https://github.com/oktadeveloper/okta-springboot-graphql-example). It's based on the example-graphql-tools project from [this awesome project](https://github.com/graphql-java/graphql-spring-boot) on the graphql-java github page.

```bash
git clone https://github.com/oktadeveloper/okta-springboot-graphql-example.git
```

This project is actually two sub-projects:
* **OktaShowToken**: used to retrieve a working authorization token from an Okta OAuth OIDC application
* **OktaGraphQL**: Spring Boot resource server based on GraphQL (to which we'll be adding Okta Auth at the end

## Create Okta OAuth Application and Install HTTPie

This tutorial makes the assumption that you already have a free Okta Developer account (if not, why don't you head over to [developer.okta.com](https://developer.okta.com) and create one). 

### Why Okta?

At Okta, our goal is to make [identity management](https://developer.okta.com/product/user-management/) a lot easier, more secure, and more scalable than what you're used to. Okta is a cloud service that allows developers to create, edit, and securely store user accounts and user account data, and connect them with one or multiple applications. Our API enables you to:

* [Authenticate](https://developer.okta.com/product/authentication/) and [authorize](https://developer.okta.com/product/authorization/) your users
* Store data about your users
* Perform password-based and [social login](https://developer.okta.com/authentication-guide/social-login/)
* Secure your application with [multi-factor authentication](https://developer.okta.com/use_cases/mfa/)
* And much more! Check out our [product documentation](https://developer.okta.com/documentation/)

### Create a New OIDC App in Okta

To create a new OIDC app on Okta, you can begin with the default settings, then:

1. Log in to your developer account, navigate to **Applications**, and click on **Add Application**.
3. Select **Web** and click **Next**. 
4. Give the application a name, add `http://localhost:8080/login` as a Login redirect URI, and click **Done**.

We're going to use HTTPie, a great HTTP command line client. So if you don't have that installed, check it out and follow the installation instructions on [httpie.org](https://httpie.org/).

## Check Out the OktaGraphQL Example App

Let's ignore the OktaShowToken project for a moment and take a look at the OktaGraphQL, which is initially configured to run without authentication.

You'll notice that there isn't really much to it, beyond the POJO classes and resolvers in the `com.okta.springbootgraphql.resolvers` package, as well as the GraphQL schema definition found in `src/main/resources/graphql-tools.graphqls`.

Most of this should be pretty self-explanatory at this point. I'll simply point out that our Query class (the query resolver) is a bit of a quick and dirty hack to avoid having to setup an actual database data source. We're just generating the `Post`s and `Comment`s on the fly based on their ID number. In the real implementation, you'd be adding some more business layer logic here, such as authorization, and looking up the data in your data source.

{% raw %}
```java
class Query implements GraphQLQueryResolver {  
  
    Post getPost(int id) {  
  
        if (id == 1) {  
            ArrayList<Comment> comments = new ArrayList<Comment>() {{  
                add(new Comment(1, "GraphQL is amazing!"));  
            }};  
            return new Post(id, "Okta + GraphQL is pretty sweet.", comments);  
        }  
        else if (id == 2) {  
            ArrayList<Comment> comments = new ArrayList<Comment>() {{  
                add(new Comment(1, "I can't believe how easy this is."));  
            }};  
            return new Post(id, "Is GraphQL better than a REST API?", comments);  
        }  
        else {  
            return null;  
        }  
    }
}
```
{% endraw %}

## Run Your First GraphQL Query

Open a terminal and from the OktaGraphQL project directory, start the Spring Boot application using the `./gradlew bootRun` command.

It may take a few seconds to get started. You should see some output that ends like this:

```bash
Tomcat started on port(s): 9000 (http) with context path ''
Started GraphQLToolsSampleApplication in 19.245 seconds (JVM running for 19.664)
```

Leave that terminal window open and open another terminal window. Navigate again to the project root. Use the following command to run our first GraphQL Query:

```bash
http POST http://localhost:9000/graphql/ < json-requests/post1-all-data.json
``` 

Here we're making a POST request with content type `application/json` (because this is the default for `HTTPie`) and we're sending the query found in the `json-requests/post1-all-data.json` file as the request body.

The request body from `json-requests/post1-all-data.json`:

```json
{  
  "query": "{ post(id: '1') { id, text, comments { id, text} } }"  
}
```

The expected result:
```bash
HTTP/1.1 200 
Content-Length: 122
Content-Type: application/json;charset=UTF-8
Date: Fri, 03 Aug 2018 21:50:25 GMT
```
```json
{
    "data": {
        "post": {
            "comments": [
                {
                    "id": "1",
                    "text": "GraphQL is amazing!"
                }
            ],
            "id": "1",
            "text": "Okta + GraphQL is pretty sweet."
        }
    }
}
```

At this point you could play around with the JSON request files, asking for less data or requesting a different post.

We're going to move on to adding authentication.

## Add Okta for OAuth

At this point we're gonna need a few things from your Okta OAuth application settings:

* client ID
* client secret
* your Okta base URL (something like this: `https://dev-123456.oktapreview.com`)

The client ID and client secret can be found in the general settings for your application (select the **Application** menu, select the application you want to use, and finally select the **General** tab).

In the OktaGraphQL project, create a `gradle.properties` file and fill in the following properties:

```properties
oktaClientId={yourClientId}
oktaBaseUrl=https://{yourOktaDomain}
```

In the `src/main/resources/application.yml` file, add the following properties:

```yml
okta:  
   oauth2: 
      issuer: ${oktaBaseUrl}/oauth2/default  
      clientId: ${oktaClientId}  
      scopes: 'email profile openid'
```


Add the following dependencies to the `build.gradle` file in the OktaGraphQL project. These are the Spring Boot OAuth dependencies and the [Okta Spring Boot starter](https://github.com/okta/okta-spring-boot).

```gradle
compile group: 'com.okta.spring', name: 'okta-spring-boot-starter', version: '0.6.0'  
compile group: 'org.springframework.security.oauth', name: 'spring-security-oauth2', version: '2.3.3.RELEASE'  
compile ('org.springframework.security.oauth.boot:spring-security-oauth2-autoconfigure:2.0.1.RELEASE')
```

Now let's add two annotations (`@EnableResourceServer` and  `@EnableOAuth2Sso`) to the `GraphQLToolsSampleApplication` class. It should look like this:

```java
package com.okta.springbootgraphql;  
  
import org.springframework.boot.SpringApplication;  
import org.springframework.boot.autoconfigure.SpringBootApplication;  
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;  
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;  
  
@SpringBootApplication  
@EnableResourceServer  
@EnableOAuth2Sso  
public class GraphQLToolsSampleApplication {  
  
    public static void main(String[] args) {  
        SpringApplication.run(GraphQLToolsSampleApplication.class, args);  
    }  
}
```

Stop your Spring Boot app (if it's still running) and restart it using `./gradlew bootRun`.

Run a query against the GraphQL server and you'll see a 401 error:

```bash
HTTP/1.1 401 
Cache-Control: no-store
Content-Type: application/json;charset=UTF-8
Date: Fri, 03 Aug 2018 22:10:50 GMT
Pragma: no-cache
Transfer-Encoding: chunked
WWW-Authenticate: Bearer realm="api://default", error="unauthorized", error_description="Full authentication is required to access this resource"
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```
```json
{
    "error": "unauthorized",
    "error_description": "Full authentication is required to access this resource"
}
```
## Get an Access Token

To access our protected GraphQL server now, we need an Okta access token. Typically this would be managed through the context of an application front end. For the purposes of this tutorial, we're going to use our OktaShowToken application to retrieve an authorization token from our Okta application.

In the OktaShowToken project, create a `gradle.properties` file and fill in the following properties:

```properties
oktaClientId={yourClientId}
oktaClientSecret={yourClientSecret}
oktaBaseUrl=https://{yourOktaDomain}
```

Open a terminal, go to the OktaShowToken project root, and run `./gradlew bootRun`.

Once the application completes launching, navigate to `http://localhost:8080`.

You'll go through the Okta login and authentication process. You should see the Okta login screen.

{% img blog/spring-boot-graphql/okta-sign-in.png alt:"Okta login screen" width:"550" %}{: .center-image }

After logging in, you'll see a page of text that contains your access token. Leave this page open and/or copy this token somewhere where you can use it later.

## Use the Access Token to Access the GraphQL Endpoint

First lets store the token value in a temporary shell variable:

```bash
TOKEN={accessTokenValue}
```

Then let's run the request again setting the authorization header. You'll need to run the following command from the `OktaGraphQL` directory.

```bash
http POST http://localhost:9000/graphql/ Authorization:"Bearer $TOKEN" < json-requests/post1-all-data.json 
```

You should see these familiar results:

```bash
HTTP/1.1 200 
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Content-Length: 122
Content-Type: application/json;charset=UTF-8
Date: Fri, 03 Aug 2018 22:22:00 GMT
Expires: 0
Pragma: no-cache
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```
```json
{
    "data": {
        "post": {
            "comments": [
                {
                    "id": "1",
                    "text": "GraphQL is amazing!"
                }
            ],
            "id": "1",
            "text": "Okta + GraphQL is pretty sweet."
        }
    }
}
```

## Learn More About Spring Boot, GraphQL, and Secure API Design

And that's it! GraphQL is obviously a pretty deep subject, and if you're coming from a traditional REST API background, you'll need to dig into it a little to shift paradigms and properly implement everything. 

In their docs, the GraphQL people make a point of repeatedly stating that **GraphQL does not replace your business logic layer**, but instead provides a data access query language and type schema that sits between your business logic layer and the outside world. Take a look at their [docs on authorization](http://graphql.github.io/learn/authorization/) to get a feel for this. 

But as you can see, Okta's Spring Boot Starter makes securing a GraphQL endpoint incredibly simple. If you're interested in learning more about Spring Boot or GraphQL, please check out these related posts:

* [Build a Health Tracking App with React, GraphQL, and User Authentication](/blog/2018/07/11/build-react-graphql-api-user-authentication)
* [Get Started with Spring Boot, OAuth 2.0, and Okta](/blog/2017/03/21/spring-boot-oauth)
* [Secure Server-to-Server Communication with Spring Boot and OAuth 2.0](/blog/2018/04/02/client-creds-with-spring-boot)
* [10 Excellent Ways to Secure Your Spring Boot Application](/blog/2018/07/30/10-ways-to-secure-spring-boot)

If you have any questions about this post, please add a comment below. For more awesome content, follow [@oktadev](https://twitter.com/oktadev) on Twitter, like us [on Facebook](https://www.facebook.com/oktadevelopers/), or subscribe to [our YouTube channel](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q).
