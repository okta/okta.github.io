---
layout: blog_post
title: Android Unit Testing Part II&#58; Escaping Dalvik's Hold
author: victor_ronin
tags: [android, testing]
redirect_from:
  - "/blog/2015-04-14-android-unit-testing-part-2"
---
*This is the second of a four part series on Android Unit Testing. In
these posts, we'll walk through the key steps engineers should take
to make Android test fast by running them on JVM (versus running
them on emulator).*

*For background information on the importance of Android testing, [visit Part I of the series](https://www.okta.com/blog/2015/01/android-unit-testing-part-i-what-makes-strong-test-automation/).*

It appears that the need to run tests on an Android device or an
emulator has concerned Android engineers for almost as long as Android
has existed &#x2013; and [Christian Williams](https://www.linkedin.com/pub/christian-williams/8/4/30b) created [Robolectric](http://robolectric.org/) to solve
this problem. Robolectric allows you to run unmodified test code
(referring to Android specific classes) on your desktop (in a JVM)
instead of running them on an emulator or device in the Android
Virtual Machine, or [Dalvik](http://en.wikipedia.org/wiki/Dalvik_%28software%29).

I have listed several good tutorials at the end of this post that
illustrate exactly how this can be done, but they also include some
details you may not yet need. So, use the tutorial links for details,
but check out "My Summary" for a short overview of what you need to
do:

## My Summary

-   Create a new project in Android Studio (I used Studio 0.8.14)

    Choose as example Blank Activity project.
-   Modify the TOP Gradle file

    Add the following code to the dependencies section:

    ~~~ conf
    classpath 'org.robolectric:robolectric-gradle-plugin:0.12.+'
    ~~~
-   Modify the application Gradle file

    Add the following code under `apply plugin: 'com.android.application'`:

    ~~~ conf
    apply plugin: 'robolectric'
    ~~~
-   Add the following under the dependencies section:

    ~~~ conf
    androidTestCompile('junit:junit:4.11')
    androidTestCompile('org.robolectric:robolectric:2.3')
    ~~~

-   Add this section:

    ~~~ conf
    robolectric {
            include '**/*Test.class'
    }
    ~~~
-   Create the code that you want to test

    Modify `MainActivity`. Add the following code to it:

    ~~~ java
    private Foo foo = new Foo();
    public int getSomething() {
        return foo.getFoo();
    }
    ~~~

    Add the `Foo` class:

    ~~~ java
    package com.example.myapplication;

    public class Foo {
        Bar bar = new Bar();

        public int getFoo() {
            return bar.getBar();
        }
    }
    ~~~
-   Add the `Bar` class:

    ~~~ java
    package com.example.myapplication;

    public class Bar {

        public int getBar() {
            return 4;
        }
    }
    ~~~
-   Create a test

    Delete the `ApplicationTest` file.

    Create the following `FooTest` class under your `androidTest`:

    ~~~ java
    package com.example.myapplication;

    import junit.framework.Assert;

    import org.junit.Before;
    import org.junit.Test;
    import org.junit.runner.RunWith;
    import org.robolectric.RobolectricTestRunner;

    @RunWith(RobolectricTestRunner.class)
    public class FooTest {
        Foo sut;

        @Before
        public void setUp() {
            sut = new Foo();
        }

        @Test
        public void testGetFoo_returns4() {
            // Arrange

            // Act
            int actualResult = sut.getFoo();

            // Assert
            Assert.assertEquals(4, actualResult);
        }
    }
    ~~~

-   Create the configuration

    1.  Create a **gradle** configuration.
    2.  Set "**Tests**" as a name.
    3.  Choose the top gradle file as a project.
    4.  Type *test* in **Tasks**.

    Now, without launching the emulator, you can run this configuration
    and see that your test has passed. It is much faster than before—and
    repeatable. You can put this under build automation and it will
    totally work.

-   JVM

    There are alternative ways to run the test on a JVM. For example,
    you can create a **JUnit** task and ensure that all your tests and
    classes don't touch any Android specific classes. However, this is
    not easy, as you must design all your code with this restriction in
    mind.

    The changes which we did to run on JVM are great, but we are still
    facing the limitations of using integration tests. For example, if
    the implementation of a `Bar` class changes and now uses the network,
    you might start seeing flakiness in the `testGetFoo_returns4` test
    because of a bad network connection.

## Additional Resources

- [Robolectric Installation for Unit Testing](https://github.com/codepath/android_guides/wiki/Robolectric-Installation-for-Unit-Testing)
- [Android Testing With Robolectric](http://www.peterfriese.de/android-testing-with-robolectric/)
- [Robolectric Gradle Plugin](https://github.com/robolectric/robolectric-gradle-plugin)

Stay tuned for part three of our series, where I will show you how
to achieve test isolation using dependency injection. You can also
check out the full code at [GitHub](https://github.com/vronin-okta/okta_blog_samples/tree/master/android_unit_testing).
