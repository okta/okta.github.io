---
layout: blog_post
title: TLS Client Authentication for Internal Services
redirect_from:
  - /blog/2015/10/29/tls-client-authentication-for-services/
author: william_dawson
tags: [networking, security, architecture]
---
If you're like me, the most aggravating thing is finding a Stack Overflow
question that exactly describes the issue you are facing, only to scroll down
and see that it has remained unanswered since 2011. I was recently trying to
configure Transport Layer Security (TLS) [client
authentication](https://en.wikipedia.org/wiki/Transport_Layer_Security#Client-authenticated_TLS_handshake)
(also referred to as mutual SSL) between two internal services at Okta and
found the lack of complete examples astonishing. I hope that this blog post
provides a better understanding of how to accomplish client authentication in
your applications and makes all that hard security stuff a bit easier.

## TLS Background

In a normal TLS handshake, the server sends its certificate to the client so
that the client can verify the authenticity of the server. It does this by
following the certificate chain that issued the server's certificate until it
arrives at a certificate that it trusts. If the client reaches the end of the
chain without finding a certificate that it trusts, it will reject the
connection. For an example of what a server might send, see [this
gist](https://gist.github.com/jpf/9282d558bcc105ae8e1a).

{: style="text-align: center"}
{% img 2015-10-29-tls-client-authentication-for-services-tls-handshake.png alt:"TLS handshake" width:"540px" %}

{: style="text-align: center;font-size: x-small;"}
Image reprinted with permission from
[CloudFlare](https://blog.cloudflare.com/protecting-the-origin-with-tls-authenticated-origin-pulls/)

In mutual SSL, the client also sends its certificate to the server
for the server to authenticate along with an additional message (called the
CertificateVerify message), which assures the server that the client is the true
owner of the certificate. The server follows the same process of checking the
certificate chain until it finds one it trusts, refusing the connection if it
can't find such a certificate.

So why is that useful? You probably interact with typical TLS all the time in
your browser. For example, when you visit <https://www.okta.com>, your browser
is verifying that the server serving Okta's site is authentic (that it's not
impersonating a legitimate Okta server). But Okta's server has no idea who your
browser is. In this case it doesn't care too much, so it lets you connect.

When we start talking about services talking to each other, authenticating the
client becomes important because it lowers the risk of our servers divulging
information to machines impersonating our services. For example, let's say we
have a service called the User Service that holds all the information about
users in our application. We have another service called the Home Page Service
that serves up the home page to the browser. The home page has the user's name,
email, phone number, and other personal information. The Home Page Service needs
to talk to the User Service to get the user's name to display on the page. In
this case, the Home Page Service is the client and the User Service is the
server. If we only used normal TLS, only the User Service would be
authenticated! We need TLS client authentication to make sure the User Service
doesn't provide data to a random client.

## Implementing TLS Client Authentication

In our case, the client and server are internal services communicating with each
other. I won't cover configuring a browser client or other clients that may be
not under your control. In this post, I'll give examples for the technology we
use at Okta. Specifically, we use [Dropwizard](http://www.dropwizard.io/) as
the server framework and [Jersey](https://jersey.java.net/) for the client
framework. We'll also use Java's
[keytool](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/keytool.html)
for building the key and trust stores in Java KeyStore (JKS) format. The
examples below use these technologies, but I hope they'll be fairly transferable
to choices you make in your applications. In addition, these samples are not
meant to be complete, so you may need to modify them to fit in your environment.

### Certificates and Key Stores

{: style="text-align: center"}
{% img 2015-10-29-tls-client-authentication-for-services-ca-chain.png alt:"CA heirarchy" width:"540px" %}

First, let's setup our trust store, which is just a key store that will only
contain certificates. Let's assume we have a layered Certificate Authority (CA)
structure, like the image above, with a root CA and a subordinate global CA. The
root CA has its private key stored offline and its certificate is the one we
want our services to trust. The root certificate is the _only_ certificate we
want our services to trust on that channel. We don't even want a certificate
issued by a reputable 3rd party CA to be trusted by our service. So our trust
store will contain only the root certificate, which means the server will only
establish connections from clients that have a certificate issued by the root CA
or its child, the global CA, which will be the issuer of our server's
certificate. This way, it's quite easy to rotate our server's certificate,
either when it expires or if it is somehow compromised; we can just change it on
that service and don't have to worry about the other services it communicates
with losing trust because they trust the root. If all our services trusted each
other explicitly, the rotation would be much more difficult, especially if you
can't take downtime. We'll use the trust store for both the client and the
server, so you only need to make one, which you can copy if you need to.

~~~shell
# Import your root certificate into a new trust store and follow the prompts
keytool -import -alias root -file root.crt -keystore truststore.jks
~~~

Now that we've set up trust, we want to issue the certificate for our service
that chains up to the root. We'll use the global CA to issue our server its
certificate, and since the global CA's certificate is issued by the root CA,
we have a chain of trust. When we create the server's certificate, we'll include
the chain as well for clients to verify. The [TLS
standard](http://tools.ietf.org/html/rfc5246#section-7.4.2) specifies that the
certificate chain does not require the actual root of trust since the endpoints
will have it already, so we'll omit it to save bandwidth. Once we have the
certificate we'll put it in a JKS for our Dropwizard application to use. If
your client does not have a certificate for service-to-service communication,
you can follow a similar pattern to create its certificate. But if it does have
an existing certificate, you can just reuse that one.

~~~shell
# Create our server's key
openssl genrsa -out server.key 2048

# Create the csr and follow the prompts for country code, ou, etc
openssl req -new -key server.key -sha256 -out server.csr

# Sign the csr with your CA
openssl ca -in server.csr -days 365 -config my-ca-conf.cnf -out server.crt

# Cat the cert chain together (except the root)
cat server.crt global.crt > chain.crt

# Create pkcs12 file for key and cert chain
openssl pkcs12 -export -name server-tls -in chain.crt -inkey server.key -out server.p12

# Create JKS for server
keytool -importkeystore -destkeystore keystore.jks -srckeystore server.p12 -srcstoretype pkcs12 -alias server-tls
~~~

### Server Configuration

Now that we have our key and trust stores, let's configure the server's
Dropwizard application connector.

~~~ conf
server:
  applicationConnectors:
    - type: https
    port: 8443

    # Key store settings
    keyStorePath: path/to/keystore.jks
    keyStorePassword: "notsecret"
    certAlias: server-tls
    enableCRLDP: true

    # Trust store settings
    trustStorePath: path/to/truststore.jks
    trustStorePassword: "notsecret"

    # Fail fast at startup if the certificates are invalid
    validateCerts: true

    # Whether or not to require authentication by peer certificate.
    needClientAuth: true

    # Check peer certificates for validity when establishing a connection
    validatePeers: true

    # The list of supported SSL/TLS protocols. You may need to modify
    # this section to support clients that you have.
    supportedProtocols: ["TLSv1.2"]
    supportedCipherSuites: ["TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384"]
    allowRenegotiation: false
~~~

{: style="text-align: center;font-size: x-small;"}
Dropwizard code is Copyright &copy; 2010-2013 Coda Hale, Yammer Inc., 2014-2015 Dropwizard Team and/or its affiliates.
[Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0.html).

That was pretty easy, huh? No cryptic OpenSSL commands! Now our server should be
configured to refuse connections from clients not presenting a root issued
certificate chain. We can test to make sure that happens! We can start our
server, telling Java to debug the SSL handshakes, and make sure we see it
refusing the connection for the right reason. In one terminal start the
Dropwizard server debugging SSL.

~~~ shell
$ java -Djavax.net.debug=SSL,keymanager,trustmanager -jar your/jar.jar server config.yml
~~~

In another terminal run the following curl commands and verify you get the
expected results. First, make sure that the server does not talk HTTP over our
port.

~~~ shell
$ curl localhost:443
curl: (52) Empty reply from server

# The server should print something like the following because of no TLS:
# javax.net.ssl.SSLException: Unrecognized SSL message, plaintext connection?
~~~

Next, check that the server is sending your certificate back over HTTPS.
curl has a preconfigured list of trusted certs and chances are your
root certificate is not in there.

~~~ shell
$ curl https://localhost:443
curl: (60) SSL certificate problem: Invalid certificate chain

# The server will print a bunch of stuff ending with something like:
# javax.net.ssl.SSLException: Received close_notify during handshake
~~~

Finally, ensure that the server terminates the connection if no client cert is
provided.

~~~ shell
$ curl -k https://localhost:443
curl: (35) Server aborted the SSL handshake

# The server will, again, print a bunch of stuff ending with something like:
# javax.net.ssl.SSLHandshakeException: null cert chain
~~~

### Client Configuration

Now we'll configure our client to talk to the server. I'll use the Jersey 2.X
API, but there are equivalents in the 1.X as well as in the Apache HTTP library.

~~~ java
// Assume the following variables are initialized already
String password;
RSAPrivateKey clientKey;
X509Certificate clientCert;
X509Certificate globalCert;
X509Certificate rootCert;

X509Certificate[] certChain = {clientCert, globalCert};

// setup key store
KeyStore clientKeyStore = KeyStore.getInstance("JKS");
clientKeyStore.load(null, password.toCharArray());
clientKeyStore.setKeyEntry("service-tls", clientKey, password.toCharArray(), certChain);

// setup trust store
KeyStore clientTrustStore = KeyStore.getInstance("JKS");
clientTrustStore.load(null, password.toCharArray());
clientTrustStore.setCertificateEntry("root-ca", rootCert);

// setup Jersey client
SslConfigurator sslConfig = SslConfigurator.newInstance()
        .keyStore(clientKeyStore)
        .keyStorePassword(password)
        .keyPassword(password)

        .trustStore(clientTrustStore)
        .trustStorePassword(password)

        .securityProtocol("TLSv1.2");

SSLContext sslContext = sslConfig.createSSLContext();
Client client = ClientBuilder.newBuilder().sslContext(sslContext).build();
~~~

{: style="text-align: center;font-size: x-small;"}
Jersey code is Copyright &copy; 2010-2015 Oracle and/or its affiliates.
[GPL 2.0 Selected](https://jersey.java.net/license.html).

Hooray authentication!

{: style="text-align: center"}
[![xkcd-identity](http://imgs.xkcd.com/comics/identity.png)](https://xkcd.com/1121/)

{: style="text-align: center;font-size: x-small;"}
Comic is Copyright &copy; [xkcd.com](https://xkcd.com).
[CC BY-NC 2.5](http://creativecommons.org/licenses/by-nc/2.5/).

## Tightening Things Up

Now we are just granting any service with a certificate signed by our root CA to
talk to our server. Chances are we'd like to trim this down to only clients that
should be talking to the server so we can refuse some other service that has
no business with our server even though it has a certificate issued by our root
CA. This is useful for preventing another service we have from accessing our new
service. For example, suppose in addition to a User Service and a Home Page
Service, we have an Event Service. We may want to block the Event Service from
communicating with the User Service while allowing the Home Page Service to do
that communication.

To accomplish this, we could change our server's trust store to only contain the
public key of the client, but this presents problems (and more work) when we try
to rotate that key pair. So, instead, let's try having the server check that the
hostname of the client is one that it expects to hear from. We can also do this
in the other direction (client verifying the server).

Several options exist for verifying the hostname on the server side. The first
is one that Dropwizard supports this verification with a tricky configuration
change for the underlying Java SSL connection.

~~~ conf
server:
  applicationConnectors:
    - type: https
      #...
      endpointIdentificationAlgorithm: HTTPS
~~~

The HTTPS endpoint identification algorithm will cause Java to do hostname
verification against your cert. Specifically, this will check the hostname of
the client that made the request against the DN that is given in the client's
certificate. If they do not match, the connection will be refused. This is a
great, [standard](http://tools.ietf.org/html/rfc2818#section-3.1) way to solve
this problem, however it can be tricky to know what the hostnames will be or to
make a wildcard pattern (or [subject alternative name
extension](https://tools.ietf.org/html/rfc3280#section-4.2.1.7)) for your
clients. We can take a higher-level approach than hostname comparison.

We can, instead, provide our server with a regular expression that matches the
DNs that we expect in our certificates. This means we no longer have to worry
about hostnames. So as services move from host to host, they can keep the same
certificate and everything will Just Work&trade;.
Additionally, a certificate can belong to a service rather than an individual
host now so there's less management that needs to happen. To do this, we just
need to set up a filter in our server and configure a regex to match the DN in
the certificate(s) that are allowed to communicate with our service or else
return a 403 response.

~~~ java
import javax.annotation.Priority;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.PreMatching;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.security.cert.X509Certificate;
import java.util.regex.Pattern;

/**
* A ContainerRequestFilter to do certificate validation beyond the tls validation.
* For example, the filter matches the subject against a regex and will 403 if it doesn't match
*
* @author <a href="mailto:wdawson@okta.com">wdawson</a>
*/
@PreMatching
@Priority(Priorities.AUTHENTICATION)
public class CertificateValidationFilter implements ContainerRequestFilter {

    private static final String X509_CERTIFICATE_ATTRIBUTE = "javax.servlet.request.X509Certificate";

    private final Pattern dnRegex;

    // Although this is a class level field, Jersey actually injects a proxy
    // which is able to simultaneously serve more requests.
    @Context
    private HttpServletRequest request;

    /**
     * Constructor for the CertificateValidationFilter.
     *
     * @param dnRegex The regular expression to match subjects of certificates with.
     *                E.g.: "^CN=service1\.example\.com$"
     */
    public CertificateValidationFilter(String dnRegex) {
        this.dnRegex = Pattern.compile(dnRegex);
    }

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        X509Certificate[] certificateChain = (X509Certificate[]) request.getAttribute(X509_CERTIFICATE_ATTRIBUTE);

        if (certificateChain == null || certificateChain.length == 0 || certificateChain[0] == null) {
            requestContext.abortWith(buildForbiddenResponse("No certificate chain found!"));
            return;
        }

        // The certificate of the client is always the first in the chain.
        X509Certificate clientCert = certificateChain[0];
        String clientCertDN = clientCert.getSubjectDN().getName();

        if (!dnRegex.matcher(clientCertDN).matches()) {
            requestContext.abortWith(buildForbiddenResponse("Certificate subject is not recognized!"));
        }
    }

    private Response buildForbiddenResponse(String message) {
        reutrn Response.status(Response.Status.FORBIDDEN)
                .entity("{\"message\":\"" + message + "\"}")
                .build();
    }
}
~~~

{: style="text-align: center;font-size: x-small;"}
Dropwizard code is Copyright &copy; 2010-2013 Coda Hale, Yammer Inc., 2014-2015 Dropwizard Team and/or its affiliates.
[Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0.html).
Jersey code is Copyright &copy; 2010-2015 Oracle and/or its affiliates.
[GPL 2.0 Selected](https://jersey.java.net/license.html).

## Circling Back

We defined TLS client authentication and went over how it can help secure your
backend services. We walked through configuring a Dropwizard server with
mandatory TLS client authentication and creating a Jersey client to provide the
appropriate credentials when talking to that server. We also talked about
options to further restrict clients' ability to talk to the server based on
their certificates. I hope you have a better understanding of how to implement
mutual SSL in your applications. Below are a few things to also keep in mind as
you implement these authentication concepts in your applications.

- [TLS Protocol Security](https://en.wikipedia.org/wiki/Transport_Layer_Security#Security)
- [Cipher Suites](https://en.wikipedia.org/wiki/Transport_Layer_Security#Cipher)
- [Authorization](https://en.wikipedia.org/wiki/Authentication#Authorization)
- [JVM Security Updates](https://www.java.com/en/download/faq/release_dates.xml)

#### References
1. [Common keytool commands](https://www.sslshopper.com/article-most-common-java-keytool-keystore-commands.html)
2. [Common openssl commands](https://www.sslshopper.com/article-most-common-openssl-commands.html)
3. [Dropwizard https configuration manual](http://www.dropwizard.io/0.7.1/docs/manual/configuration.html#man-configuration-https)
4. [Jersey client documentation](https://jersey.java.net/documentation/latest/client.html#d0e5128)
