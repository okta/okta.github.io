---
layout: blog_post
title: A Developer's Guide To Docker - The Dockerfile
author: leebrandt
tags: [docker, devops, developer]
redirect_from:
  - "/blog/2017/05/10/developers-guide-to-docker-part-2"
  - "/blog/2017/10/11/developers-guide-to-docker-part-2"
---

Creating a consistent environment for development, testing, staging, and production is one of the big benefits of using containers. Not only do containers make the *entire* environment portable, they remove *environment-specific problems*, like, "Why does it work in test, but not in production?" Usually, it's a package or framework that's installed on the test machine that is not on the production server. Containers carry all those dependencies with them, minimizing the possibility for those problems. To help create a consistent container, you need an image that is configured in code that can be versioned and distributed. That's where the `Dockerfile` comes in.

A `Dockerfile` (without an extension) is simply a text file with some keywords and rules that Docker uses to create an image. That image is then used to create a container, or multiple containers that all have the same set up. In this tutorial, you'll build a `Dockerfile` that you'll use to create an image for a basic web application.

>In [the previous article in this series](/blog/2017/05/10/developers-guide-to-docker-part-1), I told you that images are like blueprints for creating containers. Well really, they *are* containers. Containers frozen in time that you can use to "stamp out a copy" anytime you want.

To get the base application, just clone it from: [Github](https://github.com/leebrandt/docker-node-sample). This is just a basic Node website. Don't have Node installed on your machine? Don't worry, you're not even going to run this application on your machine, you're going to run it in a container.

## Start with a Base Docker Image
Most of the time, you won't start from scratch. You will create a Docker image based on another Docker image. The `FROM` line tells Docker what base image you want to use to build your new image. This *must* be the first line of the `Dockerfile`, you can have comments above it, but no other commands. In this case, you'll be starting from the official `node:8.4` image. So create a file called `Dockerfile` in the root folder of the application and add the `FROM` line right at the top:

```
FROM node:8.4
```

This tells Docker that we want to start from the official Node image tagged with the 8.4 version. This comes with a Linux system base (in this case Debian Jessie), and adds Node and NPM to the image.

## Get your Node App into the Image

Next, you'll run some commands to get your app (and it's dependencies) into the image you're creating.

```
COPY . /app
```

This `COPY` command just copies everything from the current directory (since your Dockerfile is in the root folder of your node application) to a folder called `/app` inside the image you're creating.

Next, you'll set the working directory in the `Dockerfile`.

```
WORKDIR /app
```

This tells Docker that the rest of the commands will be run in the context of the `/app` folder inside the image. Next, you'll add a RUN command to get the application's dependencies:

```
RUN ["npm", "install"]
```

You might be thinking, "That's a really *weird* way to *run* things!"

This style of `RUN` command in a Dockerfile is called the "exec form". You can write these commands in "shell form", like so:

```
RUN npm install
```

Use the exec form to avoid the image's shell munging string arguments. If your shell command relies on a specific shell and you are not sure if the shell you need is available on the image you're using. You can use the `SHELL` command to change the shell that a shell form command will run in.

Overall, this command will restore all the [NPM](https://www.npmjs.org/) packages for your project.

## Expose and Run Your Node App

Next, you'll open up port 3000 on TCP (where our app runs), to the outside world.

```
EXPOSE 3000/tcp
```

Lastly, you'll run the application in the container. Remember that Docker is meant to be one-to-one, container to application, so when building this container it is only natural that we have a command that we want to run that will get our application running in the container. To do this, we need to run a `CMD` command. Whatever is run by the CMD command will be run at Process ID 1 (PID1) in the container. As long as whatever runs at PID1 in the container is running, the container is running.

```
CMD ["npm", "start"]
```

>You could also use the ENTRYPOINT command in the `Dockerfile`, but either work and you will see the ENTRYPOINT command in the next post on `docker-compose`.


Your whole `Dockerfile` is six lines long. The `FROM` line starts from a base image that gives you most of what you need, then copies your code to the image and runs a few commands to get dependencies and compile the app. Then opens port 5000 to listen for requests.

## Meet Your Dockerfile

The finished `Dockerfile`:

```
FROM node:8.4

COPY . /app

WORKDIR /app

RUN ["npm", "install"]

EXPOSE 3000/tcp

CMD ["npm", "start"]
```

> I like to put one line of space between the lines in `Dockerfile`s because I think it helps with readability and because most examples I've read do it that way.

From the directory where the `Dockerfile` is, simply run

```bash
docker build -t tutorial:0.0.1 .
```

Just like when `pull`ing images from [Dockerhub](https://hub.docker.com), this command tells the Docker engine to create a repository named "tutorial" and tag it with "0.0.1".

When it's finished, you can run:

```bash
docker image list
```

You'll see the image in your list named `tutorial` with a tag of 0.0.1. If you want to create a container from this image and run it, run the command:

```bash
docker run -p 3000:3000 -d --name demo tutorial:0.0.1
```
This will create a container based on the `tutorial:0.0.1` image that you just creted and name it 'demo'. This command also has the `-d` switch that specifies that you want to run it in daemon mode (in the background). Finally, it also has the `-p` switch that maps port 3000 on the host machine (your local machine) to the exposed port on the container (formatted like `[host port]:[container port]`). This will allow you to go to `http://localhost:3000` on your machine and be viewing the container's response on that same port.

## Learn More

Congratulations! You just built your first container from a base image and added your application to it! As you can see, it's easy to put together a container when you find the right base image to build from.

Obviously, there are a lot of other things the `Dockerfile` can do for you. To find out more about what you can do in a `Dockerfile` check out the [documentation](https://docs.docker.com/engine/reference/builder/).

Now that you've [learned the basics of Docker](https://developer.okta.com/blog/2017/05/10/developers-guide-to-docker-part-1) and built your first `Dockerfile`, you're ready to [start composing containers](https://docs.docker.com/compose/) and delivering those containers to production!

If you have any questions, comments, or suggestions, feel free to reach out to me [via email](mailto:lee.brandt@okta.com), or hit me up in the comments or via Twitter [@leebrandt](https://twitter.com/leebrandt).