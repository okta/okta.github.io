---
layout: blog_post
title: "Test Your GitHub Repositories with Docker in 5 Minutes"
author: pmcdowell
description: "In this tutorial, you'll see how to test your repositories with nothing but Git, Docker, and a Makefile."
tags: [docker, github]
tweets:
- "@Docker + @GitHub = ❤️"
- "Check your @GitHub repo using @Docker easily!"
image: blog/docker-github/okta-node-skew.jpg
---


How many times have you checked your code into GitHub, just to have someone else check it out and find out there was some dependency missing so they could not get it to run?

I rely heavily on Docker for my build environment, and before I release anything to a teammate, I like to run it through a quick test in Docker to make sure everything is working properly.

This approach is simple and only relies on Docker, Git and a very simple makefile. This approach could easily be integrated into an automated build system to achieve Continuous Integration.


## Spin Up Docker to Try It Out

Below is a running example of this, it is a simple Node "Hello World" web server running on port 3000. Just run this command:

```sh
docker run -p 3000:3000 -e github='https://github.com/pmcdowell-okta/dockertest.git' -it oktaadmin/dockertest
```

Then, connect to `http://localhost:3000`. You should see a web page displaying Hello World.

{% img blog/docker-github/helloworld.png alt:"Hello World" width:"800" %}{: .center-image }


## How Docker Works with GitHub

You launched the Docker image with an environment variable indicating the Git repo to clone the source code from. (The `-e` switch indicates the URL for a GitHub repository.) The example I provided uses a GitHub repo that builds a web server written with Node.js. This example is very simple, but you'll get the idea of how it works.  

Here's a diagram, in case visual learning is more your style:

{% img blog/docker-github/flow.png alt:"Flow Diagram" width:"800" %}{: .center-image }


### Steps to Achieve Docker + GitHub Nirvana

1. **Launch Docker Image** – Launches Docker with an environment variable to a GitHub repository
2. **Pull** –The Docker image automatically clones the GitHub repository
3. **Setup** – Pulls down any dependencies 
3. **Builds** – Builds the full project
4. **Run** – Launches the project  


To perform this you only need a Makefile and a Docker image. Let's learn more about each:


### The Makefile

This is an example of the Makefile I use, the Makefile is very simple, you can certainly do
it your own way. The Makefile will pull down any required packages or dependencies, then it will clone the GitHub repo, build, and launch the application.

Here's a Node example I've used:

```
#Sample from https://github.com/pmcdowell-okta/Simple-node-webserver
setup:
   npm install http

build:
   echo "nothing to build, this Node, but thank you for thinking of me"

run:
   node index.js

dockertest:
   make setup
   make build
   make run
```

And here's an example in Go:

```
#Simple Makefile from https://github.com/pmcdowell-okta/hackey-golang-build

GOPATH=$(shell pwd)
SHELL := /bin/bash
PATH := bin:$(PATH)

setup:
   @GOPATH=$(GOPATH) go get "github.com/gorilla/mux"
   @GOPATH=$(GOPATH) go get "github.com/elazarl/go-bindata-assetfs"
   @GOPATH=$(GOPATH) go get github.com/jteeuwen/go-bindata/...
   @GOPATH=$(GOPATH) go get github.com/elazarl/go-bindata-assetfs/...
  
build:
   @GOPATH=$(GOPATH) go build ./...
   @GOPATH=$(GOPATH) go install ./...

run:
   bin/main


#This runs setup, build, and launches the application
dockertest:
   make setup
   make build
   make run

```

If you are not familiar with Makefiles, Makefiles are what developers use to help other developers compile and run their projects. If you want to learn more about makefiles, it might be worth looking at this tutorial on how to use a Makefile [Makefile Tutorial on Youtube](https://www.youtube.com/watch?v=Q1Lnp_Xx7z4). Just be aware that the Docker image is launching a rule called **dockertest**, that has three rules Setup, Build, and Run. These rules will be performed in order. 

Makefile(s) are sensitive, and require tabs, so if your Makefile does not work, just double check and make sure you're not using spaces. Makefiles also use a special syntax called YAML.

You can also test your code and build locally, before you commit it into GitHub by running:

`make dockertest`

If it works in your environment, and you added all the dependencies to the Makefile, it should work for the Docker Image.


## Add a Dockerfile

For the Dockerfile I try to keep this as lean as possible. I typically start with a base Ubuntu image. I add the required language(s) such as Go or Node.

The special sauce is a few commands that I put in the Dockerfile which launches the Makefile from the GitHub repository. This is what one of my Dockerfiles looks like:

```
FROM ubuntu
#You can start with any base Docker Image that works for you

RUN echo "#!/bin/bash\n" > /startscript.sh
RUN echo "mkdir github\n" >> /startscript.sh
RUN echo "cd github\n" >> /startscript.sh
RUN echo "git clone \$github\n" >> /startscript.sh
RUN echo "cd *\n" >> /startscript.sh
RUN echo "make dockertest\n" >> /startscript.sh

RUN chmod +x /startscript.sh

CMD /startscript.sh
```

If you are new to Docker, and want to build your own image, you can copy my code from above, and save it to a file called Dockerfile, then you can run the command below which will create your own local version of my Docker image called dockertest.

`docker build -t dockertest .`

For this tutorial, I'll use my image, but if you're already a savvy Docker user feel free to use your own. Just remember that you need to add anything required to compile and resolve dependencies to your Docker Image.


## Add an Environment Variable in Docker

The special sauce of this simple solution is passing an environment variable into the Docker command line interface, which provides the URL where the Docker image is going to pull down the GitHub repo. I chose to call the environment variable `github`.

{% img blog/docker-github/specialsauce.png alt:"Special Sauce" width:"800" %}{: .center-image }

For this example, I also needed to allow port 3000 to be able to access the guest
Docker image:

{% img blog/docker-github/port.png alt:"Ports" width:"800" %}{: .center-image }


## Super Simple GitHub Testing with Docker – Why?

One thing I really like about this approach, it makes is easy for someone to try your code. Below is a screenshot from one of my GitHub repos where I include the command to try my code directly from the description in the `readme.md` file.

{% img blog/docker-github/readme.png alt:"Read me" width:"800" %}{: .center-image }

I enjoyed documenting this technique, I hope others find it useful!

## Learn More about Go and Docker

If you found this interesting, you might also enjoy another project I created using Go and GO-BINDATA-ASSETFS  [GO-BIN-DATA-ASSETFS](https://github.com/elazarl/go-bindata-assetfs) to build a Go  web server that includes HTML, images, and JavaScript in a **single self contained binary**. The source code for the example in this blog post can be found here: [Hackey-GOLANG-build](https://github.com/pmcdowell-okta/hackey-golang-build).

To Learn more about Docker, check out our other Docker posts:
- [A Developer's Guide to Docker - A Gentle Introduction](/blog/2017/05/10/developers-guide-to-docker-part-1)
- [A Developer's Guid to Docker - The Dockerfile](/blog/2017/05/10/developers-guide-to-docker-part-2)

As always, feel free to post questions in the comments below. Don't forget to follow us on [Twitter](https://twitter.com/oktadev), [Facebook](https://www.facebook.com/oktadeveloper), and [LinkedIn](https://www.linkedin.com/company/oktadev/)!
