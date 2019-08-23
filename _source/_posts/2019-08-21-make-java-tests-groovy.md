---
layout: blog_post
title: Make Java Tests Groovy With Hamcrest
description: 'A tutorial on testing Java code with Groovy.'
tags: [spring, oauth, oauth 2.0, java, spring boot, testing, hamcrest, groovy]
author: bdemers
Tweets:
- "Make your test Groovy with @ApacheGroovy"
- "Testing made easy with @Hamcrest and @ApacheGroovy"
image: blog/featured/okta-java-short-skew.jpg
---

My favorite way to test Java code is with Groovy.  Specifically, writing tests in Groovy with Hamcrest.  In this post, I'll walk through how to test a simple Spring Boot application with these tools.

Groovy is an optionally typed dynamic language for the JVM, and can be compiled statically.  That is a mouthful and I'll explain this as we go, but for now think of Groovy as Java with lots of sugar.

Groovy is a great language for writing tests because it is close enough to the Java syntax that your typical Java developer can pick it up right away (unlike other JVM languages). It is **MUCH** less verbose then it's older cousin, you can access private and protected elements from your tests (more on that below), and the sugar!

## Pour Some Sugar On Me

Syntactic sugar is syntax that makes code easier to read and comprehend; and Groovy is sweet! Writing clear, succinct code saves time when writing tests and doubly so when maintaining them.

With Groovy, defining lists and maps become trivial:

```groovy
def myMap = [key1: "value1", 
             key2: "value2",
             nested: [
                 anotherKey: "anotherValue"
             ]]

def myList = ["one", "two", "three"]
```

The Elvis operator makes ternary expressions shorter:

```groovy
def displayName = user.name ?: 'Anonymous'
```

String interpolation! Seriously, why do we not have this not in Java yet?

```groovy
def answer = 42
println "The answer to the ultimate question of life, " +
        "the universe and everything is ${answer}"
```
Results in:
```txt
The answer to the ultimate question of life, the universe and everything is 42
```

Groovy has support for default method parameter values, and while you can accomplish the same thing in Java, it is more verbose. For example, in Groovy we could write:

```groovy
String sayHello(String name = "Joe", String greeting = "How are you?") {
    println "Hello ${name}, ${greeting}"
}
```

The Java equivalent would be:

```java
public String sayHello() {
    return sayHello("Joe");
}

public String sayHello(String name) {
    return sayHello(name, "How are you?");
}

public String sayHello(String name, String greeting) {
    System.out.println("Hello " + name + ", " greeting);
}
```

The Groovy block is faster to write and more concise.

## Optional Typing In Groovy
When defining variables in Groovy the type definition is optional. Using the `def` keyword is a shorthand for defining a type as `Object`. This, combined with Groovy's duck typing means writing less code. 

_Optional typing_ is a topic I want to clarify, especially if you use the `var` keyword added in Java 10. With Java, the type associated with `var` is resolved from the variable initializer, so something like this would fail to compile because the resolved type is a `String`:

```java
var foo = "bar";
foo = 5;
```

The type of a `def` is dynamic so the following Groovy is perfectly valid:

```groovy
def foo = "bar"
foo = 5
```

I'm NOT saying you should mix integers and strings, but this is useful in other scenarios when you want to make use of duck typing. 

## Clone the Test Application

I'm going to start with an existing application and add then add tests. Yes, I know, bad developer, we should all be writing tests first.

Clone the repo:

```bash
git clone https://github.com/oktadeveloper/java-test-groovy-example
cd java-test-groovy-example
```

If you want to skip to the end and just see the code and tests take a look at the [`with-tests`](https://github.com/oktadeveloper/java-test-groovy-example/blob/with-tests/src/test/groovy/com/okta/example/groovytesting/SimpleApplicationTest.groovy) branch.

## Configure Groovy Maven 

To add support for Groovy in a Maven project, I use the [GMavenPlus plugin](https://groovy.github.io/GMavenPlus/).  This plugin will compile our Groovy test classes.  It could also handle your regular (non-test) code as well, but today, I just need to compile tests.

In the plugins section of the `pom.xml` file just add:

```xml
<plugin>
    <groupId>org.codehaus.gmavenplus</groupId>
    <artifactId>gmavenplus-plugin</artifactId>
    <version>1.7.1</version>
    <dependencies>
        <dependency>
            <groupId>org.codehaus.groovy</groupId>
            <artifactId>groovy</artifactId>
            <version>${groovy.version}</version>
        </dependency>
    </dependencies>
    <executions>
        <execution>
            <goals>
                <!-- This goal adds Groovy test sources to the project's test sources. -->
                <goal>addTestSources</goal>
                <goal>compileTests</goal> <!-- Compiles tests -->

                <!-- generates stubs in target/generated-sources/groovy-stubs/test, only needed when
                     compiling Java code that depends on Groovy code -->
                <goal>generateTestStubs</goal>
                <goal>removeTestStubs</goal> <!-- remove generated stubs from sources list -->
            </goals>
        </execution>
    </executions>
</plugin>
```

I've also defined the property: `groovy.version` in the `<properties>` section of the `pom.xml`:

```xml
<properties>
    <groovy.version>2.5.8</groovy.version>
</properties>

```
## Add Dependencies for Groovy, Hamcrest and TestNG

Lastly, we just need to add a few dependencies Groovy, Hamcrest, and TestNG (you could use JUnit instead, if that is more your style).

```xml
<dependency>
    <groupId>org.codehaus.groovy</groupId>
    <artifactId>groovy</artifactId>
    <version>${groovy.version}</version>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>org.hamcrest</groupId>
    <artifactId>hamcrest</artifactId>
    <version>2.1</version>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>org.testng</groupId>
    <artifactId>testng</artifactId>
    <version>6.14.3</version>
    <scope>test</scope>
</dependency>
```

**NOTE:** It may seem a bit funny that the `groovy` dependency is defined both in the dependencies section and the plugin section. This has to do with how plugins are loaded in Maven. Just keep the two the same and everything will work out.

## Write A Test

This simple Spring Boot application only has one class:

```java
package com.okta.example.groovytesting;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

@SpringBootApplication
@RestController
public class SimpleApplication {

    public static void main(String[] args) {
        SpringApplication.run(SimpleApplication.class, args);
    }

    @GetMapping("/")
    private String welcome() {
        return "Hello";
    }

    @GetMapping("/add")
    public int add(@RequestParam("a") int a, @RequestParam("b") int b) {
        return a + b;
    }

    @GetMapping("/concat")
    public String concat(@RequestParam("a") String a, @RequestParam("b") String b) {
        return Objects.toString(a, "") + Objects.toString(b, "");
    }
}

```

So far, so good. We haven't ventured outside of a normal Java application. Time to get Groovy! 

Add a new file: `src/test/groovy/com/okta/example/groovytesting/SimpleApplicationTest.groovy`, that may seem like a mouthful, but if you replace the first and last `groovy` with `java` it would be business as usual.

```groovy
package com.okta.example.groovytesting

import org.testng.annotations.Test

import static org.hamcrest.MatcherAssert.assertThat
import static org.hamcrest.Matchers.allOf
import static org.hamcrest.Matchers.containsString
import static org.hamcrest.Matchers.greaterThan
import static org.hamcrest.Matchers.is
import static org.hamcrest.Matchers.emptyString
import static org.hamcrest.Matchers.lessThan

class SimpleApplicationTest {
}
```

In this class I'll add a few test methods. Of note above you will see the only TestNG reference is the `@Test` annotation.  If you wanted to use JUnit instead you could just swap `Test` annotations because Hamcrest handles all of the assertions directly.

## Using Hamcrest

A while ago, I found myself writing a bunch of repetitive tests that looked like this:

```java
Assert.assertEquals(actual, expected, "my terrible error message")
Assert.assertTrue(1 == 1, "Likely omitted error message")
```

Enter Hamcrest, a declarative matcher library typically used for testing. Hamcrest makes your tests more by replacing assertion logic with simple matchers expressions.  Hamcrest is all about Matchers, so much so that "Hamcrest" is actually an anagram for "Matcher".

A Hamcrest `Matcher` has two methods:

- `boolean matches(Object actualValue)` - Think of this as a replacement using `assertTrue`
- `describeMismatch(Object actual, Description mismatchDescription)` - Adds a useful description in the case of a mismatch

Most of the time you will use one of the many [`Matchers`, Hamcrest](http://hamcrest.org/JavaHamcrest/javadoc/2.1/org/hamcrest/Matchers.html) provides out of the box, typically used with static imports:

```groovy
import static org.hamcrest.MatcherAssert.assertThat
import static org.hamcrest.Matchers.*

// ...
assertThat "foobar", containsString("foo")
```

The default error message is pretty good too, for example, the obviously broken test:

```groovy
assertThat 1 + 1, is(3)
```

Results in with the following error:

```txt
java.lang.AssertionError: 
Expected: is <3>
     but: was <2>
```

The error message for more complex matchers is better, for example, if I were to write:

```groovy
assertThat "bar", containsString("foo")
```

The error message would be:

```txt
java.lang.AssertionError: 
Expected: a string containing "foo"
     but: was "bar"
Expected :foo
Actual   :bar

```

## Test a Private Method with Groovy

Yes, I'm calling a private method.  Now, I know many of you will find this appalling, others have closed their browser tab at the first mention of this.  This is one of those "with great power, comes great responsibility" things.  Have you ever needed to extract some complex logic out into a private method? Ever needed to test it? This also works with protected methods, if that makes you feel better.

```groovy
@Test
void welcomeTest() {
    def app = new SimpleApplication()
    // welcome() is private
    assertThat app.welcome(), is("Hello")
}
```
The Java-based alternative would use either using reflection or weakening the scope of the actual method to package-private, or publicly accessible with `public` or `protected`, which typically means adding documentation (that nobody will read).

Ever seen anything like:
```java
/**
* This method is exposed for testing only, it may change in the future without notice.
**/
@VisibleForTesting
public Object iWishThisWasPrivate() {
    // ...
}
```
I think it's better to avoid this scenario entirely when possible.

## Add OAuth 2.0 Support to the Application

Now that we have tested our application, we can go ahead and start it. If you don't already have a free Okta Developer account, signup at [developer.okta.com](https://developer.okta.com/signup)

Once you have an account, take note of your Okta domain.  This will be in your initial activation email, as well as in the top right of your Okta Developer Console after you log in.

To create an OAuth/OIDC application, from your Okta Developer Console, click **Applications** menu, then click the green **Add Application** button.

Select **Web** as the platform and click **Next**.

Name your application, something like "Testing is Groovy"

Change the Login redirect URIs to `http://localhost:8080/login/oauth2/code/okta`.

Click **Done**.

Take note of the Client ID and Client Secret on the next page and update the  `src/main/resources/application.yml`.

```yaml
okta:
  oauth2:
    issuer: https://{yourOktaDomain}/oauth2/default
    client-id: {clientId}
    client-secret: {clientSecret}
```

Simply run `./mvnw`, open a new Incognito window and browse to `http://localhost:8080/`.  You will be prompted to log in -- use your new Okta credentials.

{% img blog/make-java-tests-groovy/okta-signin-widget.png alt:"Okta Sign-in Widget" width:"400" %}{: .center-image }

Just those three properties are all it takes to secure your application with Okta and OAuth 2.0/OIDC.

## It's Been Groovy

In this post, I've written a few simple tests with Groovy and Hamcrest. The [Groovy documentation site](https://groovy-lang.org/documentation.html) is a great place to learn more.  If you are new to Hamcrest you should also check out [Spotify Hamcrest](https://github.com/spotify/java-hamcrest) which provides a bunch of useful matchers on top of the base library.

If you want to learn more about Okta follow us on Twitter [@OktaDev](https://twitter.com/oktadev), the [OktaDev YouTube channel](https://www.youtube.com/c/oktadev), or these posts:

- [The Hitchhiker's Guide to Testing Spring Boot](/blog/2018/05/02/testing-spring-boot-angular-components)
- [Spring Method Security with PreAuthorize](/blog/2019/06/20/spring-preauthorize)
- [Get Jibby With Java, Docker, and Spring Boot](/blog/2019/08/09/jib-docker-spring-boot)


