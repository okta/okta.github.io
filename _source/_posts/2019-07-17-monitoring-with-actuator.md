---
layout: blog_post
title: "Monitor Your Java Apps with Spring Boot Actuator"
author: jimena-garbarino
description: "Spring Boot Actuator provides out-of-the-box monitoring for your app. It's also easily extended for new functionailty."
tags: [spring boot, actuator, openid connect, oidc]
tweets:
- ""
- ""
- ""
image: blog/featured/okta-java-skew.jpg
---

Have you worked with Spring Boot Actuator yet? It's an immensely helpful library that helps you monitor app health and interactions with the app - perfect for going to production! Spring Boot Actuator includes a built-in endpoint for tracing HTTP calls to your application - very useful for monitoring OpenID Connect (OIDC) requests - but unfortunately the default implementation does not trace body contents. In this post, I'll show you how to extend the httptrace endpoint for capturing contents and tracing the OIDC flow.

Let's get started!

## Create an OpenID Connect App with Spring Initializr and Okta

You can use the excellent [**Spring Initializr**](https://start.spring.io/) website or API for creating a sample OIDC application with Okta integration:

```
curl https://start.spring.io/starter.zip \
  dependencies==web,okta \
  packageName==com.okta.developer.demo -d
```

Before running your OIDC application however, you will need an Okta account. Okta is a developer service that handles storing user accounts and implementing user management (including OIDC) for you. Go ahead and register for a [**free developer account**](https://developer.okta.com/signup/) to continue.

Once you login to your Okta account, go to the Dashboard and then to the **Applications** section. Add a new Web application, and then in the General section get the client credentials: **Client ID** and **Client Secret**. 

You will need the **Issuer** which is the organization URL as well, which you can find at the top right corner in the Dashboard home. **Note**: By default, the built-in `Everyone` Okta group is assigned to this application, so any users in your Okta org will be able to authenticate to it.

With your Client ID, Client Secret. and the Issuer in place, start your application by passing the credentials through the command line:

```
OKTA_OAUTH2_REDIRECTURI=/authorization-code/callback \
OKTA_OAUTH2_ISSUER=<issuer>/oauth2 \
OKTA_OAUTH2_CLIENT_ID=<client id> \
OKTA_OAUTH2_CLIENT_SECRET=<client secret> \
./mvnw spring-boot:run
```

## Add Test Controller to the Spring Boot App

It's a good practice to add a simple controller for testing the authentication flow. By default, access will only be allowed to authenticated users.

```Java
@Controller
@RequestMapping(value = "/hello")
public class HelloController {

    @GetMapping(value = "/greeting")
    @ResponseBody
    public String getGreeting(Principal user) {
        return "Good morning " + user.getName();
    }
}
```

You can test this out by restarting the app and browsing to [**/hello/greeting**](http://localhost:8080/hello/greeting)

## Add Spring Boot Actuator Dependency

Enable Spring Boot Actuator by adding the starter Maven dependency to the `pom.xml file`:

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

To enable the httptrace endpoint, edit the `src/main/resources/application.properties` and add the following line:

```
management.endpoints.web.exposure.include=info,health,httptrace
```

You can test the out-of-the-box actuator features running the application browsing to [**/hello/greeting**](http://localhost:8080/hello/greeting), and logging in.


> Under the auto-configuration, Spring Security filters have higher precedence than filters added by the httptrace actuator.

This means only authenticated calls are traced by default. We are going to change that here soon, but for now, you can see what is traced at [**/actuator/httptrace**](http://localhost:8080/actuator/httptrace). The response should look like this JSON payload:

```json
{
   "traces":[
      {
         "timestamp":"2019-05-19T05:38:42.726Z",
         "principal":{
            "name":"***"
         },
         "session":{
            "id":"***"
         },
         "request":{
            "method":"GET",
            "uri":"http://localhost:8080/",
            "headers":{},
            "remoteAddress":"0:0:0:0:0:0:0:1"
         },
         "response":{
            "status":200,
            "headers":{}
         },
         "timeTaken":145
      }
   ]
}
```

## Add Custom HTTP Tracing to your Spring Boot App

> HTTP tracing is not very flexible. Andy Wilkinson, the author of the httptrace actuator, suggests [**implementing your own endpoint**](https://github.com/spring-projects/spring-boot/issues/12953) if body tracing is required.

Alternatively, with some custom filters, we can enhance the base implementation without much work. In the following sections I'll show you how to:

* Create a filter for capturing request and response body
* Configure the filters precedence for tracing OIDC calls
* Create the httptrace endpoint extension with a custom trace repository to store additional data

## Use Spring Boot Actuator to Capture Request and Response Body Contents

Next, create a filter for tracing the request and response body contents. This filter will have precedence over the httptrace filter, so the cached body contents are available when the actuator saves the trace.

```Java
@Component
@ConditionalOnProperty(prefix = "management.trace.http", name = "enabled", matchIfMissing = true)
public class ContentTraceFilter extends OncePerRequestFilter {


    private ContentTraceManager traceManager;

    @Value("${management.trace.http.tracebody:false}")
    private boolean traceBody;

   public ContentTraceFilter(ContentTraceManager traceManager) {
        super();
        this.traceManager = traceManager;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if (!isRequestValid(request) || !traceBody) {
            filterChain.doFilter(request, response);
            return;
        }

        ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(
                request, 1000);
        ContentCachingResponseWrapper wrappedResponse = new ContentCachingResponseWrapper(
                response);
        try {
            filterChain.doFilter(wrappedRequest, wrappedResponse);
            traceManager.updateBody(wrappedRequest, wrappedResponse);
        } finally {
            wrappedResponse.copyBodyToResponse();
        }
    }

    private boolean isRequestValid(HttpServletRequest request) {
        try {
            new URI(request.getRequestURL().toString());
            return true;
        } catch (URISyntaxException ex) {
            return false;
        }
    }

}
```

Notice the call to a `ContentTraceManager`, a simple `@RequestScope` bean that will store the additional data:

```Java
@Component
@RequestScope
@ConditionalOnProperty(prefix = "management.trace.http", name = "enabled", matchIfMissing = true)
public class ContentTraceManager {

    private ContentTrace trace;

    public ContentTraceManager(ContentTrace trace) {
        this.trace=trace;
    }

    protected static Logger logger = LoggerFactory
            .getLogger(ContentTraceManager.class);

    public void updateBody(ContentCachingRequestWrapper wrappedRequest,
            ContentCachingResponseWrapper wrappedResponse) {

        String requestBody = getRequestBody(wrappedRequest);
        getTrace().setRequestBody(requestBody);

        String responseBody = getResponseBody(wrappedResponse);
        getTrace().setResponseBody(responseBody);
    }

    protected String getRequestBody(
            ContentCachingRequestWrapper wrappedRequest) {
        try {
            if (wrappedRequest.getContentLength() <= 0) {
                return null;
            }
            return new String(wrappedRequest.getContentAsByteArray(), 0,
                    wrappedRequest.getContentLength(),
                    wrappedRequest.getCharacterEncoding());
        } catch (UnsupportedEncodingException e) {
            logger.error(
                    "Could not read cached request body: " + e.getMessage());
            return null;
        }

    }

    protected String getResponseBody(
            ContentCachingResponseWrapper wrappedResponse) {

        try {
            if (wrappedResponse.getContentSize() <= 0) {
                return null;
            }
            return new String(wrappedResponse.getContentAsByteArray(), 0,
                    wrappedResponse.getContentSize(),
                    wrappedResponse.getCharacterEncoding());
        } catch (UnsupportedEncodingException e) {
            logger.error(
                    "Could not read cached response body: " + e.getMessage());
            return null;
        }

    }

    public ContentTrace getTrace() {
        if (trace == null) {
            trace = new ContentTrace();
        }
        return trace;
    }
}
```

For modeling the trace with additional data, compose a custom `ContentTrace` class with the built-in `HttpTrace` information, adding properties for storing the body contents.

```Java	
public class ContentTrace {

    protected HttpTrace httpTrace;

    protected String requestBody;

    protected String responseBody;

    protected Authentication principal;

    public ContentTrace() {
    }

    public void setHttpTrace(HttpTrace httpTrace) {
        this.httpTrace = httpTrace;
    }
}
```

> Add setters and getters for `httpTrace`, `principal`, `requestBody` and `responseBody`.

### Configure Filter Precedence

For capturing requests to OIDC endpoints in your application, the tracing filters have to sit before Spring Security filters. As long as `ContentTraceFilter` has precedence over `HttpTraceFilter`, both can be placed before or after `SecurityContextPersistenceFilter`, the first one in the Spring Security filter chain.


```Java
@Configuration
@ConditionalOnProperty(prefix = "management.trace.http", name = "enabled", matchIfMissing = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    
    private HttpTraceFilter httpTraceFilter;
    private ContentTraceFilter contentTraceFilter;

    public WebSecurityConfig(
        HttpTraceFilter httpTraceFilter, ContentTraceFilter contentTraceFilter
    ) {
        this.httpTraceFilter = httpTraceFilter;
        this.contentTraceFilter = contentTraceFilter;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.addFilterBefore(contentTraceFilter,
                SecurityContextPersistenceFilter.class)
                .addFilterAfter(httpTraceFilter,
                        SecurityContextPersistenceFilter.class)
                .authorizeRequests().anyRequest().authenticated()
                .and().oauth2Client()
                .and().oauth2Login();
    }
}
```

## Tracing the Authenticated User

We're installing the trace filters before the Spring Security filter chain. This means that the Principal is no longer available when the HttpTraceFilter saves the trace. We can restore this trace data with a new filter and the ContentTraceManager.

```Java
@Component
@ConditionalOnProperty(prefix = "management.trace.http", name = "enabled", matchIfMissing = true)
public class PrincipalTraceFilter extends OncePerRequestFilter {


    private ContentTraceManager traceManager;


    private HttpTraceProperties traceProperties;

    public PrincipalTraceFilter(
        ContentTraceManager traceManager,
        HttpTraceProperties traceProperties
    ) {
        super();
        this.traceManager = traceManager;
        this.traceProperties = traceProperties;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        if (!isRequestValid(request)) {
            filterChain.doFilter(request, response);
            return;
        }
        try {
            filterChain.doFilter(request, response);

        } finally {
            if (traceProperties.getInclude().contains(Include.PRINCIPAL)) {
                traceManager.updatePrincipal();
            }
        }

    }

    private boolean isRequestValid(HttpServletRequest request) {
        try {
            new URI(request.getRequestURL().toString());
            return true;
        } catch (URISyntaxException ex) {
            return false;
        }
    }

}
```
Add the missing `ContentTraceManager` class for updating the principal:

```Java
public class ContentTraceManager {

  public void updatePrincipal() {
      Authentication authentication = SecurityContextHolder.getContext()
              .getAuthentication();
      if (authentication != null) {
          getTrace().setPrincipal(authentication);
      }
  }
}
```

The `PrincipalTraceFilter` must have lower precedence than the Spring Security filter chain, so the authenticated principal is available when requested from the security context. Modify the `WebSecurityConfig` to insert the filter after the `FilterSecurityInterceptor`, the last filter in the security chain.

```Java
@Configuration
@ConditionalOnProperty(prefix = "management.trace.http", name = "enabled", matchIfMissing = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {


    private HttpTraceFilter httpTraceFilter;
    private ContentTraceFilter contentTraceFilter;
    private PrincipalTraceFilter principalTraceFilter;

    public WebSecurityConfig(
        HttpTraceFilter httpTraceFilter,
        ContentTraceFilter contentTraceFilter,
        PrincipalTraceFilter principalTraceFilter
    ) {
        super();
        this.httpTraceFilter = httpTraceFilter;
        this.contentTraceFilter = contentTraceFilter;
        this.principalTraceFilter = principalTraceFilter;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.addFilterBefore(contentTraceFilter,
                SecurityContextPersistenceFilter.class)
                .addFilterAfter(httpTraceFilter,
                        SecurityContextPersistenceFilter.class)
                .addFilterAfter(principalTraceFilter,
                        FilterSecurityInterceptor.class)
                .authorizeRequests().anyRequest().authenticated()
                .and().oauth2Client()
                .and().oauth2Login();
    }
}
```

## HTTPTrace Endpoint Extension

Finally, define the endpoint enhancement using the `@EndpointWebExtension` annotation. Implement a `CustomHttpTraceRepository` to store and retrieve a `ContentTrace` with the additional data.


```Java
@Component
@EndpointWebExtension(endpoint = HttpTraceEndpoint.class)
@ConditionalOnProperty(prefix = "management.trace.http", name = "enabled", matchIfMissing = true)
public class HttpTraceEndpointExtension {

    private CustomHttpTraceRepository repository;

    public HttpTraceEndpointExtension(CustomHttpTraceRepository repository) {
        super();
        this.repository = repository;
    }

    @ReadOperation
    public ContentTraceDescriptor contents() {
        List<ContentTrace> traces = repository.findAllWithContent();
        return new ContentTraceDescriptor(traces);
    }
}
```

Redefine a descriptor for the endpoint return type:

```Java
public class ContentTraceDescriptor {

    protected List<ContentTrace> traces;

    public ContentTraceDescriptor(List<ContentTrace> traces) {
        super();
        this.traces = traces;
    }

    public List<ContentTrace> getTraces() {
        return traces;
    }

    public void setTraces(List<ContentTrace> traces) {
        this.traces = traces;
    }

}
```

Create the `CustomHttpTraceRepository` implementing the `HttpTraceRepository` interface:

```Java
@Component
@ConditionalOnProperty(prefix = "management.trace.http", name = "enabled", matchIfMissing = true)
public class CustomHttpTraceRepository implements HttpTraceRepository {

    private final List<ContentTrace> contents = new LinkedList<>();


    private ContentTraceManager traceManager;

    public CustomHttpTraceRepository(ContentTraceManager traceManager) {
        super();
        this.traceManager = traceManager;
    }

    @Override
    public void add(HttpTrace trace) {
        synchronized (this.contents) {
            ContentTrace contentTrace = traceManager.getTrace();
            contentTrace.setHttpTrace(trace);
            this.contents.add(0, contentTrace);
        }
    }

    @Override
    public List<HttpTrace> findAll() {
        synchronized (this.contents) {
            return contents.stream().map(ContentTrace::getHttpTrace)
                    .collect(Collectors.toList());
        }
    }

    public List<ContentTrace> findAllWithContent() {
        synchronized (this.contents) {
            return Collections.unmodifiableList(new ArrayList<>(this.contents));
        }
    }

}
```


## Inspect OpenID Connect HTTP Trace

Modify the `application.properties` file for tracing all available data by adding the following line:

```
management.trace.http.include=request-headers,response-headers,cookie-headers,principal,time-taken,authorization-header,remote-address,session-id
```

Run the application again and call the secured controller [/hello/greeting](http://localhost:8080/hello/greeting). Authenticate against Okta and then inspect the traces at [/actuator/httptrace](http://localhost:8080/actuator/httptrace).

You should now see OIDC calls in the trace as well as the request and response contents. For example, in the trace below, a request to the application authorization endpoint redirects to the Okta authorization server, initiating the OIDC authorization code flow.

```json
{
    "httpTrace": {
        "timestamp": "2019-05-22T00:52:22.383Z",
        "principal": null,
        "session": {
            "id": "C2174F5E5F85B313B2284639EE4016E7"
        },
        "request": {
            "method": "GET",
            "uri": "http://localhost:8080/oauth2/authorization/okta",
            "headers": {
                "cookie": [
                    "JSESSIONID=C2174F5E5F85B313B2284639EE4016E7"
                ],
                "accept-language": [
                    "en-US,en;q=0.9"
                ],
                "upgrade-insecure-requests": [
                    "1"
                ],
                "host": [
                    "localhost:8080"
                ],
                "connection": [
                    "keep-alive"
                ],
                "accept-encoding": [
                    "gzip, deflate, br"
                ],
                "accept": [
                    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"
                ],
                "user-agent": [
                    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"
                ]
            },
            "remoteAddress": "0:0:0:0:0:0:0:1"
        },
        "response": {
            "status": 302,
            "headers": {
                "X-Frame-Options": [
                    "DENY"
                ],
                "Cache-Control": [
                    "no-cache, no-store, max-age=0, must-revalidate"
                ],
                "X-Content-Type-Options": [
                    "nosniff"
                ],
                "Expires": [
                    "0"
                ],
                "Pragma": [
                    "no-cache"
                ],
                "X-XSS-Protection": [
                    "1; mode=block"
                ],
                "Location": [
                    "https://dev-239352.okta.com/oauth2/default/v1/authorize?response_type=code&client_id=0oalrp4qx3Do43VyI356&scope=openid%20profile%20email&state=1uzHRyaHVmyKcpb7eAvJVrdJTZ6wTgkPv3fsC14qdOk%3D&redirect_uri=http://localhost:8080/authorization-code/callback"
                ]
            }
        },
        "timeTaken": 9
    },
    "requestBody": null,
    "responseBody": null
}
```

## Learn More

That's all there is to it! You just learned how to configure and extend the `httptrace` actuator endpoint for monitoring your OIDC application. For more insights about Spring Boot Actuator, Spring Boot in general, or user authentication, check out the links below:

* [**Java Microservices with Spring Boot and Spring Cloud**](https://developer.okta.com/blog/2019/05/22/java-microservices-spring-boot-spring-cloud_)
* [**Spring Boot Actuator Endpoints**](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-endpoints.html)
* [**Implementing Custom Endpoints**](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-endpoints.html#production-ready-endpoints-custom)
* [**Okta Authentication Quickstart Guides Java Spring**](https://developer.okta.com/quickstart/#/okta-sign-in-page/java/spring)

As always, if you have any comments or questions about this post, feel free to comment below. Don't miss out on any of our cool content in the future by following us on [Twitter](https://twitter.com/oktadev) and [YouTube](https://www.youtube.com/c/oktadev).