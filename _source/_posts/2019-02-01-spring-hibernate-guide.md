---
layout: blog_post
title: 'Data Persistence with Hibernate and Spring'
author: raphaeldovale
description: "Build a Hibernate app with and without Spring then turn it into a secure webapp."
tags: [security, authentication, sessions, jpa, spring, spring data, rest]
tweets: 
- "Build a Hibernate app with and without Spring"
- "Hibernate + Spring, from old school to new"
image: blog/featured/okta-java-short-bottle-headphones.jpg
---

Java developers typically encounter the need to store data on a regular basis. If you've been developing for more than 15 years, you probably remember the days of JDBC in Java. Using JDBC can be tedious if you don't like writing SQL. Not only that, but there's nothing in JDBC that helps you create your database. Hibernate came along and changed everything by allowing you to map POJOs (plain ol' Java objects) to database tables. Not only that, but it had a very Java-esque API that made it easy to create CRUD POJOs. Shortly after, Spring came along and added abstractions for Hibernate that took API simplification even further. Fast forward to today, and most Java applications use both Spring and Hibernate.

For some time now, developers have operated under one of two separate but distinct models to represent business entities. The relational model, which is prevalent in databases, and the object-oriented model. These two models are similar in that both work using similar structures to represent business logic, and they are distinct in that they were designed for different purposes: one to store data, other to describe behavior.

## Use Hibernate Old Fashioned Way, without Spring

With the advent of Hibernate (and many similar tools) the Java EE team decided to propose a new pattern to guide ORM frameworks using a single language. The JPA (Java Persistence API) was created and it is entirely defined as Java annotations (besides XML) which increase code readability and maintainability. Below is an example of an ol' school XML-based mapping and more current annotation based mapping for the same entity.

**Xml-Based mapping**
```xml
<hibernate-mapping>
  <class name="net.dovale.okta.springhibernate.spring.entities.Teacher" table="teacher">
    <id name="id" type="java.lang.Long">
      <column name="id" />
      <generator class="identity" />
    </id>
    <property name="name" type="string">
      <column name="name" length="255" not-null="true" />
    </property>
    <property name="pictureURL" type="string">
      <column name="pictureURL" length="255" not-null="true"  />
    </property>
    <property name="email" type="string">
      <column name="email" length="255" not-null="true" unique="true" />
    </property>
  </class>
</hibernate-mapping>
```

**Annotation-based mapping**
```java
@Entity
@Table(uniqueConstraints = @UniqueConstraint( name = "un_teacher_email", columnNames = {"email" }))
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    private String name;
    @NotNull
    private String pictureURL;
    @NotNull
    private String email;

    // (...) getter and setters (...)
}
```

In this post, you are going to work in two different technology stacks. You'll create a very simple project using Hibernate (JPA annotations), then move to a Spring Boot project doing the same thing. After that, you'll be introduced to [Project Lombok](https://projectlombok.org/) which will reduce your project's lines-of-code counter even further. Then, you are going to expose the CRUD operations as REST endpoints secured with Okta, and OAuth 2.0.

## Create a Project Using Hibernate

In this project, you are going to use core Hibernate functionality with JPA annotations. You are not addressing _XML_ configuration as it is not commonly used nowadays.

The project is already implemented [here](https://github.com/oktadeveloper/okta-spring-boot-hibernate-spring-project/tree/raw) on the `raw` branch. The database model is represented in the following model:

```
+--------+*        1 +-------+
| Course +---------> |Teacher|
+--------+           +-------+
```

For simplicity's sake, the database chose is an H2 Database, an _in memory_, small, 100% Java database, excellent for testing and development purposes. The project has two significant dependencies:

```xml
<dependency>
    <groupId>org.hibernate</groupId>
    <artifactId>hibernate-core</artifactId>
    <version>5.3.6.Final</version>
</dependency>
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <version>1.4.197</version>
</dependency>
```

Each database table is mapped to an entity. `Course` table is represented by `net.dovale.entities.Course ` entity and `Teacher` is represented by `net.dovale.entities.Teacher`. Let's take a look into the `Teacher` entity:

```java
package net.dovale.entities;

import javax.persistence.*;

@Entity
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private String pictureURL;
    private String email;

    public Teacher() { }

    public Teacher(String name, String pictureURL, String email) {
        this.name = name;
        this.pictureURL = pictureURL;
        this.email = email;
    }
    // (...) getter and setters (...)
}
```

You just need to add `@Entity` annotation for Hibernate to understand the database must have a table with the same class name. Also, the entity has an `@Id` which means the attribute with it is an entity identifier. In this case, we defined how our ID's will be automatically generated (the decision is up to _Hibernate_ dialect).

Now, you are going to review a more complex relationship type on `Course` entity:

```java
package net.dovale.entities;

import javax.persistence.*;

@Entity
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private int workload;
    private int rate;
    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey(name = "fk_course_teacher"))
    private Teacher teacher;
    
    public Course() { }
    
    public Course(String name, int workload, int rate, Teacher teacher) {
        this.name = name;
        this.workload = workload;
        this.rate = rate;
        this.teacher = teacher;
    }
    // (...) getter and setters (...)
}
```

As you can see, there is a `@ManyToOne`and a `@JoinColumn` annotation. Those annotations represent, as the name says, a many-to-one relationship (when a single entity has many relationships with other entity). The annotation `@JoinColumn` specifies the relationship must be made by a column in the _One_ entity (Course, in this case) and `@ForeignKey` specifies the constraint name. I always recommend specifying the foreign key name to help to debugging.

We have two DAO's (Data Access Objects) on this project: `CourseDao` and `TeacherDao`. They both extend `AbstractCrudDao` a simple abstract class that has some common CRUD operations:

```java
package net.dovale.dao;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import javax.persistence.criteria.CriteriaQuery;
import java.util.List;

public abstract class AbstractCrudDao<T> {
    private final SessionFactory sessionFactory;
    private final Class<T> entityClass;
    private final String entityName;

    protected AbstractCrudDao(SessionFactory sessionFactory, Class<T> entityClass, String entityName) {
        this.sessionFactory = sessionFactory;
        this.entityClass = entityClass;
        this.entityName = entityName;
    }
    public T save(T entity) {
        sessionFactory.getCurrentSession().save(entity);
        return entity;
    }
    public void delete(T entity) {
        sessionFactory.getCurrentSession().delete(entity);
    }

    public T find(long id) {
        return sessionFactory.getCurrentSession().find(entityClass, id);
    }
    public List<T> list() {
        Session session = sessionFactory.getCurrentSession();
        CriteriaQuery<T> query = session.getCriteriaBuilder().createQuery(entityClass);
        query.select(query.from(entityClass));
        return session.createQuery(query).getResultList();
    }
}
```

The abstract puts all CRUD logic into the same class. In the next sample, a new and better solution will be presented with Spring.

Hibernate uses a `Session` abstraction to communicate with the database and convert objects to relations and vice-versa. The framework also introduces its own query language called HQL(Hibernate Query Language). In the code above, HQL is represented on the `list` method. The cool thing about HQL is you are querying objects and not tables and relationships. The Hibernate query engine will convert to SQL internally.

ACID (Atomic Consistent Isolated Durable) is a relational database key feature. It guarantees consistency between the data inserted through transactions. In other words: if you are running a transaction, all your operations are atomic and not influenced by other operations that may be running in the same database, at the same time. To fully accomplish this, Hibernate also has a `Transaction` abstraction. The code on `net.dovale.Application` shows how it works:

```java
package net.dovale;

import net.dovale.dao.*;
import net.dovale.entities.*;
import org.hibernate.*;
import org.hibernate.boot.MetadataSources;
import org.hibernate.boot.registry.StandardServiceRegistry;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;

public class Application {

    public static void main(String[] args) {
        StandardServiceRegistry registry = new StandardServiceRegistryBuilder().configure().build();
        try (SessionFactory sessionFactory = new MetadataSources(registry).buildMetadata().buildSessionFactory()) {
            CourseDao courseDao = new CourseDao(sessionFactory);
            TeacherDao teacherDao = new TeacherDao(sessionFactory);
            try (Session session = sessionFactory.getCurrentSession()) {
                Transaction tx = session.beginTransaction();
                // create teachers
                Teacher pj = teacherDao.save(new Teacher("Profesor Jirafales","https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Ruben2017.jpg/245px-Ruben2017.jpg","jirafales@example.com"));
                Teacher px = teacherDao.save(new Teacher("Professor X","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9uI1Cb-nQ2uJOph4_t96KRvLSMjczAKnHLJYi1nqWXagvqWc4","director@xproject_.com"));
                courseDao.save(new Course("Mathematics", 20, 10, pj));
                courseDao.save(new Course("Spanish", 20, 10, pj));
                courseDao.save(new Course("Dealing with unknown", 10, 100, px));
                courseDao.save(new Course("Handling your mental power", 50, 100, px));
                courseDao.save(new Course("Introduction to psychology", 90, 100, px));
                tx.commit();
            }
            try (Session session = sessionFactory.getCurrentSession()) {
                session.beginTransaction();
                System.out.println("Courses");
                courseDao.list().forEach(course -> System.out.println(course.getName()));
                System.out.println("Teachers");
                teacherDao.list().forEach(teacher -> System.out.println(teacher.getName()));
            }
        }
    }
}
```

This class creates some data for our example database, and all the data is inserted using the same transaction: if an error occurs, all data are erased before any user can query them. To correctly implement this on _raw hibernate_, we call `session.beginTransaction()` and `session.commitTransaction()`. It is also important to call `sessionFactory.getCurrentSession()` and not `sessionFactory.openSession()` to use the same session all over the operation.

Last but not least, we have the configuration file (`src/main/resources/hibernate.cfg.xml`): 

```xml
<hibernate-configuration>
    <session-factory>
        <property name="connection.driver_class">org.h2.Driver</property>
        <property name="connection.url">jdbc:h2:./data/db</property>
        <property name="connection.username">sa</property>
        <property name="connection.password"/>
        <property name="dialect">org.hibernate.dialect.H2Dialect</property>
        <property name="hbm2ddl.auto">create</property>
        <property name="hibernate.connection.pool_size">1</property>
        <property name="hibernate.current_session_context_class">thread</property>
        <property name="hibernate.show_sql">true</property>
        <mapping class="net.dovale.entities.Course"/>
        <mapping class="net.dovale.entities.Teacher"/>
    </session-factory>
</hibernate-configuration>
```

Note that we need to declare all entities with `mapping` node. For debugging purposes, it is important to set `hibernate.show_sql = true` as it is possible to identify possible mapping problems just by reading the generated SQL.

Now, just run the command below to run your project:

```bash
./mvnw compile exec:java -Dexec.mainClass="net.dovale.Application"
```

Phew! That's a lot of code. Now we are going to remove a lot of then by introducing [Spring Data](https://spring.io/projects/spring-data).

## Reduce Hibernate Boilerplate with Spring Boot

As you probably know, [Spring Boot](https://spring.io/projects/spring-boot) has a lot of [magic](https://www.brainyquote.com/quotes/arthur_c_clarke_101182) under the hood. I have to say, using it together with Spring Data is awesome.

You need to create a new project using [Spring Initializr](https://start.spring.io/) with `JPA` and `H2` dependencies. After the project is created, copy all `entities` package to the new project, without any changes. Then, add the `@EnableTransactionManagement` annotation to `net.dovale.okta.springhibernate.spring.Application` class as follows:

```java
@SpringBootApplication
@EnableTransactionManagement
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

Then, remove the original DAO's. With Spring, `CourseDao` and `TeacherDao` will be changed to  interfaces and extend the `CrudRepository` interface. Spring automatically identifies you are creating a Repository (or DAO) class when you extend a `Repository` interface. `CrudRepository` automatically delivers CRUD methods like save, delete, update, and list for your entity without any effort and with transaction support. 

```java
package net.dovale.okta.springhibernate.spring.dao;

import net.dovale.okta.springhibernate.spring.entities.Course;
import org.springframework.data.repository.CrudRepository;

public interface CourseDao extends CrudRepository<Course, Long> {}
```

If you want to skip to a a pre built example you can grab the code from [GitHub](https://github.com/oktadeveloper/okta-spring-boot-hibernate-spring-project). Please, clone it and go to `from_raw_project` branch:

```bash
git clone https://github.com/oktadeveloper/okta-spring-boot-hibernate-spring-project
cd okta-spring-boot-hibernate-spring-project
git checkout from_raw_project
```

Now, to change how we fill in the database. Create a service class `DataFillerService` that is responsible for filling our H2 database with data:

```java
package net.dovale.okta.springhibernate.spring.services;

import net.dovale.okta.springhibernate.spring.dao.*;
import net.dovale.okta.springhibernate.spring.entities.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;

@Service
public class DataFillerService {
    private final CourseDao courseDao;
    private final TeacherDao teacherDao;

    @Autowired
    public DataFillerService(CourseDao courseDao, TeacherDao teacherDao) {
            this.courseDao = courseDao;
            this.teacherDao = teacherDao;
    }
    @PostConstruct
    @Transactional
    public void fillData() {
        Teacher pj = new Teacher("Profesor Jirafales",
                                 "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Ruben2017.jpg/245px-Ruben2017.jpg",
                                 "jirafales@example.com");
        Teacher px = new Teacher("Professor X",
                                 "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9uI1Cb-nQ2uJOph4_t96KRvLSMjczAKnHLJYi1nqWXagvqWc4",
                                 "director@xproject_.com");
        teacherDao.save(pj);
        teacherDao.save(px);
        courseDao.save(new Course("Mathematics", 20, (short) 10, pj));
        courseDao.save(new Course("Spanish", 20, (short) 10, pj));
        courseDao.save(new Course("Dealing with unknown", 10, (short) 100, pj));
        courseDao.save(new Course("Handling your mental power", 50, (short) 100, pj));
        courseDao.save(new Course("Introduction to psychology", 90, (short) 100, pj));
    }
}
```

Do you see how clean your code is when compared to the raw project? This happens because you have only one concern: maintain your business code sanely. While on your raw project you had to handle 	`Session`s and `Ttransaction`s, here we just need to add `@Transactional` annotation to keep the entire method execution inside a database transaction. Besides, the `@PostConstruct` tells Spring this method must be invoked after the context is fully loaded.

Add the following lines in `src\main\resources\application.properties` file to show up all SQL executed and to create the database if it does not exists.

```properties
spring.jpa.show-sql=true
spring.jpa.generate-ddl=true
```

Also, keep in mind Spring Boot automatically discovered H2 dependencies and configured it as the database you are using __without any manual configuration__.

To execute this code (which simply adds the entities to an ephemeral database), just run on a console:

```bash
./mvnw spring-boot:run
```
## Remove Even More Code with Project Lombok

Have you read about [Project Lombok](https://projectlombok.org/)? It works in compile level to reduce Java _famous_ verbosity and add features that are not available in your current JDK version (e.g. [val](https://projectlombok.org/features/val) and [var](https://projectlombok.org/features/var)). In our case, we will remove all boilerplate in entities classes.

Check branch `lombok` to see the final result. Now we just need to add the dependency:

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>
```

And change our entities to:

**Course**
```java
package net.dovale.okta.springhibernate.spring.entities;

import lombok.*;
import javax.persistence.*;

@Entity
@Data
@NoArgsConstructor
@RequiredArgsConstructor
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @NonNull private String name;
    @NonNull private int workload;
    @NonNull private int rate;
    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey(name = "fk_course_teacher"))
    @NonNull private Teacher teacher;
}

```

and  **Teacher**
```java
package net.dovale.okta.springhibernate.spring.entities;

import lombok.*;
import javax.persistence.*;

@Entity
@Data
@NoArgsConstructor
@RequiredArgsConstructor
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @NonNull private String name;
    @NonNull private String pictureURL;
    @NonNull private String email;
}
```

Every _getter_ and _setter_ will be automatically generated by _Lombok_ thanks to `@Data` annotation. 
`@NoArgsConstructor` and `@RequiredArgsConstructor` tells the tool the entity needs two constructors: one empty and another with all arguments that has `@NonNull` annotation (or are final). There is another annotation `@AllArgsConstructor` that creates an constructor with all arguments, but we cannot use it as id attribute can be null (only persisted entities should have a non-null value).

> Note: Lombok has a lot of compile-level stuff and works out-of-the-box with Maven and Spring. Some IDE's needs a specific plugin to work without compilation problems. Check out [Project Lombok's IDE setup guide](https://projectlombok.org/setup/overview).

As in the previous step, you just need to run the command `./mvnw spring-boot:run` to see everything working if you do not believe in me.

## Expose CRUD Operations as a REST Service with Spring Data REST

Now we will explore a [microservice](https://martinfowler.com/articles/microservices.html) area. You are going to change the project to externalize the data into a REST API. Also, we will explore a little bit more about _Spring Repositories_.

About the magic thing, do you believe you just need to add a single dependency to publish your DAO's as a REST API? Test it! Add the following dependency:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-rest</artifactId>
</dependency>
```

Run `./mvnw spring-boot run` and [HTTPie](https://httpie.org/) the following address:

```bash
http http://localhost:8080/teachers
```
```
HTTP/1.1 200
Content-Type: application/hal+json;charset=UTF-8
Date: Fri, 01 Feb 2019 16:32:43 GMT
Transfer-Encoding: chunked

{
    "_embedded": {
        "teachers": [
            {
                "_links": {
                    "self": {
                        "href": "http://localhost:8080/teachers/1"
                    },
                    "teacher": {
                        "href": "http://localhost:8080/teachers/1"
                    }
                },
                "email": "jirafales@example.com",
                "name": "Profesor Jirafales",
                "pictureURL": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Ruben2017.jpg/245px-Ruben2017.jpg"
            },
            {
                "_links": {
                    "self": {
                        "href": "http://localhost:8080/teachers/2"
                    },
                    "teacher": {
                        "href": "http://localhost:8080/teachers/2"
                    }
                },
                "email": "director@xproject_.com",
                "name": "Professor X",
                "pictureURL": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9uI1Cb-nQ2uJOph4_t96KRvLSMjczAKnHLJYi1nqWXagvqWc4"
            }
        ]
    },
    "_links": {
        "profile": {
            "href": "http://localhost:8080/profile/teachers"
        },
        "self": {
            "href": "http://localhost:8080/teachers"
        }
    }
}
```

Test with the other entities like _students_, _teachers_ and _courses_ and you'll see all data we manually insert into the database. It is also possible to _PUT_, _POST_ or _DELETE_ to create, update or delete a registry, respectively.

There is another cool thing about Spring Data Repositories: you can customize them by creating methods into a predefined format. Example for `StudentDao`:

```java
public interface StudentDao extends JpaRepository<Student, Long> {
    List<Student> findByNameContaining(String name);
    List<Student> findByAgeBetween(short smallerAge, short biggerAge);
}
```

All updates are available on the [rest_repository](https://github.com/oktadeveloper/okta-spring-boot-hibernate-spring-project/tree/rest_repository) branch of our Git Repository.

## Secure Your Spring Boot Application with OAuth 2.0 

Security is an important part of any application, and adding OAuth 2.0/OIDC support to any Spring Boot web application only takes few minutes!

Our project is a [OAuth 2.0 resource server](https://www.oauth.com/oauth2-servers/the-resource-server/) and, as such, does not handle login steps directly. It only validates that the request has valid authorization and roles.

First, you need to add the following Maven dependencies:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>com.okta.spring</groupId>
    <artifactId>okta-spring-boot-starter</artifactId>
    <version>1.0.0</version>
</dependency>
```

And update your `Application` class:

```java
package net.dovale.okta.springhibernate.spring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
@EnableResourceServer
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
    @Configuration
        static class OktaOauth2WebSecurityConfigurerAdapter extends WebSecurityConfigurerAdapter {
         @Override
     protected void configure(HttpSecurity http) throws Exception {
            http
                 .authorizeRequests().anyRequest().authenticated()
                 .and()
                 .oauth2ResourceServer().jwt();
        }
    }
}
```

Now, you need to configure your `application.properties` file:

```
okta.oauth2.issuer=https://${yourOktaDomain}/oauth2/default
okta.oauth2.clientId=${clientId}
```

This will enable your REST endpoints to only accept authorized users. To obtain the client ID, you must register for a free [Okta account](https://developer.okta.com/). 

In the Okta dashboard, create an application of type **Service**. This indicates a resource server that does not have a login page or any way to obtain new tokens.

{% img blog/spring-hibernate-guide/okta-app-wizard-service.png alt:"Create new Service" width:"800" %}{: .center-image }

Click **Next**, type the name of your service, then click **Done**. You will be presented with a screen similar to the one below. Paste your _Client ID_ and enter it on into the `application.properties` file (just change `${clientId}` variable). 

{% img blog/spring-hibernate-guide/okta-app-general.png alt:"Service Created" width:"800" %}{: .center-image }

Now, start the application again. It'll be locked and you will be unable to make any requests as all of them are now protected. You just need to acquire a _token_ to connect. An easy way to achieve a token is to generate one using [OpenID Connect <debugger/>](https://oidcdebugger.com/).

Create a new **Web** application in Okta:

{% img blog/spring-hibernate-guide/okta-app-wizard.png alt:"New web application" width:"800" %}{: .center-image }

Set the **Login redirect URIs** field to `https://oidcdebugger.com/debug` and **Grant Type Allowed** to Hybrid. Click **Done** and copy the client ID for the next step.

On the [OIDC Debugger](https://oidcdebugger.com/) website, fill the form in like the picture below (do not forget to fill in the client ID for your recently created Okta web application):

{% img blog/spring-hibernate-guide/oidc-config.png alt:"OpenID connect" width:"700" %}{: .center-image }

Submit the form to start the authentication process. You'll receive an Okta login form if you are not logged in or you'll see the screen below with your custom token.

{% img blog/spring-hibernate-guide/oidc-success.png alt:"OpenID connect - getting token" width:"800" %}{: .center-image }

The token will be valid for one hour so you can do a lot of testing with your API. It's simple to use the token, just copy it and modify the curl command to use it as follows:

```bash
export TOKEN=${YOUR_TOKEN}
http http://localhost:8080 "Authorization: Bearer $TOKEN"
```

For this last step, you can check out the `master` branch and see all the changes I made.

## Learn More About Spring and REST APIs

Object-oriented and relational databases can be tricky, but the Spring team managed to create a straightforward way to integrate both of them and add some advanced features like REST API and OAuth 2.0 authentication.

Though JPA makes it easy to build great apps, big databases can have performance issues. It's a great solution for fast development but does not substitute a proper SQL performance tuning that only an experienced DBA can do. 

Although all database schemas in this post were created automatically by Hibernate, this is not the recommended path for enterprise applications as they are continually evolving and need to change _live_ with minor downtime and be able to roll back. 

In this tutorial, you learned about Hibernate, JPA, and Spring's evolution toward better SQL integration via object-oriented languages. Over the course of the tutorial, you also continuously improved your code so you had better readability and followed better practices.

The source code for this tutorial is [available on GitHub](https://github.com/oktadeveloper/okta-spring-boot-hibernate-spring-project). 

Here some articles on this blog that will help you for further understanding:

- [Build a Basic CRUD App with Angular 7.0 and Spring Boot 2.1](/blog/2018/08/22/basic-crud-angular-7-and-spring-boot-2)
- [Build a Java REST API with Java EE and OIDC](/blog/2018/09/12/secure-java-ee-rest-api)
- [Create a Secure Spring REST API](/blog/2018/12/18/secure-spring-rest-api)

Like what you learned today? Follow us on [Twitter](https://twitter.com/oktadev), like us on [Facebook](https://www.facebook.com/oktadevelopers), check us out on [LinkedIn](https://www.linkedin.com/company/oktadev/), and subscribe to our [YouTube channel](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q) for more awesome content!
