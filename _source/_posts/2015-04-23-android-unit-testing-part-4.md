---
layout: blog_post
title: Android Unit Testing Part IV&#58; Mocking
author: victor_ronin
tags: [android, testing]
redirect_from:
  - "/blog/2015-04-14-android-unit-testing-part-4"
---
*This is the third of a four part series on Android Unit Testing. In
the last two articles I discussed the [general principles of having
good
tests](https://www.okta.com/blog/2015/01/android-unit-testing-part-i-what-makes-strong-test-automation/)
and the way to [run Android tests on JVM making them
fast](/blog/2015/04/07/android-unit-testing-part-2) and [how to make
your code less coupled](/blog/2015/04/14/android-unit-testing-part-3).
This article will explain how to make tests isolated.*

We need to mock a dependency, inject it, and then modify our test to
indicate that we are not testing an end-to-end scenario anymore, but
are now testing just one class at a time.

-   Modify application Gradle file

    Add the following code under the dependency section:

    ~~~ conf
    androidTestCompile 'org.easymock:easymock:3.1'
    ~~~

-   Replace `FooTest` with the following code:

    ~~~ java
    package com.example.myapplication;

    import junit.framework.Assert;

    import org.easymock.EasyMockSupport;
    import org.junit.Before;
    import org.junit.Test;
    import org.junit.runner.RunWith;
    import org.robolectric.RobolectricTestRunner;

    import static org.easymock.EasyMock.expect;

    @RunWith(RobolectricTestRunner.class)
    public class FooTest extends EasyMockSupport {
        Foo sut;

        // Mocks
        Bar barMock;

        @Before
        public void setUp() {
            sut = new Foo();

            // Create mocks
            barMock = createMock(Bar.class);

            // Inject mock
            InjectHelper.injectMock(sut, barMock);
        }

        @Test
        public void testGetFoo_returns4() {
            // Arrange
            expect(barMock.getBar()).andReturn(4);
            replayAll();

            // Act
            int actualResult = sut.getFoo();

            // Assert
            verifyAll();
            Assert.assertEquals(4, actualResult);
        }
    }
    ~~~
-   Create a class `InjectHelper` under `androidTest`

    (I believe the original code for injecting fields is from **Spring**; however, it was modified afterwards.)

    ~~~ java
    package com.example.myapplication;

    import java.lang.reflect.Field;
    import javax.inject.Inject;

    public class InjectHelper {

        @SuppressWarnings("unchecked")
        public static void injectMock(Object target, Object mock)
        {
            Class targetClass = target.getClass();
            do {
                Field[] fields = targetClass.getDeclaredFields();
                // Iterate through all members
                for (Field field : fields) {
                    // Skip all non injectable members
                    if (field.getAnnotation(Inject.class) == null)
                        continue;

                    // Make private/prptected members accessible
                    field.setAccessible(true);

                    // Get a class of the member
                    Class injectedClass = field.getType();
                    Class mockClass = mock.getClass();

                    // Check that mock is essentially the same class
                    if (!injectedClass.isAssignableFrom(mockClass))
                        continue;

                    try {
                        // Inject mock
                        field.set(target, mock);
                    } catch (IllegalAccessException e)
                    {
                        throw new RuntimeException(e);
                    }

                    // return accessibility
                    field.setAccessible(false);
                }
                targetClass = targetClass.getSuperclass();
            }
            while (targetClass != null && targetClass != Object.class);
        }
    }
    ~~~

    **Woo-Hoo! We are finally done!**

    Now, your tests are:

    -   **fast** — they are executed on a JVM and don't require going to the network or a persistent layer.
    -   **repeatable** — they don't depend on emulator stability or network quality.
    -   (potentially!) **simple** and **consistent** — there is a lot of good information out there on how to write good unit tests.
    -   **independent** — since the persistent layer isn't used, one test won't influence another.

    In addition to all of this awesomeness, your code should actually be
    better off, too. Hopefully writing unit tests will force you to
    simplify classes with too many dependencies and more carefully think
    through interfaces.

    Thanks!

    Let me mention several people who helped me to put this article
    together: [Wils Dawson](https://www.linkedin.com/pub/william-dawson/43/140/837) made the initial move to use Robolectric,
    [Nadeem Khan](https://www.linkedin.com/in/nadeemlinkedin) figured out all those pesky details about usage of
    Robolectric, and [Hans Reichenbach](https://www.linkedin.com/pub/hans-reichenbach/20/94b/5b8) put a lot of these integration
    steps in writing on our wiki. Thanks guys!

    <https://github.com/vronin-okta/okta_blog_samples/tree/master/android_unit_testing>
