---
layout: blog_post
title: "Let's Compare: JAX-RS vs Spring for REST Endpoints"
author: bdemers
tags: [spring, jaxrs, java, rest, stormtrooper]
---

Need to decouple your web service and client? You're probably using REST endpoints, and if you're a Java shop you've probably tried out JAX-RS, Spring REST, or both. But is one better than the other? In this post I'll go over the the differences between the two using basically the same code for an apples to apples comparison. In future posts I'll show you how easy it is to secure these REST endpoints using Apache Shiro and Okta.

## Lay Down the Foundation – Model and DAO

To keep things focused, I'll leave the Maven dependencies out of this post. You can browse the full source on [Github](http://github.com/oktadeveloper/jaxrs-spring-blog-example), the pom files should be self explanatory: one for JAX-RS, another for Spring.

First up, we need to get the common bits out of the way. A simple model and DAO (Data Access Object) will be used in all of the examples to register and manage `Stormtrooper` objects.

```java
public class Stormtrooper {

    private String id;
    private String planetOfOrigin;
    private String species;
    private String type;

    public Stormtrooper() {
        // empty to allow for bean access
    }

    public Stormtrooper(String id, String planetOfOrigin, String species, String type) {
        this.id = id;
        this.planetOfOrigin = planetOfOrigin;
        this.species = species;
        this.type = type;
    }

    ...
    // bean accessor methods
```

The `Stormtrooper` object contains an `id` and a few other attributes: `planetOfOrigin`, `species`, and `type`.

The DAO interface is just as simple, with the basic CRUD methods and an additional `list` method:

```java
public interface StormtrooperDao {

    Stormtrooper getStormtrooper(String id);

    Stormtrooper addStormtrooper(Stormtrooper stormtrooper);

    Stormtrooper updateStormtrooper(String id, Stormtrooper stormtrooper);

    boolean deleteStormtrooper(String id);

    Collection<Stormtrooper> listStormtroopers();
}
```

The actual implementation of the `StormtrooperDao` is not important for these examples, If you are interested, you can take a look at code for [`DefaultStormtrooperDao`](https://github.com/oktadeveloper/jaxrs-spring-blog-example/blob/master/common/src/main/java/com/okta/example/common/dao/DefaultStormtrooperDao.java), which generates 50 random Stormtroopers.

## Try Spring

Now that we have the common bits out of the way, we can get into the meat of our Spring example. A basic Spring Boot app doesn't get much easier than this:

```java
@SpringBootApplication
public class SpringBootApp {

    @Bean
    protected StormtrooperDao stormtrooperDao() {
        return new DefaultStormtrooperDao();
    }

    public static void main(String[] args) {
        SpringApplication.run(SpringBootApp.class, args);
    }
}
```

There are a few things to point out:

- The `@SpringBootApplication` annotation sets up Spring's auto configuration and classpath scanning of components
- `@Bean` binds an instance of `DefaultStormtrooperDao` to the `StormtrooperDao` interface
- The `main` method starts the application uses the `SpringApplication.run()` helper method to bootstrap the application

### Spring Controller

Next up, we have the implementation of our REST endpoint, or in the Spring world a `Controller`. We will use this class to map our DAO to incoming HTTP requests.

```java
@RestController
@RequestMapping("/troopers")
public class StormtrooperController {

    private final StormtrooperDao trooperDao;

    @Autowired
    public StormtrooperController(StormtrooperDao trooperDao) {
        this.trooperDao = trooperDao;
    }

    @GetMapping
    public Collection<Stormtrooper> listTroopers() {
        return trooperDao.listStormtroopers();
    }

    @GetMapping("/{id}")
    public Stormtrooper getTrooper(@PathVariable("id") String id) throws NotFoundException {

        Stormtrooper stormtrooper = trooperDao.getStormtrooper(id);
        if (stormtrooper == null) {
            throw new NotFoundException();
        }
        return stormtrooper;
    }

    @PostMapping
    public Stormtrooper createTrooper(@RequestBody Stormtrooper trooper) {
        return trooperDao.addStormtrooper(trooper);
    }

    @PostMapping("/{id}")
    public Stormtrooper updateTrooper(@PathVariable("id") String id,
                                      @RequestBody Stormtrooper updatedTrooper) throws NotFoundException {
        return trooperDao.updateStormtrooper(id, updatedTrooper);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    public void deleteTrooper(@PathVariable("id") String id) {
        trooperDao.deleteStormtrooper(id);
    }
}
```

Let's break this down:

```java
@Controller
@RequestMapping("/troopers")
public class StormtroooperController {
```

The `@RestController` is a convenience annotation for both `@Controller` and `@ResponseBody` which marks this class as a web component discovered during classpath scanning. An `@RequestMapping` annotation at the the class level defines the base path mapping used for any other `RequestMapping` annotations in this class. In this case, all end points in this class will start with the URL path `/troopers`.

```java
@PostMapping("/{id}")
public @ResponseBody Stormtrooper updateTrooper(@PathVariable("id") String id,
                                                @RequestBody Stormtrooper updatedTrooper) throws NotFoundException {
    return trooperDao.updateStormtrooper(id, updatedTrooper);
}
```

The `PostMapping` is an POST alias for the `@RequestMapping` annotation which has [many options](http://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/bind/annotation/RequestMapping.html), this example uses a small subset:

- `path = "/{id}"` used in conjunction with `@PathVariable("id")` maps the `{id}` part of the URL path to the given method argument - Example URL: `/troopers/FN-2187`
- `value = HttpStatus.NO_CONTENT` sets the expected HTTP response code, in this case a 204

Method parameters annotated with `@RequestBody` will be deserialize from the HTTP request before getting passed into the method. Return values are directly serialized to HTTP response using the `@ResponseBody` annotation (or simply by using `@RestController`), which will also bypass any MCV templates.

In this code block the `updateTrooper()` method accepts HTTP `POST` requests made to `/trooper/{id}` and contain a serialized `Stormtrooper` (JSON). If the request path was `/troopers/FN-2187`, the `id` portion of the path would be assigned to the method's `id` parameter. An updated `Stormtrooper` object is returned and serialized to the HTTP response.

In the example above we are simply using a `POST` for both the create and update methods. To keep the example short and sweet, the DAO implementation doesn't actually do partial updates, so this should actually be a `PUT`. Take a look at this blog post to read more about when to use [PUT vs POST](https://stormpath.com/blog/put-or-post).
### Run the Spring Example

To run this example, grab the [source](https://github.com/oktadeveloper/jaxrs-spring-blog-example), change to the `spring-boot` directory, start the application using `mvn spring-boot:run`, make requests to the server.

To get get a list of all the Stormtroopers just make a request to `/troopers`
```bash
$ curl http://localhost:8080/troopers

HTTP/1.1 200
Content-Type: application/json;charset=UTF-8
Date: Tue, 08 Nov 2016 20:33:36 GMT
Transfer-Encoding: chunked
X-Application-Context: application

[
    {
        "id": "FN-2187",
        "planetOfOrigin": "Unknown",
        "species": "Human",
        "type": "Basic"
    },
    {
        "id": "FN-0984",
        "planetOfOrigin": "Coruscant",
        "species": "Human",
        "type": "Aquatic"
    },
    {
        "id": "FN-1253",
        "planetOfOrigin": "Tatooine",
        "species": "Unidentified",
        "type": "Sand"
    },
    ...
]
```

To get a single Stormtrooper, use it's ID:

```bash
$ curl http://localhost:8080/troopers/FN-2187

HTTP/1.1 200
Content-Type: application/json;charset=UTF-8
Date: Tue, 08 Nov 2016 20:38:53 GMT
Transfer-Encoding: chunked
X-Application-Context: application

{
    "id": "FN-2187",
    "planetOfOrigin": "Unknown",
    "species": "Human",
    "type": "Basic"
}
```

Pretty easy, right? Now you can stop the server with a `Ctrl-C` and move on to the next example.

## Rinse and Repeat – JAX-RS

We'll use the same model and DAO for the JAX-RS example, all we're going to change is the annotations on the `StormtroooperController` class.

Since JAX-RS is an API spec you need to pick an implementation, we will use [Jersey](https://jersey.java.net/) for this example. While it's possible to create a JAX-RS application with no direct dependencies on a specific JAX-RS implementation, it would make for a more verbose example.

I picked Jersey for a couple reasons, mostly though it was because I already knew how get simple dependency injection working without jumping through any hoops, we are comparing this to Spring after all. Apache Shiro has an [example](https://github.com/apache/shiro/blob/master/samples/jaxrs/) that runs the same code on [Jersey](https://jersey.java.net/), [RestEasy](http://resteasy.jboss.org/), and [Apache CXF](https://cxf.apache.org/), if you're interested in seeing a portable example.

This example also differs a bit from the Spring Boot one in that this example is packaged as a WAR, and Spring Boot was a single JAR. Packing this example in an executable jar is possible, but outside the scope of this post

A JAX-RS equivalent to a `SpringBootApplication` is an `Application` class. A Jersey subclass of `Application`, `ResourceConfig`, adds a few handy utility methods. The following snippet configures classpath scanning to detect our individual resource classes, and bind a `DefaultStormtrooperDao` instance to the `StromtrooperDao` interface.

```java
@ApplicationPath("/")
public class JaxrsApp extends ResourceConfig {

    public JaxrsApp() {

        // scan the resources package for our resources
        packages(getClass().getPackage().getName() + ".resources");

        // use @Inject to bind the StormtrooperDao
        register(new AbstractBinder() {
            @Override
            protected void configure() {
                bind(stormtrooperDao()).to(StormtrooperDao.class);
            }
        });
    }

    private StormtrooperDao stormtrooperDao() {
        return new DefaultStormtrooperDao();
    }
}
```

One other thing to point out, in the above class the `@ApplicationPath` annotation marks this class as a JAX-RS Application bound to a specific url path, in our case to match the Spring example above we will just use the root path: `/`. Each resource detected in the `resources` package will be appended to this base path.

The JAX-RS resource implementation looks very similar to the Spring version above (renamed to `StormtroooperResource`, to match naming conventions):

```java
@Path("/troopers")
@Produces("application/json")
public class StormtroooperResource {

    @Inject
    private StormtrooperDao trooperDao;

    @Path("/{id}")
    @GET
    public Stormtrooper getTrooper(@PathParam("id") String id) throws NotFoundException {

        Stormtrooper stormtrooper = trooperDao.getStormtrooper(id);
        if (stormtrooper == null) {
            throw new NotFoundException();
        }
        return stormtrooper;
    }

    @POST
    public Stormtrooper createTrooper(Stormtrooper trooper) {
        return trooperDao.addStormtrooper(trooper);
    }

    @Path("/{id}")
    @POST
    public Stormtrooper updateTrooper(@PathParam("id") String id,
                                      Stormtrooper updatedTrooper) throws NotFoundException {
        return trooperDao.updateStormtrooper(id, updatedTrooper);
    }

    @Path("/{id}")
    @DELETE
    public void deleteTrooper(@PathParam("id") String id) {
        trooperDao.deleteStormtrooper(id);
    }

    @GET
    public Collection<Stormtrooper> listTroopers() {
        return trooperDao.listStormtroopers();
    }
}
```

To break down this example a bit, we first have the class deceleration:

```java
@Path("/troopers")
@Produces("application/json")
public class StormtroooperResource {
```

Similar to the Spring example above the `@Path` at the class level means each annotated method in this class will be under the `/troopers` base path. The `@Produces` annotation defines the default response content type (unless overridden by an annotation on another method).

Unlike the Spring example where a `@RequestMapping` annotation defined the path, method, and other attributes of the request, in a JAX-RS resource each attribute uses a separate annotation. Similar to above if we break down the `updateTrooper()` method:

```java
@Path("/{id}")
@POST
public Stormtrooper updateTrooper(@PathParam("id") String id,
                                  Stormtrooper updatedTrooper) throws NotFoundException {
    return trooperDao.updateStormtrooper(id, updatedTrooper);
}
```

We see that `@Path("/{id}")` along with `@PathParam("id")` allows the `id` portion of the path to be translated into a method argument. What differs from the Spring example, is that the `Stromtrooper` parameter and return value do not need extra annotations, they are automatically serialized/deserialized into JSON due to the `@Produces("application/json")` annotation on this class.

### Run the JAX-RS Example

This example can be started from the `jersey` directory, using the maven command: `mvn jetty:run`.

Making the same two requests as above, we can list all of the troopers with a `GET` request to the base resource:

```bash
$ curl http://localhost:8080/troopers

HTTP/1.1 200 OK
Content-Length: 3944
Content-Type: application/json
Date: Tue, 08 Nov 2016 21:57:55 GMT
Server: Jetty(9.3.12.v20160915)

[
    {
        "id": "FN-2187",
        "planetOfOrigin": "Unknown",
        "species": "Human",
        "type": "Basic"
    },
    {
        "id": "FN-0064",
        "planetOfOrigin": "Naboo",
        "species": "Nikto",
        "type": "Sand"
    },
    {
        "id": "FN-0069",
        "planetOfOrigin": "Hoth",
        "species": "Twi'lek",
        "type": "Basic"
    },
    {
        "id": "FN-0169",
        "planetOfOrigin": "Felucia",
        "species": "Kel Dor",
        "type": "Jump"
    },

    ...

```

Or again to a `GET` to a specific resource:

```bash
$ curl http://localhost:8080/troopers/FN-2187

HTTP/1.1 200 OK
Content-Length: 81
Content-Type: application/json
Date: Tue, 08 Nov 2016 22:00:02 GMT
Server: Jetty(9.3.12.v20160915)

{
    "id": "FN-2187",
    "planetOfOrigin": "Unknown",
    "species": "Human",
    "type": "Basic"
}
```

Now we have seen basically the same code run in both Spring and JAX-RS applications by simply changing the annotations. I like the JAX-RS annotations better, they're more concise. That said, why choose between the two? Jersey and RestEasy both support Spring (along with Guice and CDI/Weld). Let's create a third example combining the two

## JAX-RS and Spring – So Happy Together

For this example we need three classes: a Spring Boot application, Jersey configuration, and our resource.

Our `SpringBootApp` and `StormtrooperResource` classes are identical to the previous versions, the only difference being the Jersey configuration class:

```java
@Component
public class JerseyConfig extends ResourceConfig {

    public JerseyConfig() {

        // scan the resources package for our resources
        packages(getClass().getPackage().getName() + ".resources");
    }
}
```

This class is a bit slimmer than the previous example. First, you probably noticed the `@Configuration` annotation which is used to mark this class managed by Spring. All that is left, is to instruct Jersey to scan the `resources` package again, the rest is handled for you (see what I did there?!).

From the `spring-jaxrs` directory, this example can be started with the same `mvn spring-boot:run` command.

## Spring to JAX-RS Cheat Sheet

To help you navigate between the world of Spring and JAX-RS here is a quick cheat sheet.  This is not an exhaustive list, but it does include the most common annotations.

| Spring Annotation | JAX-RS Annotation |
|-------------------|-------------------|
| @RequestMapping(path = "/troopers" | @Path("/troopers") |
| @PostMapping | @POST |
| @PutMapping | @PUT |
| @GetMapping | @GET |
| @DeleteMapping | @DELETE |
| @ResponseBody | N/A |
| @RequestBody | N/A |
| @PathVariable("id") | @PathParam("id") |
| @RequestParam("xyz") | @QueryParam('xyz") |
| @RequestParam(value="xyz") | @FormParam("xyz") |
| @RequestMapping(produces = {"application/json"}) | @Produces("application/json") |
| @RequestMapping(consumes = {"application/json"}) | @Consumes("application/json") |

## When Should You Use JAX-RS over Spring Rest?

In my opinion it breaks down like this:

If you're already a Spring shop, just use Spring. If you're creating an object JSON / XML REST layer, JAX-RS resources backed by the DI framework of your choice (Spring, Guice, etc.) might be the way to go. Rendering pages server side is not part of the JAX-RS spec (though it is supported with extensions). I hacked up a [Thymeleaf](http://www.thymeleaf.org/) view for Jersey once, but I think Spring MVC takes the cake here.

Now, comparing a Spring Boot application and an WAR packaged application, isn't exactly comparing apples to apples. Dropwizard (which uses an embedded Jetty container and Jersey) is probably the closest thing to a Spring Boot app. Hopefully this post gave you a bit more background so you can do your own comparison. If you have any questions hit me up on Twitter [@briandemers](https://twitter.com/briandemers)!

Want to learn more about securing your Spring or JAX-RS applications, Apache Shiro, or REST fundamentals? Take a look at these posts:

- [Protecting a Spring Boot App with Apache Shiro](https://developer.okta.com/blog/2017/07/13/apache-shiro-spring-boot)
- [Protecting JAX-RS Resources with RBAC and Apache Shiro](https://stormpath.com/blog/protecting-jax-rs-resources-rbac-apache-shiro)
- [The Fundamentals of REST API Design](https://stormpath.com/blog/fundamentals-rest-api-design)
