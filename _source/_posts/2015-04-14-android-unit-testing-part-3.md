---
layout: blog_post
title: Android Unit Testing Part III&#58; Disintegration
author: victor_ronin
tags: [android, testing]
redirect_from:
  - "/blog/2015-04-07-android-unit-testing-part-3"
  - "/blog/2015-04-23-android-unit-testing-part-3"
---
*This is the third of a four part series on Android Unit Testing. In
the last two articles I discussed the [general principles of having
good
tests](https://www.okta.com/blog/2015/01/android-unit-testing-part-i-what-makes-strong-test-automation/)
and the way to [run Android tests on JVM making them
fast](/blog/2015/04/07/android-unit-testing-part-2). This
part will show how to make your Android code less heavily
coupled. This is a preparation step to ensure that your tests are
isolated from each other.*

We want to test each unit of work separately to make sure that each
piece of our machinery is working properly. We need to be able to
inject all dependencies into classes under the test (instead of this
class instantiating a production dependency). I am not a fan of
manual dependency injection (i.e., passing them through a
constructor or setters). Such a manual method requires a lot of code
and drags all dependencies through multiple classes to inject them
into the end class.

There are a lot of dependency injection frameworks for Android out
there: Dagger, RoboGuice, SpringAndroid, Guice, and Transfuse are a
few. I won't go into a detailed comparison, but I like Dagger the
most because it provides compile time injection, and doesn't
influence runtime (specifically startup time) too much.

Again, here there are detailed tutorials at the end of this post and
my summary is below:

## My Summary

-   Modify the application Gradle file

    Add the following code under the dependency section:

    ~~~ conf
    compile 'com.squareup.dagger:dagger:1.2.1'
    provided 'com.squareup.dagger:dagger-compiler:1.2.1'
    ~~~
-   Modify the manifest

    Add the following code to the Application tags:

    ~~~ conf
    android:name=".MyApplication"
    ~~~
-   Create the classes

    Add the `MyApplication` class.

    ~~~ java
    public class MyApplication extends Application {
        private ObjectGraph applicationGraph;

        @Override
        public void onCreate() {
            super.onCreate();

            applicationGraph = ObjectGraph.create(getModules().toArray());
        }

        protected List<Object> getModules() {
            return Arrays.<Object>asList(
                    new MyModule(this)
            );
        }
        public void inject(Object object) {
            applicationGraph.inject(object);
        }
    }
    ~~~
-   Add the `MyModule` class.

    ~~~ java
    package com.example.myapplication;

    import dagger.Module;
    import dagger.Provides;

    @Module(
            injects = {
                    MainActivity.class
            }
    )
    public class MyModule {
        private final MyApplication application;

        public MyModule(MyApplication application) {
            this.application = application;
        }
    }
    ~~~
-   Modify `MainActivity` and replace code `private Foo
    foo = new Foo();` with:

    ~~~ java
    @Inject
    Foo foo;
    ~~~

    and add following code to `onCreate()`:

    ~~~
    // This will inject all @Inject members
    // recursively for everything what is marked as @Inject
    ((MyApplication)getApplicationContext()).inject(this);
    ~~~
-   Modify the `Foo` class and replace code `Bar bar = new Bar();` with:

    ~~~ java
    @Inject
    Bar bar;
    ~~~

    Modify Bar class and add

    ~~~ java
    @Inject
    Bar() {
    }
    ~~~

Now, instances of `Foo` and `Bar` are
automatically injected in the runtime. However, your test will fail
with NPE, because the Foo class has a Bar dependency which wasn't
delivered. I.e., we don't want it injected by Dagger -— we want mocked
dependency, not a real one.

## Resources

-   [Dependency injection on Android: Dagger (Part 1)](http://antonioleiva.com/dependency-injection-android-dagger-part-1/)
-   [Dependency injection on Android: Dagger (Part 2)](http://antonioleiva.com/dagger-android-part-2/)

Stay tuned for the final part of our series, where I will show you
how to make tests isolated. You can also check out the full code at
[GitHub](https://github.com/vronin-okta/okta_blog_samples/tree/master/android_unit_testing).
