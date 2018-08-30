---
layout: blog_post
title: 'Create a Basic Android App without an IDE'
author: kpenzhorn
description: 'This tutorial walks you through building a basic Android app without an IDE.'
tags: [android, mobile, okta]
tweets:
  - 'Build a basic @Android app without an IDE! →'
  - "Need to learn the basics @Android? Don't have an IDE? We've got you covered. <3"
  - "Let us show you how to create a basic @Android app. You don't even need an IDE! →"
---

Virtually every Android tutorial uses Android Studio to create and develop an app. This isn't great for learning since you don't see how things work, namely

- The components that make up an Android Studio project
- How builds are setup and configured
- What parts comprise the source

Software development is about files and in this tutorial we're going to go through every file in a basic Android project – first by examining what Android Studio outputs and then by building up an Android project from scratch. We won't assume any previous Android experience, just a little Java.

Note: I'll be doing this on Windows but most instructions should work on other platforms.

## Break Down Your Android Studio Project

This is what Android Studio creates when you start a completely bare project.

{% img blog/build-android-app-without-ide/bare-project.png alt:"Bare project file tree" width:"400" %}{: .center-image }

The first thing to notice is that most files involve Gradle, the system for configuring and executing builds. What do we have without any Gradle files ?

{% img blog/build-android-app-without-ide/bare-project-without-gradle.png alt:"Bare project file tree without Gradle" width:"400" %}{: .center-image }

Only three folders and three files. Clearly the main complexity in Android projects is the build system.

Let's look at what files are not included in source control by looking at _.gitignore_.

{% img blog/build-android-app-without-ide/gitignore.png alt:"gitignore file contents" width:"400" %}{: .center-image }

So `MyApplication.iml` isn't important. If you [Google what iml files are for](https://stackoverflow.com/questions/30737082/what-are-iml-files-in-android-studio) you will see they are used by Android Studio and can be regenerated from the configurations in `.idea/`.

Also, `local.properties` aren't important either, as well as `build/`. What does that leave us with? Just the`app/` folder and some files in `.idea/` which is where IntelliJ (which Android Studio is built on) stores configuration files.

Inside the `app` folder you'll find two directories and three files:

- `libs/`, which is empty
- `src/`, which isn't
- `.gitignore`
- `build.gradle`
- `ProGuard`

ProGuard helps shrink your final APK by removing unused libraries. You don't need this file (it's actually all commented out). The`.gitignore` is use for source control, if you didn't know that already. So it's just `src/` and `build.gradle` that are important.

`src/` contains your Java source code, the resources you use like layouts and configuration files, and the `AndroidManifest` which tells Android what your app is. And `build.gradle` tells Gradle how to convert your source into an APK using the Gradle Android plugin.

To see all of this in action, let's get to building our code base from the ground up, first installing the SDK, then initializing gradle, onto converting to an Android build, and finally writing the app code.

## Get Started with the Android SDK

For this project, you'll need to download the Android SDK. This is just a ZIP file. Go to the [normal install page](https://developer.android.com/studio/) and scroll right to the bottom at Command Line Tools. There you'll find the zips which are only around 150MB. Extract and set your `ANDROID_SDK_ROOT` environment variable to the extracted location.

And that's it! Gradle should pick this up automatically. (Note: Gradle stores the SDK location in the `local.properties` file, which as we saw before isn't saved to source control).

## Initialize Gradle

To start our project from scratch we initialize a folder using Gradle. First install Gradle. I downloaded the binary-only version from the Manual section and added the `bin` folder to my `PATH`.

The `gradle` command should now work from your command line. Note: you need to have Java 7 or higher installed as well. Here is what you see when you initialise an empty folder with `gradle init`.

{% img blog/build-android-app-without-ide/gradle-init.png alt:"Gradle init output" width:"800" %}{: .center-image }

See how all these files are in the Android Studio project output ? For a great explanation of what these files are see the [Gradle create build guide](https://guides.gradle.org/creating-new-gradle-builds/).

## Create an Android Build

Next we need to set up our project to build Android. The first step is to change `settings.gradle` to simply include the app module (which is just a folder).

```
include ':app'
```

Next, put the following into your root `build.gradle`.

```
buildscript {

    repositories {
        google()
        jcenter()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:3.1.3'
    }
}

allprojects {
    repositories {
        google()
        jcenter()
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
```

This primarily defines where to download our Gradle libraries from.

Next, create the `/app` directory and place the following into `app/build.gradle`.

```
apply plugin: 'com.android.application'

android {
    compileSdkVersion 25
    defaultConfig {
        applicationId "com.example.karl.myapplication"
        minSdkVersion 16
        targetSdkVersion 25
        versionCode 1
        versionName "1.0"
    }
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
    implementation 'com.android.support.constraint:constraint-layout:1.1.2'
    implementation 'com.android.support:appcompat-v7:253.1'
}
```

This uses the Android Gradle plugin (com.android.application) and sets some values like the SDK version and Proguard (which optimizes our output size). Also, in the dependencies section it gives any libraries we want to import (here we import two, both used in building our interface later).

Now create `app/src/main/res/values/styles.xml` which we'll use to set our app's theme.

```xml
<resources>

    <!-- Base application theme. -->
    <style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
        <!-- Customize your theme here. -->
    </style>

</resources>
```

Finally put the following into `app/src/main/AndroidManifest.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.karl.myapplication">

    <application
        android:label="Demo App"
        android:theme="@styles/AppTheme">

        <activity android:name=".MainActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
```

This defines the package, label and main activity of our app.

Now when you run `gradlew build` you should see BUILD SUCCESSFUL. And in `app/build/outputs/apk/debug` you should see `app-debug.apk`. You've just set up an Android build from scratch!

To deploy this simply say `gradlew installDebug` with your phone plugged in (and [USB Debugging enabled[(https://www.howtogeek.com/129728/how-to-access-the-developer-options-menu-and-enable-usb-debugging-on-android-4.2/)). You should then see a new app called Demo App. It will crash when you run it because you haven't written any Java code yet!

## Write the Java Application

With your build set up next we need to write the Java. We only need two files for this: the main activity Java file, and the layout XML.

Put the following into `app/src/main/java/com/example/karl/myapplication/MainActivity.java`.

```java
package com.example.karl.myapplication;

import android.app.Activity;
import android.os.Bundle;

public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }
}
```

It just creates a new Activity (a core process-like idea in Android) and sets the view to a layout in the Resources folder.

Put this into `app/src/main/res/layout/activity_main.xml`.

```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello World!"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

</android.support.constraint.ConstraintLayout>
```

This just creates a "Hello World!" message center-screen.

Now run `gradlew build` and you should see BUILD SUCCESSFUL again. Use `gradlew installDebug` to install to your phone and you should see the following:

{% img blog/build-android-app-without-ide/hello-world.png alt:"Hello world Android screen" width:"400" %}{: .center-image }

You've just made a working Android app with nothing but a text editor :).

## Add Authentication with Okta

Most modern apps require some level of security, so it's worthwhile to know how to build authentication simply and easily. For this, we'll use the [OktaAppAuth](https://github.com/okta/okta-sdk-appauth-android) wrapper library.

### Why Okta?

At Okta, our goal is to make [identity management](https://developer.okta.com/product/user-management/) a lot easier, more secure, and more scalable than what you're used to. Okta is a cloud service that allows developers to create, edit, and securely store user accounts and user account data, and connect them with one or multiple applications. Our API enables you to:

- [Authenticate](https://developer.okta.com/product/authentication/) and [authorize](https://developer.okta.com/product/authorization/) your users
- Store data about your users
- Perform password-based and [social login](https://developer.okta.com/authentication-guide/social-login/)
- Secure your application with [multi-factor authentication](https://developer.okta.com/use_cases/mfa/)
- And much more! Check out our [product documentation](https://developer.okta.com/documentation/)

Are you sold? [Register for a forever-free developer account](https://developer.okta.com/signup/), and when you're done, come on back so we can learn more about building secure mobile apps!

### Authentication in Java

Create a new Activity called `LoginActivity.java` and place it in the same folder as MainActivity.

```java
package com.example.karl.myapplication;

import android.app.Activity;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.util.Log;

import com.okta.appauth.android.OktaAppAuth;
import net.openid.appauth.AuthorizationException;

public class LoginActivity extends Activity {

    private OktaAppAuth mOktaAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mOktaAuth = OktaAppAuth.getInstance(this);

        // Do any of your own setup of the Activity

        mOktaAuth.init(
            this,
            new OktaAppAuth.OktaAuthListener() {
                @Override
                public void onSuccess() {
                    // Handle a successful initialization (e.g. display login button)
                }

                @Override
                public void onTokenFailure(@NonNull AuthorizationException ex) {
                    // Handle a failed initialization
                }
            }
        );
    }
}
```

This initializes the `OktaAppAuth` object and handles the Success or Failure conditions. Next, change `AndroidManifest.xml` to point to `LoginActivity` instead of `MainActivity`.

Now add the following to the `defaultConfig` section of `app/build.config`.

```
android.defaultConfig.manifestPlaceholders = [
            "appAuthRedirectScheme": "com.okta.example"
        ]
```

Finally, add the following to the same file's dependencies:

```
implementation 'com.okta.android:appauth-android:0.1.0'
```

That should build and deploy. You can use `logcat` to see what is happening in the background. Looking at the [source code for the main library class](https://github.com/okta/okta-sdk-appauth-android/blob/master/library/src/main/java/com/okta/appauth/android/OktaAppAuth.java) we see the tag we need to use is "OktaAppAuth".

{% img blog/build-android-app-without-ide/logcat-output.png alt:"Logcat output" width:"800" %}{: .center-image }

Right after trying to create the service we get a `Configuration was invalid` error. We need to connect our app to an Okta account.

### Connect to Okta for Authentication

Since you already have an [Okta developer account](https://developer.okta.com/signup/), you can move right on to configuration. From the developer console select the Applications tab and then New Application. Select Native and click next. The fields should auto-populate correctly. The most important part is the redirect URL. Click done.

On the Assignments tab, click the Assign dropdown and choose Assign to Groups. Click Assign next to the Everyone group. Now, anyone in your Okta organization will be able to authenticate to the application.

You now should have enough to populate `app/src/main/res/raw/okta_app_auth_config.json`.

```json
{
  "client_id": "{clientId}",
  "redirect_uri": "{redirectUriValue}",
  "scopes": ["openid", "profile", "offline_access"],
  "issuer_uri": "https://{yourOktaDomain}/oauth2/default"
}
```

Change the `appAuthRedirectScheme` field in `app/build.gradle` to the base of your redirect URI, e.g. `"appAuthRedirectScheme": "{yourOktaScheme}"`.

Configuration should now be complete! If you `gradlew installDebug` and do the logcat as before you should no longer be seeing the error when you open the app, and should see a message saying `Warming up browser instance for auth request`.

### Set Up Your Login Page

Let's add a button and progress bar to our login page. Create app/src/main/res/layout/activity_login.xml.

```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".LoginActivity">

    <LinearLayout
        android:layout_width="fill_parent"
        android:layout_height="fill_parent"
        android:orientation="vertical"
        android:gravity="center">

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_gravity="center"
                android:paddingBottom="8pt"
                android:text="Demo App"
                style="@style/Base.TextAppearance.AppCompat.Title"/>

            <ProgressBar
                    android:id="@+id/progress_bar"
                    style="@style/Widget.AppCompat.ProgressBar.Horizontal"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:indeterminate="true"/>

            <Button
                android:id="@+id/auth_button"
                style="@style/Widget.AppCompat.Button.Colored"
                android:text="Login"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_gravity="center"
                android:visibility="gone" />

    </LinearLayout>

</android.support.constraint.ConstraintLayout>
```

Initially the button is hidden. We'll show that (and hide the progress bar) once Okta has finished initializing. To do that put the following into the onSuccess() method in `LoginActivity.java`.

```java
    findViewById(R.id.auth_button).setVisibility(View.VISIBLE);
    findViewById(R.id.progress_bar).setVisibility(View.GONE);
```

Lastly, before the Okta init set the layout to the XML we just created.

```java
    setContentView(R.layout.activity_login);
```

When you `installDebug` and run the app you should see a title with a login button.

{% img blog/build-android-app-without-ide/main-screen-demo.png alt:"Main screen for Demo App" width:"400" %}{: .center-image }

### Wire Up Login

To capture the login details, i.e. username/password, we can use a default page. First create the landing page for when we are authorized in `AuthorizedActivity.java`:

```java
package com.example.karl.myapplication;

import android.content.Intent;
import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.view.View;

import com.okta.appauth.android.OktaAppAuth;
import static com.okta.appauth.android.OktaAppAuth.getInstance;
import net.openid.appauth.AuthorizationException;

public class AuthorizedActivity extends Activity {

    private OktaAppAuth mOktaAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mOktaAuth = getInstance(this);

        setContentView(R.layout.activity_authorized);

        Button button = (Button) findViewById(R.id.sign_out);
        button.setOnClickListener(new View.OnClickListener()
{
		@Override
		public void onClick(View v)
		{
			mOktaAuth.logout();

			Intent mainIntent = new Intent(v.getContext(), LoginActivity.class);
			mainIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
			startActivity(mainIntent);
			finish();
		}
	}
      );
    }
}
```

We attach a listener to the button logging us out and taking us back to the login page. Now in `activity_authorized.xml` put

```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".LoginActivity">

    <LinearLayout
        android:layout_width="fill_parent"
        android:layout_height="fill_parent"
        android:orientation="vertical"
        android:gravity="center">

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_gravity="center"
                android:paddingBottom="8pt"
                android:text="Authorized"
                style="@style/Base.TextAppearance.AppCompat.Title"/>

            <Button
                android:id="@+id/sign_out"
                style="@style/Widget.AppCompat.Button.Colored"
                android:text="Logout"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_gravity="center" />

    </LinearLayout>

</android.support.constraint.ConstraintLayout>
```

As with the login page it's just a title with a button. Wire up the login button in `LoginActivity.java` by placing the following at the end of the onCreate method.

```java
Button button = (Button) findViewById(R.id.auth_button);
button.setOnClickListener(new View.OnClickListener()
    {
        @Override
        public void onClick(View v)
        {
            Intent completionIntent = new Intent(v.getContext(), AuthorizedActivity.class);
            Intent cancelIntent = new Intent(v.getContext(), LoginActivity.class);

            cancelIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);

            mOktaAuth.login(
                v.getContext(),
                PendingIntent.getActivity(v.getContext(), 0, completionIntent, 0),
                PendingIntent.getActivity(v.getContext(), 0, cancelIntent, 0)
            );
        }
    }
);
```

Now when you click the Login button you should see an Okta login page asking for your details.

{% img blog/build-android-app-without-ide/okta-login-screen.png alt:"Okta login screen" width:"400" %}{: .center-image }

If you enter in user details which are correct for the Application we made previously (your Okta portal credentials should work) you are taken to an authorized page.

{% img blog/build-android-app-without-ide/authorized-screen.png alt:"Authorized screen" width:"400" %}{: .center-image }

Clicking the logout button should take you back to our first screen.

And that's it for authorization!

Most people think you need Android Studio to make an Android app. In this post, you shattered that notion and built an Android app from scratch. With some configuration and a little code, you integrated authentication into your app with the OktaAppAuth library. Then you created a view that only authenticated users can see. From here, you can build out the rest of your app safe in the knowledge that authentication is handled, thanks to Okta.

## Learn More about Java and Secure App Development

I hope you've enjoyed this tutorial on how to build a basic Android app without an IDE. You can find the example created in this tutorial on GitHub at https://github.com/oktadeveloper/okta-android-example

We've written some other cool Spring Boot and React tutorials, check them out if you're interested.

- [Add Authentication to Any Web Page in 10 Minutes](https://developer.okta.com/blog/2018/06/08/add-authentication-to-any-web-page-in-10-minutes)
- [Bootiful Development with Spring Boot and React](/blog/2017/12/06/bootiful-development-with-spring-boot-and-react)
- [Build a React Native Application and Authenticate with OAuth 2.0](/blog/2018/03/16/build-react-native-authentication-oauth-2)

If you have any questions, please don't hesitate to leave a comment below, or ask us on our [Okta Developer Forums](https://devforum.okta.com/). Follow us on Twitter [@oktadev](https://twitter.com/oktadev) if you want to see more tutorials like this one!
