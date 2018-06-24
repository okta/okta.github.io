---
layout: blog_post
title: "Build a Photo Gallery PWA with React, Spring Boot, and JHipster"
author: mraible
description: "This post shows you how to build a photo gallery progressive web app with Spring Boot, React, and JHipster 5. It uses OAuth's authorization code for for authorization and OIDC for authentication. It extracts EXIF metadata from images, and displays them on the UI in a flexible grid format like Flickr does."
tags: [spring-boot, react, pwa, jhipster, oauth, oidc, authorization code flow, photo gallery]
tweets:
- "Have you ever wanted to build a photo gallery app like Flickr with @springboot and @reactjs? You're in luck! This tutorial shows you how to do image upload, metadata parsing, and much more! #reactjs #springboot #jhipster"
- "We ❤️ Flickr! Don't you? Learn how to build a Flickr clone with @reactjs, @springboot, and @java_hipster! That expression on your face will go from 😳 to 😃 in 30 minutes!"
---

Angular can be a gateway drug for Java developers wanting to learn JavaScript. If you're an experienced Java developer that knows Angular, chances are you started with AngularJS. AngularJS has similar concepts to Java MVC frameworks, like controllers, services, and directives (which I believe are similar to JSP tags IMHO). If you're still doing Angular development, you probably learned TypeScript along the way. You like TypeScript because it has types like Java, and it's a pretty nice language too!

If you already know Angular, you might as well learn about React, it's main competitor. There's always going to be several ways to write web apps, and React provides a totally different way to do it, and you can use TypeScript with it too!

At its core, React is just a UI toolkit, ala GWT, but it has a _very_ healthy ecosystem around it that provides everything you need to build a kick-ass progressive web app (PWA). PWAs are cool because if they're done right, they can offer a native-like experience for your users, allowing them to install your app, and use it when its offline.

In this post, I'll show you how to build a secure PWA that uploads and processes images, displays them in a Flickr-like grid, and uses Spring Boot for its backend.

## Get Started with React and Spring Boot

One of the easiest way to get started with React is by using [Create React App](https://github.com/facebookincubator/create-react-app) (CRA). You install it locally, then run `create-react-app $projectName` to generate a skeleton React application with minimal dependencies. It uses webpack under-the-covers to build the project, launch a web server, and run its tests.

Spring Boot has a similar tool, called [Spring Initializr](https://start.spring.io). Spring Initializer is a bit different than CRA because its a website (and API) that you use to create applications with.

Both tools are worth looking into, and you can learn how to create a bootiful app with them by reading my [Bootiful Development with Spring Boot and React] tutorial.

Today, I'll show you how to build a CRUD app with React and Spring Boot. However, I'm going to cheat. Rather than building everything from scratch, I'm going to use [JHipster](https://www.jhipster.tech). JHipster is an application generator that originally only supported Angular and Spring Boot. In its version 5.0 release, it added support for React, along with a number of other features.

[tweet from jhipster about v5]

JHipster ships with a number of features that every application needs, including authentication/authorization, unit and end-to-end testing support, and tools to make it easy to deploy to the cloud.

## Get Started with JHipster 5

To get started with JHipster, you'll need to have an internet connect and [Node.js](https://nodejs.org/) installed. The project recommends you use the latest LTS (Long Term Support) version, which is 8.3.11 at the time of this writing. You can use npm, but JHipster will use [Yarn](https://yarnpkg.org/) if you have it installed. To run the app, you'll need to have [Java 8] installed. If you have Git installed, JHipster will auto-commit your project after creating it, and will allow you to upgrade between versions.

Run the following command to install JHipster:

```bash
npm i -g generator-jhipster@5.0.0
```

To create a photo gallery app with JHipster, create a directory, and run `jhipster` in it.

```bash
mkdir gallery
cd gallery
jhipster
```

JHipster asks many questions about the type of application you want to create and what technologies you’d like to include. The table below shows the choices you'll want to make:

| Question | Answer |
|---|---|
| Type of application? | `Monolithic application` |
| Name? | `gallery` |
| Java package name? | `com.okta.developer`  |
| Use the JHipster Registry? | `No` |
| Type of authentication? | `OAuth 2.0 / OIDC` |
| Type of database? | `SQL` |
| Production database? | `PostgreSQL` |
| Development database? | `H2 with disk-based persistence` |
| Use Spring cache? | `Yes, with Ehcache` |
| Use Hibernate 2nd level cache? | `Yes` |
| Maven or Gradle? | `Maven` |
| Other technologies? | `<blank>` |
| Client framework? | `React` |
| Enable SASS support? | `No` |
| Enable i18n? | `Yes` |
| Native language of application? | `English` |
| Additional languages? | `French` |
| Additional testing frameworks? | `Protractor` |
| Install other generators? | `No` |

After you've answered all these questions, JHipster will create a plethora of files in your current directory and run `yarn` (or `npm install`) to install all the dependencies specified in `package.json`.

### Verify Everything works with Protractor and Keycloak

When you choose OAuth 2.0 and OIDC for authentication, the users are stored outside of the application, rather than in it. This means you need to have an identity provider (IdP) that stores your users and allows your app to retrieve information about them. By default, JHipster ships with [Keycloak](https://keycloak.org) in a Docker container. A default set of users and groups is imported at startup, and it has a client registered for your JHipster app.

Here's what the `keycloak.yml` looks like in your app's `src/main/docker` directory:

```yaml
version: '2'
services:
  keycloak:
    image: jboss/keycloak:4.0.0.Final
    command: ["-b", "0.0.0.0", "-Dkeycloak.migration.action=import", "-Dkeycloak.migration.provider=dir", "-Dkeycloak.migration.dir=/opt/jboss/keycloak/realm-config", "-Dkeycloak.migration.strategy=OVERWRITE_EXISTING", "-Djboss.socket.binding.port-offset=1000"]
    volumes:
      - ./realm-config:/opt/jboss/keycloak/realm-config
    environment:
      - KEYCLOAK_USER=admin
      - KEYCLOAK_PASSWORD=admin
    ports:
      - 9080:9080
      - 9443:9443
      - 10990:10990
```

To start Keycloak, you'll need to have [Docker Compose](http://docker-compose.com/) installed. Then run the following command in a terminal window:

```bash
docker-compose -f src/main/docker/keycloak.yml up
```

You can verify everything works from the get go by starting the app in one terminal with Maven:

```bash
./mvnw
```

Then running all the Protractor tests:

```bash
yarn e2e
```

If your environment is setup correctly, you'll see output like the following:

```bash
yarn run v1.7.0
$ protractor src/test/javascript/protractor.conf.js
(node:97048) [DEP0022] DeprecationWarning: os.tmpDir() is deprecated. Use os.tmpdir() instead.
[15:36:33] W/configParser - pattern ./e2e/entities/**/*.spec.ts did not match any files.
[15:36:33] I/launcher - Running 1 instances of WebDriver
[15:36:33] I/direct - Using ChromeDriver directly...


  Account
    ✓ should fail to login with bad password
    ✓ should login with admin account (2720ms)

  Administration
    ✓ should load metrics
    ✓ should load health
    ✓ should load configuration
    ✓ should load audits
    ✓ should load logs


  7 passing (10s)

[15:36:45] I/launcher - 0 instance(s) of WebDriver still running
[15:36:45] I/launcher - chrome #01 passed
✨  Done in 13.67s.
```

### Enable User Registration in Keycloak

One of the features that seems to be missing when you use OIDC authentication with JHipster is user registration. If you use session or JWT authentication, there's a link on the homepage to signup. With OIDC, you need to enable it in your IdP. For Keycloak, you can do this by navigating to `http://localhost:9080/auth/` and click on **Administration Console**. Login with `admin/admin` and click on the **Login** tab. This screen allows you to enable forgot password, remember me, and verify by email as well.

{% img blog/react-photo-gallery-pwa/keycloak-registration.png alt:"Keycloak User Registration" width:"800" %}{: .center-image }

After enabling this setting, you'll see a **Register** link on Keycloak's login form.

{% img blog/react-photo-gallery-pwa/keycloak-login-with-registration.png alt:"Keycloak Login Form with Register link" width:"800" %}{: .center-image }

Keycloak doesn't allow you to configure a default group for new users, so even though you'll be able to login after registering, you won't be able to navigate to any JHipster screens. That's because JHipster expects users to have a `ROLE_USER` or `ROLE_ADMIN` group (or role) as part of their ID token claims.

// todo: Fact check statement ^^

### Saving User Data for JPA Relationships

One of the features I added to JHipster is what I like to call _save user snapshot_. When working with JPA, it's nice to be able to create relationships with JHipster's `User` entity. This allows you to say things like "this user owns this photo album" and limit access based on that information.

This feature is on by default and works as follows:

1. After logging in, a request is made to `/api/account`.
2. The `getAccount()` method in `AccountResource.java` is mapped to this endpoint, and it hands off to `UserService#getUserFromAuthentication()` to extract the user's details.
3. The `getUserFromAuthentication()` method extracts the user's details from Spring Security, maps the groups/roles in the ID token to authorities, and adds/updates the user in the database.

This feature allows you to create relationships will the `User` entity. The only downside is when you have entities with a user relationship, the dropdown to link them will only contain the users that have logged into your app.

## Change your Identity Provider to Okta

JHipster leverages Spring Security's OAuth support for configuring which IdP it should get user information from. When using Spring Security with Spring Boot, you can configure a lot of settings in properties files. Or you can override properties with environment variables.

To switch from Keycloak to Okta (or any other IdP), you can override the default properties for Spring Security OAuth. For Okta, create a `~/.okta.env` file with the following properties:

```bash
#!/bin/bash

export SECURITY_OAUTH2_CLIENT_ACCESS_TOKEN_URI="https://{yourOktaDomain}/oauth2/default/v1/token"
export SECURITY_OAUTH2_CLIENT_USER_AUTHORIZATION_URI="https://{yourOktaDomain}/oauth2/default/v1/authorize"
export SECURITY_OAUTH2_RESOURCE_USER_INFO_URI="https://{yourOktaDomain}/oauth2/default/v1/userinfo"
export SECURITY_OAUTH2_CLIENT_CLIENT_ID="{clientId}"
export SECURITY_OAUTH2_CLIENT_CLIENT_SECRET="{clientSecret}"
```

Of course, you’ll need to create a new OIDC client in Okta and fill in the variables before this works. Once you’ve done that, you can run the following command to set these environment variables.

```bash
source ~/.okta.env
```

Restart your app and *voila* - you’re now using Okta!

In case you don’t know how to set up an OIDC app on Okta, here’s a quick tutorial.

### Set Up an OIDC App on Okta

Log in to your Okta Developer account (or [sign up](https://developer.okta.com/signup/) if you don’t have an account) and navigate to **Applications** > **Add Application**. Click **Web** and click **Next**. Give the app a name you’ll remember, and specify `http://localhost:8080/login` as a Login Redirect URI. Click **Done** and copy the client ID and secret into your `src/main/resources/config/application.yml` file.

Create a `ROLE_ADMIN` and `ROLE_USER` group (**Users** > **Groups** > **Add Group**) and add users to them. You can use the account you signed up with, or create a new user (**Users** > **Add Person**). Navigate to **API** > **Authorization Servers**, click the one named **default** to edit it. Click the **Claims** tab and **Add Claim**. Name it "groups" or "roles", and include it in the ID Token. Set the value type to "Groups" and set the filter to be a Regex of `.*`.

### What is Okta?

In short, we make [identity management](https://developer.okta.com/product/user-management/) a lot easier, more secure, and more scalable than what you’re probably used to. Okta is a cloud service that allows developers to create, edit, and securely store user accounts and user account data, and connect them with one or multiple applications. Our API enables you to:

* [Authenticate](https://developer.okta.com/product/authentication/) and [authorize](https://developer.okta.com/product/authorization/) your users
* Store data about your users
* Perform password-based and [social login](https://developer.okta.com/authentication-guide/social-login/)
* Secure your application with [multi-factor authentication](https://developer.okta.com/use_cases/mfa/)
* And much more! Check out our [product documentation](https://developer.okta.com/documentation/)

Are you sold? [Register for a forever-free developer account](https://developer.okta.com/signup/), and when you’re done, come on back so we can learn more about building a React PWA with Spring Boot 2.0 and JHipster!

### Why Okta instead of Keycloak

// todo: because production - use reply tweet you sent

### Enable Self-Service Registration in Okta

To enable self-service registration in Okta, you'll need to navigate to the Classic UI from the Okta Developer Dashboard. There's a link to toggle between the two in the top left corner of your screen.

[screenshot of toggle link]

Then navigate to **Directory** > **Self-Registration** and click **Enable**. Set the default group to `ROLE_USER`, the **Redirect URI** to `http://localhost:8080`, and click **Done**.

// todo: confirm these steps ^^ and ask Nate about self-reg for all

**NOTE:** If you don't see self registration as an option under the Directory menu, contact developers@okta.com and ask them to enable self-registration for you.

[screenshot of self-registration settings]

### Okta Customization Options

In addition to allowing self-registration, Okta also allows you to customize the look and feel of its login screen, as well as use custom domains and emails. You can read more about this in our [Sign-In Widget's documentation].

You can also try customizing the widget in real-time using our handy dandy [name of live widget feature](url to live widget).

## Create Entities to allow CRUD on Your Photo Gallery

I've spent a lot of time talking about how to secure your application, now let's actually build it! JHipster has a JDL (JHipster Domain Language) feature that allows you to model the data in your app, and generate entities from it. You can use its [JDL Studio]() feature to do this online and save it locally once you've finished.

I created a data model for this app that has an `Album`, `Photo`, and `Tag` entities and setup relationships between them. Below is a screenshot of what it looks like in JDL Studio.

{% img blog/react-photo-gallery-pwa/photo-gallery-jdl-studio.png alt:"Photo Gallery JDL in JDL Studio" width:"800" %}{: .center-image }

For your convenience, you can copy the JDL below and save it in a `gallery.jh` file in the root directory of your project.

```
entity Album {
    title String required,
    description TextBlob,
    created Instant
}

entity Photo {
    title String required,
    description TextBlob,
    image ImageBlob required,
    height Integer,
    width Integer,
    taken Instant,
    uploaded Instant
}

entity Tag {
    name String required minlength(2)
}

relationship ManyToOne {
    Album{user(login)} to User,
    Photo{album(title)} to Album
}

relationship ManyToMany {
    Photo{tag(name)} to Tag{photo}
}

paginate Album with pagination
paginate Photo, Tag with infinite-scroll
```

You can generate entities and CRUD code (Java for Spring Boot; TypeScript and JSX for React) using the following command:

```bash
jhipster jdl-import gallery.jh
```

This process will create [Liquibase](liquibase) changelog files (to create your database tables), entities, repositories, Spring MVC controllers, and all the React code that's necessary to create, read, update, and delete your data objects. It'll even generate Jest unit tests and Protractor end-to-end tests!

After the process completes, you can restart your app (Ctrl+C the `./mvnw` process and restart it) and run `yarn e2e` again to confirm everything generated correctly.

By now, you can see that JHipster is pretty powerful. It recognized that you had an `image` property of `ImageBlob` type and automatically created the plumbing you need to upload and store images in your database! Huzzah!

## Add Image EXIF Processing in Your Spring Boot API

The `Photo` entity has a few properties that can be calculated by reading the EXIF (todo: define EXIF) data from the uploaded photo. How do you do that in Java?

Thankfully, Drew Noakes created a [metadata-extractor](https://github.com/drewnoakes/metadata-extractor) library to do just that. Add a dependency on Drew's library to your `pom.xml`:

```xml
<dependency>
    <groupId>com.drewnoakes</groupId>
    <artifactId>metadata-extractor</artifactId>
    <version>2.11.0</version>
</dependency>
```

Then modify the `PhotoResource#createPhoto()` method to set the metadata when an image is uploaded.

```java
import com.drew.imaging.ImageMetadataReader;
import com.drew.imaging.ImageProcessingException;
import com.drew.metadata.Metadata;
import com.drew.metadata.MetadataException;
import com.drew.metadata.exif.ExifSubIFDDirectory;
import com.drew.metadata.jpeg.JpegDirectory;

import javax.xml.bind.DatatypeConverter;
import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

import java.time.Instant;
import java.util.Date;

public class PhotoResource {
    ...

    public ResponseEntity<Photo> createPhoto(@Valid @RequestBody Photo photo) throws Exception {
        log.debug("REST request to save Photo : {}", photo);
        if (photo.getId() != null) {
            throw new BadRequestAlertException("A new photo cannot already have an ID", ENTITY_NAME, "idexists");
        }

        try {
            photo = setMetadata(photo);
        } catch (ImageProcessingException ipe) {
            log.error(ipe.getMessage());
        }

        Photo result = photoRepository.save(photo);
        return ResponseEntity.created(new URI("/api/photos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    private Photo setMetadata(Photo photo) throws ImageProcessingException, IOException, MetadataException {
        String str = DatatypeConverter.printBase64Binary(photo.getImage());
        byte[] data2 = DatatypeConverter.parseBase64Binary(str);
        InputStream inputStream = new ByteArrayInputStream(data2);
        BufferedInputStream bis = new BufferedInputStream(inputStream);
        Metadata metadata = ImageMetadataReader.readMetadata(bis);
        ExifSubIFDDirectory directory = metadata.getFirstDirectoryOfType(ExifSubIFDDirectory.class);

        if (directory != null) {
            Date date = directory.getDateDigitized();
            if (date != null) {
                photo.setTaken(date.toInstant());
            }
        }

        if (photo.getTaken() == null) {
            log.debug("Photo EXIF date digitized not available, setting taken on date to now...");
            photo.setTaken(Instant.now());
        }

        photo.setUploaded(Instant.now());

        JpegDirectory jpgDirectory = metadata.getFirstDirectoryOfType(JpegDirectory.class);
        if (jpgDirectory != null) {
            photo.setHeight(jpgDirectory.getImageHeight());
            photo.setWidth(jpgDirectory.getImageWidth());
        }

        return photo;
    }
    ...
}
```

Since you're extracting the information, you can remove the fields from the UI and tests so the user cannot set these values.

In `src/main/webapp/app/entities/photo/photo-update.tsx`, add `metadata` and `metadataRows` variables. Add logic that makes them hidden when adding a photo and read-only when updating one.

```ts
const { description, image, imageContentType } = photoEntity;

const metadata = (
  <div>
    <AvGroup>
      <Label id="heightLabel" for="height">
        <Translate contentKey="galleryApp.photo.height">Height</Translate>
      </Label>
      <AvField id="photo-height" type="number" className="form-control" name="height" readOnly />
    </AvGroup>
    <AvGroup>
      <Label id="widthLabel" for="width">
        <Translate contentKey="galleryApp.photo.width">Width</Translate>
      </Label>
      <AvField id="photo-width" type="number" className="form-control" name="width" readOnly />
    </AvGroup>
    <AvGroup>
      <Label id="takenLabel" for="taken">
        <Translate contentKey="galleryApp.photo.taken">Taken</Translate>
      </Label>
      <AvInput
        id="photo-taken"
        type="datetime-local"
        className="form-control"
        name="taken"
        readOnly
        value={isNew ? null : convertDateTimeFromServer(this.props.photoEntity.taken)}
      />
    </AvGroup>
    <AvGroup>
      <Label id="uploadedLabel" for="uploaded">
        <Translate contentKey="galleryApp.photo.uploaded">Uploaded</Translate>
      </Label>
      <AvInput
        id="photo-uploaded"
        type="datetime-local"
        className="form-control"
        name="uploaded"
        readOnly
        value={isNew ? null : convertDateTimeFromServer(this.props.photoEntity.uploaded)}
      />
    </AvGroup>
  </div>
);
const metadataRows = isNew ? '' : metadata;
```

Remove the JSX between the `image` property and `album` property and replace it with `{metadataRows}`.

```html
    <input id="file_image" type="file" onChange={this.onBlobChange(true, 'image')} accept="image/*" />
  </AvGroup>
</AvGroup>
{metadataRows}
<AvGroup>
  <Label for="album.title">
    <Translate contentKey="galleryApp.photo.album">Album</Translate>
  </Label>
```

In `src/test/javascript/e2e/entities/photo/photo.spec.ts`, remove the code that sets the data in these fields:

```js
photoUpdatePage.setHeightInput('5');
expect(await photoUpdatePage.getHeightInput()).to.eq('5');
photoUpdatePage.setWidthInput('5');
expect(await photoUpdatePage.getWidthInput()).to.eq('5');
photoUpdatePage.setTakenInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
expect(await photoUpdatePage.getTakenInput()).to.contain('2001-01-01T02:30');
photoUpdatePage.setUploadedInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
expect(await photoUpdatePage.getUploadedInput()).to.contain('2001-01-01T02:30');
```

You can also remove all the getters and setters for these fields in `src/test/javascript/e2e/entities/photo/photo-update.page-object.ts`:

```js
setHeightInput(height) {
  this.heightInput.sendKeys(height);
}

getHeightInput() {
  return this.heightInput.getAttribute('value');
}

setWidthInput(width) {
  this.widthInput.sendKeys(width);
}

getWidthInput() {
  return this.widthInput.getAttribute('value');
}

setTakenInput(taken) {
  this.takenInput.sendKeys(taken);
}

getTakenInput() {
  return this.takenInput.getAttribute('value');
}

setUploadedInput(uploaded) {
  this.uploadedInput.sendKeys(uploaded);
}

getUploadedInput() {
  return this.uploadedInput.getAttribute('value');
}
```

Stop your Maven process, run `yarn webpack:build`, start Maven again and then run `yarn e2e` to make sure everything still works. If you upload an image you took with your smart phone, the height, width, and taken values should all be populated. If they're not, chances are your image doesn't have the data in it.

// question: should I provide a link to my photos on Flickr since I know they'll work?

## Add React Photo Gallery to Your React PWA

You've added metadata extraction to your backend, but your photos still display in a list rather than in a grid like Flickr's. To fix that, you can use [Neptunian's]() [React Photo Gallery](https://github.com/neptunian/react-photo-gallery) component. Install it using Yarn:

```bash
yarn add react-photo-gallery@6.0.28
```

Or npm:

```bash
npm i --save-exact react-photo-gallery@6.0.28
```

**NOTE:** I first tried using [Leisan Kazberova's](https://www.linkedin.com/in/lkazberova/) [react-photo-feed](https://github.com/lkazberova/react-photo-feed), but found it caused compile errors after adding it to my project.

In `app/entities/photo/photo.tsx`, add an import for `Gallery`:

```ts
import Gallery from 'react-photo-gallery';
```

Then add a `photoSet` variable in the `render()` method, and the `<Gallery>` component right after the closing `</h2>`.

```ts
render() {
  const { photoList, match } = this.props;
  const photoSet = photoList.map((photo) => ({
    src: `data:${photo.imageContentType};base64,${photo.image}`,
    width: photo.height > photo.width ? 3 : photo.height === photo.width ? 1 : 4,
    height: photo.height > photo.width ? 4 : photo.height === photo.width ? 1 : 3
  }));

  return (
    <div>
      <h2 id="photo-heading">
        ...
      </h2>
      <Gallery photos={photoSet} />
      ...
  );
}
```

Since you just modified the front end code, you can run `yarn start` to start an instance of webpack-dev-server that proxies requests to the backend and restarts (using Browsersync) every time you change any React files.

Log in and navigate to **Entities** > **Photos** in the top nav bar. You should be able to upload photos and see the results in a nice grid at the top of the list.

{% img blog/react-photo-gallery-pwa/photo-gallery.png alt:"Gallery with Photos" width:"800" %}{: .center-image }

You can also add a "lightbox" feature to the grid so you can click on photos and zoom in. The [React Photo Gallery docs](https://neptunian.github.io/react-photo-gallery/) show how to do this. I've integrated it into the example for this post, but I won't show the code here for the sake of brevity. You can see the [final `photo.tsx` with Lightbox added on GitHub](https://github.com/oktadeveloper/okta-react-photo-gallery-example/blob/master/src/main/webapp/app/entities/photo/photo.tsx).

## Make Your React App into a PWA

To be a PWA requires three features:

1. Your app must be served over HTTPS
2. Your app must register a service worker so it can cache requests and work offline
3. Your app must have a webapp manifest with installation information and icons

For HTTPS, you can [set up a certificate for localhost](https://letsencrypt.org/docs/certificates-for-localhost/) or (even better), deploy it to production! Cloud providers like Heroku and Cloud Foundry will provide you with HTTPS out-of-the-box, but they won't _force_ HTTPS. To force HTTPS, open `src/main/java/com/okta/developer/config/SecurityConfiguration.java` and add a rule to force a secure channel when an `X-Forwarded-Proto` header is sent.

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http
        ...
    .and()
        .headers()
        .frameOptions()
        .disable()
    .and()
        .requiresChannel()
        .requestMatchers(r -> r.getHeader("X-Forwarded-Proto") != null)
        .requiresSecure()
    .and()
        .authorizeRequests()
        ...
}
```

The [workbox-webpack-plugin](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin) is configured already for generating a service worker, but it only works when running your app with a production profile. This is nice because it means your data isn't cached in the browser when you're developing.

To register a service worker, open `src/main/webapp/index.html` and uncomment the following block of code.

```html
<script>
    if ('serviceWorker' in navigator) {
         navigator.serviceWorker
            .register('./service-worker.js')
            .then(function() { console.log('Service Worker Registered'); });
    }
</script>
```

The final feature -- a webapp manifest -- is included at `src/main/webapp/manifest.webapp`. It defines an app name, colors, and icons. You might want to adjust these to fit your app.

## Deploy to Heroku

To deploy your app to Heroku, you'll first need to install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).

> If you don't have a Heroku account, go to [https://www.heroku.com/] and sign up. Don't worry, it's free and I think you'll love the experience.

Run `heroku login` to log in to your account, then start the deployment process with JHipster:

```
jhipster heroku
```

This will start the [Heroku sub-generator](https://www.jhipster.tech/heroku/) that asks you some questions about your app and where you want to deploy it. Then it'll allow you to choose between building locally or with Git on Heroku's servers. Choose Git so you don't have to upload a fat JAR, and the deployment process will begin.

If you have a stable and fast internet connection, your app should be live on the internet in about six minutes!

### Analyze Your PWA Score with Lighthouse

Looks great, eh?

## Learn More about React, Spring Boot, JHipster, and OAuth

- Bootiful React
- JHipster OIDC
- Aaron's Auth Code Flow
- JHipster React Docs
- JHipster microservices with OAuth