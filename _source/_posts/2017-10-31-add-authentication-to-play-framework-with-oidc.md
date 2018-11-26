---
layout: blog_post
title: 'Add Authentication to Play Framework with OIDC and Okta'
author: mraible
description: "Play Framework is a key component of Lightbend's Lagom microservices framework. This article shows you how to integrate play-pac4j and use its OIDC support to authenticate with Okta."
tags: [authentication, play, play framework, java, pac4j, play-pac4j, oidc, oauth]
---

I've fallen in love with Play Framework in the past, but then found a more attractive framework in Spring Boot. I fell in love partly because Play was new and sexy at the time, but also because it's "live reloading" of Java code was a killer feature I'd been looking for. When it added support for Scala in v2.0, I was very excited to learn Scala and discover the power of functional programming. Part of the reason I fell out of love with Play is that I fell *really hard* for Spring Boot. I'd used Spring for ten years before I found Spring Boot, so I knew how most things worked. With Play, I had to learn a lot of new things, and it was difficult to keep up.

I figured it'd be fun to revisit Play and see how easy it is to integrate a modern authentication mechanism like OpenID Connect. I'm happy to report it's *really* easy thanks to [pac4j](http://www.pac4j.org/) and its [play-pac4j](https://github.com/pac4j/play-pac4j) integration, so that's what you'll be building in this tutorial.

Play has continued to evolve over the past several years, becoming a [staple framework for services at LinkedIn](https://engineering.linkedin.com/play/play-framework-linkedin) and [increasing productivity at Verizon](https://twitter.com/marcospereira/status/921144001021071362). It's also a key component of Lightbend's microservices framework, [Lagom](https://www.lightbend.com/lagom-framework). However, it's popularity seemed to peak around the time I was learning it. The [tag trends from Stack Overflow provide some evidence](http://sotagtrends.com/?tags=[playframework-2.0,playframework]&relative=true) of this.

{% img blog/play-oidc-pac4j/stackoverflow-trends.png alt:"Stack Overflow Tag Trends" width:"600" %}{: .center-image }

## My Experiences with Play

I first started using the Play framework back in 2011, and have followed it ever since. I spoke about HTML5 with Play Scala, CoffeeScript, and Jade at Devoxx 2011. To create that presentation, I had to learn all these technologies. Not only did I learn them all, but I also created a "Play More" application that helped me figure out many issues with developing an HTML5-based mobile app along the way. You can see the presentation and demo video [on my website](http://raibledesigns.com/rd/entry/my_html5_with_play_scala).

In February 2012, I updated my app and presentation to cover [Play 2.0 and integrated Secure Socia](http://raibledesigns.com/rd/entry/secure_json_services_with_play). I ended up not upgrading to Play 2.0, but I did learn how to secure my REST API. In the summer of 2012, I finally got my app [upgraded to Play 2](http://raibledesigns.com/rd/entry/migrating_to_play_2_and) and was able to get the Secure Social Module for Play 2 integrated and running in 10 minutes.

I also created a Play vs. Grails Smackdown presentation with James Ward that summer. The [first time we delivered the talk was at ÜberConf](http://raibledesigns.com/rd/entry/play_vs_grails_smackdown_at). James and I did the talk many more times, including at JavaOne 2013 ([SlideShare](https://www.slideshare.net/mraible/play-framework-vs-grails-smackdown-javaone-2013), [YouTube](https://www.youtube.com/watch?v=Yn-0IuKQA7w)).

## Get Started with Play Framework

To get started with [Play](https://www.playframework.com/), there are a few different options. You can [download a starter project](https://playframework.com/download#starters), create a new application using SBT, or build from an [example project](https://playframework.com/download#examples). I decided to use SBT, so installed it using Homebrew.

```bash
brew install sbt
```

Of course, you can easily [install it on Windows and Linux](http://www.scala-sbt.org/release/docs/Setup.html) too.

Next, I ran the command to create a new Play app with Java. You can see I changed the default name and organization but kept the default versions.

```bash
sbt new playframework/play-java-seed.g8
Getting org.scala-sbt sbt 1.0.2 ...
downloading file:////Users/mraible/.sbt/preloaded/org.scala-sbt/sbt/1.0.2/jars/sbt.jar ...
    [SUCCESSFUL ] org.scala-sbt#sbt;1.0.2!sbt.jar (6ms)
...
[info] Loading settings from idea.sbt ...
[info] Loading global plugins from /Users/mraible/.sbt/1.0/plugins
[info] Set current project to mraible (in build file:/Users/mraible/)

This template generates a Play Java project

name [play-java-seed]: okta-play-oidc-example
organization [com.example]: com.okta.developer
scala_version [2.12.3]:
play_version [2.6.6]:
sbt_version [1.0.2]:

Template applied in ./okta-play-oidc-example
```

I proved everything worked by navigating into the project and running `sbt run`.

**NOTE:** This process can take a while to run the first time. On my super-beefy Mac Pro, it took 4m28s.

I opened my browser to http://localhost:9000 and was pleased to see everything worked!

{% img blog/play-oidc-pac4j/welcome-to-play.png alt:"Welcome to Play" width:"800" %}{: .center-image }

## Security Options for Play Framework

To figure out which security plugin I should use with Play, I [asked my network on Twitter](https://twitter.com/mraible/status/922142654007197696).

<div style="max-width: 500px; margin: 0 auto">
<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">This week, I hope to show how to integrate <a href="https://twitter.com/playframework?ref_src=twsrc%5Etfw">@playframework</a> with <a href="https://twitter.com/okta?ref_src=twsrc%5Etfw">@okta</a> for auth. Should I try to use securesocial, play-pac4j, or deadbolt?</p>&mdash; Matt Raible (@mraible) <a href="https://twitter.com/mraible/status/922142654007197696?ref_src=twsrc%5Etfw">October 22, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

From this conversation, I learned that [Play's built-in OAuth support](https://www.playframework.com/documentation/2.6.x/JavaOAuth) is only for OAuth 1.0. I also learned about [play-zhewbacca](https://github.com/zalando-stups/play-zhewbacca) and [Silhouette](https://www.silhouette.rocks/). Secure Social [hasn't been worked on for several months](https://github.com/jaliss/securesocial/commits/master), so I decided to pass on it. Silhouette has a pretty website and extensive documentation, but it's not compatible with Java. I wanted to write a Java app for this example.

I decided to try [play-pac4j](https://github.com/pac4j/play-pac4j). My reason was simple, I'm a [lazy developer](/blog/2017/09/14/lazy-developers-guide-to-auth-with-vue), and its README shows an OIDC example that looked easy enough to implement. Its [documentation](http://www.pac4j.org/docs/clients/openid-connect.html) confirmed it didn't require much.

```java
final OidcConfiguration oidcConfiguration = new OidcConfiguration();
oidcConfiguration.setClientId("343992089165-i1es0qvej18asl33mvlbeq750i3ko32k...");
oidcConfiguration.setSecret("unXK_RSCbCXLTic2JACTiAo9");
oidcConfiguration.setDiscoveryURI("https://accounts.google.com/.well-known/openid-configuration");
final OidcClient oidcClient = new OidcClient(oidcConfiguration);
oidcClient.addAuthorizationGenerator((ctx, profile) -> { profile.addRole("ROLE_ADMIN"); return profile; });
```

## Integrate pac4j into Play Java Seed

If you'd like to follow along, below are the steps I used to integrate pac4j into my project and authenticate against Okta. Thanks to [Jérôme LELEU](https://www.linkedin.com/in/jleleu/) for creating pac4j and writing a nice [play-pac4j-java-demo](https://github.com/pac4j/play-pac4j-java-demo) project. The code in this project was a goldmine of information.

**NOTE:** I used IntelliJ IDEA to write the code in this example and found its SBT/Play support to be excellent. I didn't even need to install any plugins because I already had the Scala plugin installed. Play has a [plethora of documentation](https://www.playframework.com/documentation/2.6.x/IDE) for Eclipse, IDEA, NetBeans, and Emacs.

Add pac4j dependencies to `build.sbt`:

```scala
val playPac4jVersion = "4.0.0"
val pac4jVersion = "2.1.0"
val playVersion = "2.6.6"

libraryDependencies ++= Seq(
  guice,
  ehcache,
  "org.pac4j" % "play-pac4j" % playPac4jVersion,
  "org.pac4j" % "pac4j-oidc" % pac4jVersion exclude("commons-io" , "commons-io"),
  "com.typesafe.play" % "play-cache_2.12" % playVersion,
  "commons-io" % "commons-io" % "2.4"
)
```

Create `app/modules/SecurityModule.java`. This class configures OIDC, sets up a secure `HttpActionAdapter`, and registers callback and logout controllers.

```java
package modules;

import com.google.inject.AbstractModule;
import com.typesafe.config.Config;
import controllers.SecureHttpActionAdapter;
import org.pac4j.core.authorization.authorizer.RequireAnyRoleAuthorizer;
import org.pac4j.core.client.Clients;
import org.pac4j.oidc.client.OidcClient;
import org.pac4j.oidc.config.OidcConfiguration;
import org.pac4j.play.CallbackController;
import org.pac4j.play.LogoutController;
import org.pac4j.play.store.PlayCacheSessionStore;
import org.pac4j.play.store.PlaySessionStore;
import play.Environment;

import java.util.List;

public class SecurityModule extends AbstractModule {

    private final Config configuration;

    public SecurityModule(final Environment environment, final Config configuration) {
        this.configuration = configuration;
    }

    @Override
    @SuppressWarnings("unchecked")
    protected void configure() {
        bind(PlaySessionStore.class).to(PlayCacheSessionStore.class);

        final OidcConfiguration oidcConfiguration = new OidcConfiguration();
        oidcConfiguration.setDiscoveryURI(configuration.getString("oidc.discoveryUri"));
        oidcConfiguration.setClientId(configuration.getString("oidc.clientId"));
        oidcConfiguration.setSecret(configuration.getString("oidc.clientSecret"));

        final OidcClient oidcClient = new OidcClient(oidcConfiguration);
        oidcClient.addAuthorizationGenerator((ctx, profile) -> {
            profile.addRole("ROLE_ADMIN");
            return profile;
        });

        final String baseUrl = configuration.getString("baseUrl");
        final Clients clients = new Clients(baseUrl + "/callback",  oidcClient);

        final org.pac4j.core.config.Config config = new org.pac4j.core.config.Config(clients);
        config.addAuthorizer("admin", new RequireAnyRoleAuthorizer<>("ROLE_ADMIN"));
        config.setHttpActionAdapter(new SecureHttpActionAdapter());
        bind(org.pac4j.core.config.Config.class).toInstance(config);

        // callback
        final CallbackController callbackController = new CallbackController();
        callbackController.setDefaultUrl("/");
        callbackController.setMultiProfile(true);
        bind(CallbackController.class).toInstance(callbackController);

        // logout
        final LogoutController logoutController = new LogoutController();
        logoutController.setDefaultUrl("/?defaulturlafterlogout");
        bind(LogoutController.class).toInstance(logoutController);
    }
}
```

Create `app/controllers/SecureHttpActionAdapter.java` to show unauthorized and forbidden messages when user's don't have access to an action.

```java
package controllers;

import org.pac4j.core.context.HttpConstants;
import org.pac4j.play.PlayWebContext;
import org.pac4j.play.http.DefaultHttpActionAdapter;
import play.mvc.Result;

import static play.mvc.Results.*;

public class SecureHttpActionAdapter extends DefaultHttpActionAdapter {

    @Override
    public Result adapt(int code, PlayWebContext context) {
        if (code == HttpConstants.UNAUTHORIZED) {
            return unauthorized(views.html.error401.render().toString()).as((HttpConstants.HTML_CONTENT_TYPE));
        } else if (code == HttpConstants.FORBIDDEN) {
            return forbidden(views.html.error403.render().toString()).as((HttpConstants.HTML_CONTENT_TYPE));
        } else {
            return super.adapt(code, context);
        }
    }
}
```

Create `app/views/error401.scala.html` to show the unauthorized message.

```html
<html>
    <body>
        <h1>Unauthorized</h1>
        <br />
        <a href="/">Home</a>
    </body>
</html>
```

And `app/views/error403.scala.html` to show the forbidden message.

```html
<html>
    <body>
        <h1>Forbidden</h1>
        <br />
        <a href="/">Home</a>
    </body>
</html>
```

In `app/controllers/HomeController.java` add a method that's secured by the OIDC client, a method to show the profile information returned from Okta (or any identity provider), and a method to get the profiles.

```java
package controllers;

import com.google.inject.Inject;
import org.pac4j.core.profile.CommonProfile;
import org.pac4j.core.profile.ProfileManager;
import org.pac4j.play.PlayWebContext;
import org.pac4j.play.java.Secure;
import org.pac4j.play.store.PlaySessionStore;
import play.mvc.*;

import java.util.List;

public class HomeController extends Controller {

    public Result index() {
        return ok(views.html.index.render());
    }

    @Secure(clients = "OidcClient")
    public Result oidcIndex() { return protectedIndexView(); }

    @Secure
    public Result protectedIndex() {
        return protectedIndexView();
    }

    private Result protectedIndexView() {
        return ok(views.html.protectedIndex.render(getProfiles()));
    }

    @Inject
    private PlaySessionStore playSessionStore;

    @SuppressWarnings("unchecked")
    private List<CommonProfile> getProfiles() {
        final PlayWebContext context = new PlayWebContext(ctx(), playSessionStore);
        final ProfileManager<CommonProfile> profileManager = new ProfileManager(context);
        return profileManager.getAll(true);
    }
}
```

Create `app/views/protectedIndex.scala.html` to display the profile information after logging in. You might notice that there are two links to log out, one that does a local logout and one that logs out from Okta as well.

```scala
@(profileList: java.util.List[org.pac4j.core.profile.CommonProfile])
@import scala.collection.JavaConverters._
@profiles() = { @profileList.toList }
<h1>Protected Area</h1>
<a href="..">Back</a>
<ul>
    <li><a href="/logout?url=/?forcepostlogouturl">Local logout</a></li>
    <li><a href="/centralLogout?url=http://localhost:9000/?forcepostlogouturlafteridp">Central logout</a></li>
</ul>

<p>
profiles: @profiles
</p>
```

Create `app/controllers/CentralLogoutController.java` to handle the central logout behavior.

```java
package controllers;

import com.typesafe.config.Config;
import javax.inject.Inject;
import org.pac4j.play.LogoutController;

public class CentralLogoutController extends LogoutController {

    @Inject
    public CentralLogoutController(Config config) {
        String baseUrl = config.getString("baseUrl");
        setDefaultUrl(baseUrl + "/?defaulturlafterlogoutafteridp");
        setLocalLogout(true);
        setCentralLogout(true);
        setLogoutUrlPattern(baseUrl + "/.*");
    }
}
```

**NOTE:** If you want to make it so central logout doesn't kill local log out, use `setLocalLogout(false);`.

Open `conf/routes` and add routes to the new methods you added, as well as pac4j's controllers.

```scala
GET     /                           controllers.HomeController.index
GET     /oidc/index.html            controllers.HomeController.oidcIndex()
GET     /protected/index.html       controllers.HomeController.protectedIndex()
GET     /callback                   @org.pac4j.play.CallbackController.callback()
POST    /callback                   @org.pac4j.play.CallbackController.callback()
GET     /logout                     @org.pac4j.play.LogoutController.logout()
GET     /centralLogout              controllers.CentralLogoutController.logout()
```

Add a link to invoke OIDC in `app/views/index.scala.html`.

```scala
@()

@main("Welcome to Play") {
  <h1>Welcome to Play!</h1>

  <a href="oidc/index.html">Protected URL by OIDC</a>
}
```

Finally, enable the `SecurityModule` and set the properties needed in it by modifying `conf/application.conf`.

```scala
play {
  modules {
    enabled += modules.SecurityModule
  }
}

baseUrl = "http://localhost:9000"

oidc.discoveryUri = "https://{yourOktaDomain}/oauth2/default/.well-known/openid-configuration"
oidc.clientId = "{clientId}"
oidc.clientSecret = "{clientSecret}"
```

You'll need to create an OIDC App in Okta to get a `{clientId}` and `{clientSecret}`.

## Create an OIDC App in Okta

Log in to your Okta Developer account (or [sign up](https://developer.okta.com/signup/) if you don't have an account) and navigate to **Applications** > **Add Application**. Click **Web** and then click **Next**. Give the app a name you'll remember, specify `http://localhost:9000` as a Base URI, as well as the following values. Note that you won't be able to enter a Logout redirect URI until after you've clicked the **Done** button.

 * Login redirect URIs: `http://localhost:9000/callback?client_name=OidcClient`
 * Logout redirect URIs: `http://localhost:9000/?forcepostlogouturlafteridp`

Copy the client ID and secret into your `application.conf` file. While you're in there, modify the `oidc.discoveryUri` to match your Okta domain. For example:

```properties
oidc.discoveryUri = "https://{yourOktaDomain}/oauth2/default/.well-known/openid-configuration"
```

After making these changes, you should be able to refresh your browser and log in. Play handles recompiling any new/changed files when you reload – a very slick feature!

{% img blog/play-oidc-pac4j/play-with-oidc-link.png alt:"Play with OIDC Link" width:"800" %}{: .center-image }

{% img blog/play-oidc-pac4j/okta-login.png alt:"Okta Login" width:"800" %}{: .center-image }

{% img blog/play-oidc-pac4j/oidc-profiles.png alt:"Profiles after login" width:"800" %}{: .center-image }

You might notice (in the bottom right corner) that roles are set to `ROLE_ADMIN`. This value is hardcoded in `SecurityModule`. In the following section, I'll show you how to map Okta groups to roles.

## Mapping Okta Groups to Roles

You can create groups and include them as claims. For example, create a `ROLE_ADMIN` and `ROLE_USER` group (**Users** > **Groups** > **Add Group**) and add users to them. You can use the account you signed up with, or create a new user (**Users** > **Add Person**).

Navigate to **API** > **Authorization Servers**, click the **Authorization Servers** tab and edit the `default` one. Click the **Claims** tab and **Add Claim**. Name it "groups" or "roles", and include it in the ID Token. Set the value type to "Groups" and set the filter to be a Regex of `.*`.

{% img blog/play-oidc-pac4j/add-groups-claim.png alt:"Add groups claim" width:"600" %}{: .center-image }

After adding the `groups` claim, you can modify `SecurityModule.java` to use it for the roles.

```java
oidcClient.addAuthorizationGenerator((ctx, profile) -> {
    profile.addRoles((List) profile.getAttribute("groups"));
    return profile;
});
```

Or you can make this logic more robust so it only adds roles from groups that begin with `ROLE_`.

```java
import java.util.Set;
import java.util.stream.Collectors;

oidcClient.addAuthorizationGenerator((ctx, profile) -> {
    if (profile.getAttribute("groups") != null) {
        List<String> groups = (List) profile.getAttribute("groups");
        Set<String> filteredGroups = groups.stream()
                .filter(group -> group.startsWith("ROLE_"))
                .collect(Collectors.toSet());
        profile.addRoles(filteredGroups);
    }
    return profile;
});
```

After integrating groups with roles, logging in with a user that belongs to both groups will show up with these roles.

{% img blog/play-oidc-pac4j/roles-from-okta.png alt:"Roles from Okta" width:"800" %}{: .center-image }

## Source Code

You can see the full source code for the application developed in this tutorial [on GitHub](https://github.com/oktadeveloper/okta-play-oidc-example).

## Have Fun Playing With Play!

I hope you've enjoyed this quick tutorial on how to add authentication with OIDC and play-pac4j to your Play application. I was tempted to look at other solutions, and even try Silhouette + Scala, but pac4j made it pretty easy to accomplish my goal.

If you have a similar tutorial on using Silhouette or another OIDC library for Play, I'd love to hear about it. Bonus points if it integrates with Okta or Keycloak. You can find me on Twitter [@mraible](https://twitter.com/mraible).

If you're a Java dev who's interested in reading more about integrating Okta, I'd love to have you check out these resources:

* [My recent post on using OIDC support with JHipster](/blog/2017/10/20/oidc-with-jhipster)
* [Micah Silverman's recent post on RBAC with Thymeleaf and Spring Security](/blog/2017/10/13/okta-groups-spring-security)
* [Identity, Claims, & Tokens – An OpenID Connect Primer, Part 1 of 3](/blog/2017/07/25/oidc-primer-part-1)

And finally, I'd love to have you follow our whole team on Twitter for more awesome content. Check us out [@oktadev](https://twitter.com/OktaDev)!

