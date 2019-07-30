---
layout: blog_post
title: "Container Security: A Developer Guide"
author: vrohilla
description: "A short guide which explains how to properly secure containers and things to keep in mind when using containers."
tags: [security, devops, containers]
tweets:
- "Using containers? Check out our new container security developer guide!"
- "We wrote a guide which covers a lot of things to consider when building containerized applications."
- "Using @docker or other containers? Be sure to read our container security guide."
image: blog/featured/okta-dotnet-headphones.jpg
---

Have you ever spent hours trying to figure out why your newly-installed database, web server, or Python library won't work? If this sounds familiar, you likely understand the joy of software containers. Forget all those fruitless Stack Exchange searches trying to solve your configuration and dependency problems. Just install a container platform and pull an image. 

Looking to bootstrap an instant LAMP stack? You can save yourself the time and run `sudo docker run -p 80:80 -t -i linode/lamp /bin/bash`. Nice and easy.

## Container Security Challenges 

The problem with easy is there's usually a downside. Containers may be portable and agile, but they are also insecure when misused. Their easy deployment makes it easy for developers to run them without proper security checks, and the use of layered images creates a large attack surface that can be hard to defend against. 

Automating security controls on containers lets you speed up your development process while keeping your development and production environments safe.

There are three main stages to the container lifecycle, and each has its own dangers and mitigating controls. While there are several container frameworks available, this post will walk through the most popular of these: [Docker](https://www.docker.com/).

## Implement Container Security as You Build and Publish

Building a container involves either creating your own `Dockerfile` from scratch or pulling another built on a base image. This initial stage presents two significant concerns: image integrity and provenance, and image vulnerability. 

Downloading official images from a public repository like [Docker Hub](https://hub.docker.com/) may feel safe, but what about unofficial third-party images? How do you know you're getting the real image and not a hacked alternative?

### Use Signed Images With DCT and Build an Internal Registry

Only use signed images from a developer you trust. The [Docker Content Trust](https://docs.docker.com/engine/security/trust/content_trust/) (DCT) feature uses public and private keys to verify both the integrity of the image and the identity of the author. Ensure DCT is enabled by checking the [Docker Enterprise Engine](https://docs.docker.com/ee/) config file stored in `/etc/docker/daemon.json`.

How do you know who to trust? Start with your own dev team. Set up a [Docker Trusted Registry](https://docs.docker.com/ee/dtr/) to create an internal library of images that you can publish and reuse.

### Use Secure Container Versioning

Another core security challenge is container versioning. A newly-patched version of a perfectly legitimate container image might destabilize your build and introduce security flaws. Avoid this by properly tagging your `Dockerfile`s. Don't use `FROM mongo` to get an image because that will pull the latest version. Instead, say `FROM mongo 3.6`, or whatever version you've tested. Or better still, `FROM mongo@sha256: a49f4b2eebd8eabb71833df3aa626b8f6cf49c9d05e5ab622a726b245e82424d`. This defines the precise image using its SHA-256 digest (the CLI displays this digest after a `run` or `pull`).

### Scan Container Images for Vulnerabilities and Bugs

When it comes to the issue of image vulnerability, many developers will pull base images from Docker Hub assuming they've been scanned for vulnerabilities. In fact, when developer security company Snyk [scanned](https://res.cloudinary.com/snyk/image/upload/v1555510939/shifting_docker_security_left_2019.pdf) the top ten official Docker Hub images in March 2019, each contained at least 30 bugs, most stemming from the base images on which they were built.

Scan for bugs with a tool like [Docker Security Scanning](https://blog.docker.com/2016/05/docker-security-scanning/), [Dagda](https://github.com/eliasgranderubio/dagda), or [OpenSCAP](https://www.open-scap.org). You can also integrate policy-driven vulnerability scanning into your CI pipeline using a container management system like [Red Hat's CloudForms](https://go.redhat.com/cloudforms-datasheet-20181012?sc_cid=701f2000000Rm6HAAS&gclid=EAIaIQobChMIp_3yzNTQ4gIVi8hkCh0VLAaYEAAYASAAEgKNL_D_BwE&gclsrc=aw.ds).

## Deploy Your Containers with Security in Mind

When your container is up and running, who's observing network traffic? In some container frameworks including Docker, the host OS permits all network traffic between containers. This could allow an unauthorized third party or malicious program running on the host OS to observe sensitive traffic. If you don't need it, disable inter-container communication by using the --icc-false flag when running the Docker daemon. 

### Keep Configuration Secret

Better still, avoid leaking secrets like configuration specifics by not including them in your container images. Instead, provide them to the container instance at runtime. Handle this at the orchestration layer using something like [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/). 

There are also commercial products that provide extra support for secrets management. For instance, [CyberArk's Application Access Manager](https://www.cyberark.com/products/privileged-account-security-solution/application-access-manager/) integrates with Kubernetes or Red Hat OpenShift, authenticating K8 pods and passing secrets to them as needed.

### Prevent Container Breakouts

A related danger at runtime is container breakouts. Docker's daemon runs as root. If you have root access from within a container, you could potentially compromise the host OS if you're able to escape the container. Because all containers share the host OS kernel, this could be a springboard to multiple production containers. 

Prevent this by running on least-privilege principles, including not running a container as root when possible (use `--user` to define a user account). This could break permissions in the host OS, but that can be prevented by using the Linux namespaces feature to map container user IDs to different UIDs in the hostOS.

## Use Authentication to Strengthen Container Security

Authentication is an important part of the container security process and can be challenging to do at scale. Remember there could be tens of thousands of containers running in an enterprise environment.

You can build authentication into containers by using [OpenID Connect](/blog/2017/07/25/oidc-primer-part-1) in conjunction with Kubernetes. OpenID Connect is an authentication layer built atop [OAuth2](/blog/2017/06/21/what-the-heck-is-oauth). It returns a JSON Web Token (JWT) as an ID token to identify the user. After the user logs into the identity provider and gets the token, they can give this to `kubectl`, which controls the Kubernetes cluster manager. `kubectl` then accesses the Kubernetes API using the token to authenticate each container that it deploys, avoiding the need to contact the identity service provider each time. 

This approach carries several challenges, including the inability to revoke ID tokens. Instead, they should be short-lived, which means reissuing them frequently.
 
## Maintain Container Security
What's secure today might not be secure tomorrow. Containers with unpatched software (or an unpatched base image) could introduce vulnerabilities in Docker. Conduct regular audits using tools like [Docker Bench Security](https://github.com/docker/docker-bench-security), which scans for common best practices.

Containers are hugely powerful, but with great power comes great responsibility. By implementing best practices and automating them with continuous integration (CI), you can save lots of time and deliver flexible, agile software. 

To learn more about container security, read our [Developer's Guide to Docker](/blog/2017/05/10/developers-guide-to-docker-part-1). For more awesome content, follow [@oktadev](https://twitter.com/oktadev) on Twitter, like us on [Facebook](https://www.facebook.com/oktadevelopers/), or subscribe to [our YouTube channel](https://www.youtube.com/c/oktadev).
