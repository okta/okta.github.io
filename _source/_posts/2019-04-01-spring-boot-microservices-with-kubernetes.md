---
layout: blog_post
title: "Build a Microservice Architecture with Spring Boot and Kubernetes"
author: moksamedia
description: "This tutorial shows you how to use Kubernetes to deploy a Spring Boot microservice architecture to Google Cloud and Google Kubernetes Engine (GKE)."
tags: [java, spring boot, microservices, kubernetes, k8s]
tweets:
- "Learn how to use Spring Boot to build a microservices architecture, then deploy it to Google Cloud using @kubernetesio!"
- "Using @kubernetesio to deploy your microservices architecture is all the rage. Check out this post to learn how to do it!"
- "Spring Boot + Kubernetes + @googlecloud = 💙! Learn how to use k8s to deploy your @springboot microservices in this step-by-step tutorial."
image: blog/featured/okta-java-skew.jpg
---

In this tutorial, you're going to use Kubernetes to deploy a Spring Boot microservice architecture to Google Cloud, specifically the Google Kubernetes Engine (GKE). You're also going to use Istio to create a service mesh layer and to create a public gateway. The whole thing is going to be secured using Okta OAuth JWT authentication.

That was a mess of jargon. We're not going to explain microservices in-depth here. In short, microservices are a design pattern that splits larger monolithic services into smaller, independent "micro" services. These services are loosely coupled over a network. The benefits of this architecture are that each service becomes testable,  maintainable, and independently deployable. At internet scale, and in enormous companies like Amazon and Netflix, this architecture is great because it allows companies to assign small teams responsibility for manageable, discrete units of function; as opposed to having enormous monolithic blocks of code overseen by thousands of people. The downside is the high initial cost of complexity and infrastructure, which may not make sense for smaller projects that aren't going to scale.

**Kubernetes** is a platform for deploying containerized services. You can think of it as a container orchestrator for Docker containers (this is a simplification, but it'll work). It will allow us to write YAML scripts that automate the deployment of our microservice architecture to our chosen platform, GKE. It's a huge project with lots to dig into. Take a look at [their docs](https://kubernetes.io/docs/home/) for more info.

**Istio** adds another layer of features on top of Kubernetes, adding some great monitoring, security, access control, and load balancing features. Check out [their website](https://istio.io/docs/concepts/what-is-istio/) for more info.

The last piece of the microservice architecture is **Google Cloud and GKE**. This is the platform you'll be using to deploy the microservice. Another option not covered in this tutorial is Minikube. Minikube runs locally on your computer and might work great for some people; I found Google Kubernetes Engine easier to use and more performant.

We're going to assume you're familiar with Spring Boot and Java. If not, take a look at the end of the tutorial for some links to get you started.

## Requirements for Spring Boot and Kubernetes

**HTTPie**: Install HTTPie from [their website](https://httpie.org/) so that we can run HTTP requests easily from the terminal.

**Docker**: Please download and install Docker Desktop from [their website](https://www.docker.com/products/docker-desktop) if you don't have it already installed.
 
 **kubectl**: This is Kubernetes' command line interface. Instructions for installing it are on [their website](https://kubernetes.io/docs/tasks/tools/install-kubectl/). 

 **Google Cloud**: You'll need a Google Cloud account with billing enabled. A free trial is available and should include more than enough credit and time to get you through this tutorial. Go to the [Google Cloud website](https://cloud.google.com/free/) and sign up.

**developer.okta.com**: We offer free developer accounts on [our developer site](https://developer.okta.com). Please sign up for one now. You'll use it toward the end of the tutorial.

**gcloud**: This is the Google Cloud CLI. Install it using the instructions from [their website.](https://cloud.google.com/sdk/docs/).  Once that is done, you'll need to install the `gcloud kubectl` components by running the following command:

```bash
gcloud components install kubectl
```
Did I mention microservices have a high initial complexity cost? 

## Create a Google Kubernetes Engine Project with Istio

You should now have a Google Cloud account with billing enabled. Again, you shouldn't need to actually spend any money, but without billing, you won't be able to access the free trial.

Create a new project. Name it `spring-boot-gke` (or whatever you want, but you'll need the project ID for the various commands). Wait for the project to be created.

The project name will likely end up with an ID number tacked onto the end, like `spring-boot-gke-232934`. You'll need this project name a few times, so go ahead and store it in a shell variable and take note of it. 

```bash
PROJECT_NAME=<your project name and ID>
```

Once the project is ready, open the project dashboard, open the navigation menu, and click on **Kubernetes Engine**. Click the **Enable Billing** button (if you haven't already enabled billing) and select a billing account. 

Click **Create Cluster**.

{% img blog/spring-boot-kubernetes/google-cloud-create-cluster.png alt:"Create Cluster on Google Cloud" width:"800" %}{: .center-image }

From the left-side panel, select **Your First Cluster**.

Name the cluster "spring-boot-cluster".

Select the zone "us-west1-a".

Click on the **Advanced Options** link at the bottom of the cluster config panel to show the advanced options. Scroll down to the bottom and check the box for **Enable Istio (beta)**. This will automatically install Istio on the cluster.

{% img blog/spring-boot-kubernetes/enable-istio.png alt:"Enable Istio" width:"800" %}{: .center-image }

At the bottom, click **Create** to create the cluster. Grab a coffee or take a break; it will take a few minutes to create the cluster.

Meanwhile, if you haven't already, go ahead and initialize the `gcloud` CLI by running:

```bash
gcloud init
```

During the initialization process, you can set your new project as the default project and the project's region as your default region.

Once the cluster is deployed, you need to connect your local `gcloud` and `kubectl` CLI to it with the following command:

```bash
gcloud container clusters get-credentials {yourClusterName} --zone us-west1-a --project {yourProjectId}
```

If you used a different project name, you'll need to change the command to reflect that. 

**NOTE:** If you click on the **Connect** button to the right of the Google Cloud Platform dashboard, you'll see the correct command to enter:

{% img blog/spring-boot-kubernetes/connect-to-cluster.png alt:"Connect to the cluster" width:"800" %}{: .center-image }

You should see something like the following as a result:

```bash
Fetching cluster endpoint and auth data.
kubeconfig entry generated for spring-boot-cluster.
```

You will also need to give yourself admin privileges on the cluster:

```bash
kubectl create clusterrolebinding cluster-admin-binding --clusterrole=cluster-admin --user=$(gcloud config get-value core/account)
``` 

Now you need to check and make sure the Istio services were installed and are running. There are a couple of ways to check this. First, in your Google Cloud Platform Kubernetes Engine dashboard, click on the **Services** button. You should see a list of Istio services in your `spring-boot-cluster`. They should all have green "Ok" under the status column. 

While you're there, note the service named `istio-ingressgateway` of type `LoadBalancer`. This is the public load balancer for your cluster, and the entry shows the public IP and open ports.

{% img blog/spring-boot-kubernetes/kubernetes-services.png alt:"Kubernetes services" width:"800" %}{: .center-image }

Another way to check is by using the `kubectl` CLI. 

To check the services use the following command: `kubectl get services --all-namespaces`. The `--all-namespaces` is required to show the Istio services, which are in the `istio-system` namespace.

```bash
$ kubectl get services --all-namespaces
NAMESPACE      NAME                     TYPE           CLUSTER-IP      EXTERNAL-IP      PORT(S)                                                                                                                   AGE
default        kubernetes               ClusterIP      10.31.240.1     <none>           443/TCP                                                                                                                   5m
istio-system   istio-citadel            ClusterIP      10.31.252.214   <none>           8060/TCP,9093/TCP                                                                                                         3m
istio-system   istio-egressgateway      ClusterIP      10.31.247.186   <none>           80/TCP,443/TCP                                                                                                            3m
istio-system   istio-galley             ClusterIP      10.31.249.131   <none>           443/TCP,9093/TCP                                                                                                          3m
istio-system   istio-ingressgateway     LoadBalancer   10.31.244.186   35.185.213.229   80:31380/TCP,443:31390/TCP,31400:31400/TCP,15011:30675/TCP,8060:31581/TCP,853:32460/TCP,15030:30998/TCP,15031:31606/TCP   3m
istio-system   istio-pilot              ClusterIP      10.31.251.44    <none>           15010/TCP,15011/TCP,8080/TCP,9093/TCP                                                                                     3m
istio-system   istio-policy             ClusterIP      10.31.246.176   <none>           9091/TCP,15004/TCP,9093/TCP                                                                                               3m
istio-system   istio-sidecar-injector   ClusterIP      10.31.240.214   <none>           443/TCP                                                                                                                   3m
istio-system   istio-telemetry          ClusterIP      10.31.247.23    <none>           9091/TCP,15004/TCP,9093/TCP,42422/TCP                                                                                     3m
istio-system   promsd                   ClusterIP      10.31.246.88    <none>           9090/TCP                                                                                                                  3m
kube-system    default-http-backend     NodePort       10.31.250.134   <none>           80:31955/TCP                                                                                                              4m
kube-system    heapster                 ClusterIP      10.31.250.242   <none>           80/TCP                                                                                                                    4m
kube-system    kube-dns                 ClusterIP      10.31.240.10    <none>           53/UDP,53/TCP                                                                                                             4m
kube-system    metrics-server           ClusterIP      10.31.245.127   <none>           443/TCP
```

To check the Kubernetes pods, use: `kubectl get pods --all-namespaces`

```bash
$ kubectl get pods --all-namespaces
NAMESPACE      NAME                                                      READY     STATUS      RESTARTS   AGE
istio-system   istio-citadel-7c4864c9d5-7xq9x                            1/1       Running     0          10m
istio-system   istio-cleanup-secrets-ghqbl                               0/1       Completed   0          10m
istio-system   istio-egressgateway-c7f44ff8-tz7br                        1/1       Running     0          10m
istio-system   istio-galley-698f5c74d6-hmntq                             1/1       Running     0          10m
istio-system   istio-ingressgateway-774d77cb7c-qvhkb                     1/1       Running     0          10m
istio-system   istio-pilot-6bd6f7cdb-gb2gd                               2/2       Running     0          10m
istio-system   istio-policy-678bd4cf9-r8p6z                              2/2       Running     0          10m
istio-system   istio-sidecar-injector-6555557c7b-99c6k                   1/1       Running     0          10m
istio-system   istio-telemetry-5f4cfc5b6-vj8cf                           2/2       Running     0          10m
istio-system   promsd-ff878d44b-hlkpg                                    2/2       Running     1          10m
kube-system    heapster-v1.6.0-beta.1-8c76f98c7-2b4dm                    2/2       Running     0          9m
kube-system    kube-dns-7549f99fcc-z5trl                                 4/4       Running     0          10m
kube-system    kube-dns-autoscaler-67c97c87fb-m52vb                      1/1       Running     0          10m
kube-system    kube-proxy-gke-spring-boot-cluster-pool-1-b6988227-p09h   1/1       Running     0          10m
kube-system    l7-default-backend-7ff48cffd7-ppvnn                       1/1       Running     0          10m
kube-system    metrics-server-v0.2.1-fd596d746-njws2                     2/2       Running     0          10m
```

The pods need to all have a status of `Completed` or `Running`. I ran into a problem a couple of times where the auto-configuration didn't work and some of the pods never reached the `Running` status and were stuck in `ContainerCreating`. I had to delete the cluster and reinstall it to get it to work. 

If this happens you can use the `describe pods` command to see what's going on: `kubectl describe pods -n istio-system`. This will give you a TON of information on all of the pods in the `istio-system` namespace, which is specified using the `-n` options.

If you've gotten this far without problems, you now have a Kubernetes cluster deployed on GKE with Istio installed! Pretty sweet.  

Both Google and Istio have some pretty helpful docs if you have a problem. Check out the [Google GKE docs](https://cloud.google.com/kubernetes-engine/docs/quickstart) and the [Istio GKE docs](https://istio.io/docs/setup/kubernetes/quick-start-gke/) for further support.

## Create a Spring Boot Project for Your Microservices

Now go to the [Spring Initializer](https://start.spring.io/) and create your starter project. 

* Change the build tool from Maven to **Gradle**
* Use **Java** and Spring Boot version **2.1.3**
* Update the **Group** to: `com.okta.spring`
* Use **Artifact**: `springbootkbe`
* Add three **Dependencies**: `Reactive Web`, `Reactive MongoDB`, and `Lombok`

{% img blog/spring-boot-kubernetes/spring-initializr.png alt:"Spring Initializr" width:"800" %}{: .center-image }

Click **Generate Project** and download the project. Uncompress the project somewhere on your local computer and open it in your favorite IDE or editor.

The Spring Initializer has created a barebones reactive Webflux project with MongoDB support for you to expand upon. 

As in some of my other tutorials, and because I like kayaking, you're going to build a simple reactive REST service that maintains a database of kayak entries. It's really just to demonstrate basic CRUD functionality (Create, Read, Update, and Delete) and could be generalized to any type of resource.

In the `com.okta.spring.springbootkbe` package under `src/main/java`, create a document class called `Kayak.java` and paste the following into it. This is your reactive data model document.

```java
package com.okta.spring.springbootkbe;
  
import lombok.AllArgsConstructor;  
import lombok.Data;  
import lombok.NoArgsConstructor;  
import org.springframework.data.mongodb.core.mapping.Document;  
  
@Document  
@Data  
@AllArgsConstructor  
@NoArgsConstructor  
public class Kayak {  
  
    private String name;  
    private String owner;  
    private Number value;  
    private String makeModel;  
}
```

Now create another file in the same package called `KayakRepository.java`.

```java
package com.okta.spring.springbootkbe;  
  
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;  
  
public interface KayakRepository extends ReactiveMongoRepository<Kayak, Long> {  
}
```

I'm not going to go into too much detail in this tutorial about what's going on here. Spring Boot is doing a lot of auto-magicking between these two files to create a fully functional reactive Mongo document.

Next, you need to add a controller to allow access to the Kayak document data model. Create a file called `KayakController` in the `com.okta.spring.springbootkbe` package.

```java
package com.okta.spring.springbootkbe;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Controller
@RequestMapping(path = "/kayaks")
public class KayakController {

    private final KayakRepository kayakRepository;

    public KayakController(KayakRepository kayakRepository) {
        this.kayakRepository = kayakRepository;
    }

    @PostMapping()
    public @ResponseBody
    Mono<Kayak> addKayak(@RequestBody Kayak kayak) {
        return kayakRepository.save(kayak);
    }
  
    @GetMapping()
    public @ResponseBody
    Flux<Kayak> getAllKayaks() {
        Flux<Kayak> result = kayakRepository.findAll();
        return result;
    }}
```

This controller adds two methods to the `/kayaks` endpoint, a POST and GET endpoint that add a new kayak and list all kayaks, respectively.

Finally, add a simple root controller called `RootController`.

```java
package com.okta.spring.springbootkbe;  
  
import org.springframework.stereotype.Controller;  
import org.springframework.web.bind.annotation.*;  
import reactor.core.publisher.Flux;  
  
@Controller  
public class RootController {  
  
    @GetMapping("/")  
    @ResponseBody  
    public Flux<String> getRoot() {  
      return Flux.just("Alive");  
    }
}
```

This controller is required because Kuberenetes performs health checks on the root endpoint of our services and needs to return a response otherwise the cluster will think your service is down. The actual endpoint is configurable but you can just leave it at the root for now.

To bootstrap in some sample data into our database, update the `SpringbootkbeApplication` class definition to match the following.

```java
package com.okta.spring.springbootkbe;  
  
import org.springframework.boot.ApplicationRunner;  
import org.springframework.boot.SpringApplication;  
import org.springframework.boot.autoconfigure.SpringBootApplication;  
import org.springframework.context.annotation.Bean;  
import reactor.core.publisher.Flux;  
  
@SpringBootApplication  
public class SpringbootkbeApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringbootkbeApplication.class, args);
    }

    @Bean
    ApplicationRunner init(KayakRepository repository) {

        Object[][] data = {
            {"sea", "Andrew", 300.12, "NDK"},
            {"creek", "Andrew", 100.75, "Piranha"},
            {"loaner", "Andrew", 75, "Necky"}
        };

        return args -> {
            repository
                .deleteAll()
                .thenMany(
                    Flux
                        .just(data)
                        .map(array -> {
                            return new Kayak((String) array[0], (String) array[1], (Number) array[2], (String) array[3]);
                        })
                        .flatMap(repository::save)
                )
                .thenMany(repository.findAll())
                .subscribe(kayak -> System.out.println("saving " + kayak.toString()));

        };
    }
}
```

At this point, you have a fully functioning Spring Boot app (minus a MongoDB server). To test your app, add the following dependency to your `build.gradle` file.

```groovy
compile 'de.flapdoodle.embed:de.flapdoodle.embed.mongo'
```

This adds an embedded MongoDB database to your project. You'll need to remove this dependency before you deploy to the cluster, but it will let you run the Spring Boot app locally.

Run the Spring Boot app using: `gradle bootRun`.

You should see a bunch of output ending with:

```bash
2019-02-14 19:29:34.941  INFO 35982 --- [ntLoopGroup-2-4] org.mongodb.driver.connection            : Opened connection [connectionId{localValue:5, serverValue:5}] to localhost:61858
2019-02-14 19:29:34.946  INFO 35982 --- [ntLoopGroup-2-3] org.mongodb.driver.connection            : Opened connection [connectionId{localValue:4, serverValue:4}] to localhost:61858
saving Kayak(name=sea, owner=Andrew, value=300.12, makeModel=NDK)
saving Kayak(name=loaner, owner=Andrew, value=75, makeModel=Necky)
saving Kayak(name=creek, owner=Andrew, value=100.75, makeModel=Piranha)
```

Use HTTPie to test the app: `http :8080` (this runs a get request on the default Spring Boot port).

```bash
HTTP/1.1 200 OK
Content-Type: text/plain;charset=UTF-8
transfer-encoding: chunked

Alive
```

And GET your `/kayaks` endpoint using: `http :8080/kayaks`

```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
transfer-encoding: chunked
[
  {
    "makeModel": "NDK",
    "name": "sea",
    "owner": "Andrew",
    "value": 300.12
  },
  {
    "makeModel": "Necky",
    "name": "loaner",
    "owner": "Andrew",
    "value": 75
  },
  {
    "makeModel": "Piranha",
    "name": "creek",
    "owner": "Andrew",
    "value": 100.75
  }
]
```

Assuming that all worked, **delete the embedded Mongo dependency**. You're going to be using a Mongo Kubernetes pod and this dependency will cause problems with the cluster deployment.

```groovy
compile 'de.flapdoodle.embed:de.flapdoodle.embed.mongo'
```

## Deploy the MongoDB Kubernetes Pod for Your Spring Boot App

Kubernetes works (to grossly generalize and simplify) by deploying Docker containers using YAML deployment scripts. 

Create a file called `deployment-mongo.yml` in your project's root directory.

```yaml
apiVersion: apps/v1  
kind: Deployment  
metadata:  
  name: mongodb  
  labels:  
    appdb: mongodb  
spec:  
  replicas: 1  
  selector:  
    matchLabels:  
      appdb: mongodb  
  template:  
    metadata:  
      labels:  
        appdb: mongodb  
    spec:  
      containers:  
        - name: mongodb  
          image: mongo:3.6.6  
          ports:  
            - containerPort: 27017  
---  
apiVersion: v1  
kind: Service  
metadata:  
  name: mongodb  
  labels:  
    app: mongodb  
spec:  
  ports:  
    - port: 27017  
      protocol: TCP  
  selector:  
    appdb: mongodb
```

This defines the MongoDB Kubernetes `Deployment` and `Service` required to create the Mongo database on the cluster. I'm not going to try and fully explain what these objects are here, but you can read the Kubernetes [deployment docs](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) and the [service docs](https://kubernetes.io/docs/concepts/services-networking/service/). Roughly speaking, deployments define the micro-applications that run in the deployed pods while services provide the overarching abstraction that defines the access point to the apps in the pods. This abstraction provides a necessary continuity because pods may be killed and restarted and there may be multiple pods running a single service.

Now for some excitement! You're going to deploy the Mongo database deployment and service to your GKE cluster.

Use the following command:

```bash
kubectl apply -f deployment-mongo.yml
```

You should see:

```bash
deployment.apps "mongodb" created
service "mongodb" created
```

Check on the pod by running:

```bash
$ kubectl get pods
```

You should see:

```bash
NAME                      READY     STATUS    RESTARTS   AGE
mongodb-c5b8bf947-rkw5f   1/1       Running   0          21s
```

If the status is listed as `ContainerCreating`, wait a moment and run the command again. If it gets stuck on `ContainerCreating` for more than a few minutes, likely something has gone wrong. You can use the `kubectl describe pods` and `kubectl get events` commands to get an idea of what's happening.

This configured a Mongo database running on port 27017 using the standard docker image `mongo:3.6.6`.

Pretty great, huh? Next stop, rocket science!

## Deploy the Spring Boot App to the Cluster

Add a file called `Dockerfile` in the root directory:

```docker
FROM openjdk:8-jdk-alpine  
ENV APP_FILE springbootkbe-0.1.0-SNAPSHOT.jar  
ENV APP_HOME /usr/app  
EXPOSE 8000  
COPY build/libs/*.jar $APP_HOME/  
WORKDIR $APP_HOME  
ENTRYPOINT ["sh", "-c"]  
CMD ["exec java -jar $APP_FILE"]
```

Update the `src/main/resources/application.properties`:

```properties
server.port=8000
spring.data.mongodb.host=mongodb
spring.data.mongodb.port=27017
```

This configures your Spring Boot port to the port you're exposing in the `Dockerfile` as well as configuring the MongoDB host and port. The host by default will be the name of the service inside the cluster.

Build your app again (you did remove the `flapdoodle` dependency, right?):

```bash
gradle clean build
```

Create another Kubernetes deployment script called `deployment.yml` in the root project directory:

```yaml
apiVersion: v1  
kind: Service  
metadata:  
  name: kayak-service  
  labels:  
    app: kayak-service  
spec:  
  ports:  
    - name: http  
      port: 8000  
  selector:  
    app: kayak-service  
---  
apiVersion: extensions/v1beta1  
kind: Deployment  
metadata:  
  name: kayak-service  
spec:  
  replicas: 1  
  template:  
    metadata:  
      labels:  
        app: kayak-service  
        version: v1  
    spec:  
      containers:  
        - name: kayak-app  
          image: gcr.io/spring-boot-gke-<id>/kayak-app:1.0  
          imagePullPolicy: IfNotPresent  
          env:  
            - name: MONGODB_HOST  
              value: mongodb  
          ports:  
            - containerPort: 8000  
          livenessProbe:  
            httpGet:  
              path: /  
              port: 8000  
            initialDelaySeconds: 5  
            periodSeconds: 5
```

**NOTE:** Take a close look at the line with `gcr.io/spring-boot-gke/kayak-app:1.0 `. That middle part there is the Google Cloud project name. This needs to match the project name you used along with the assigned ID number (something like `spring-boot-gke-43234`).

`gcr.io` specifies a Google Cloud host for the docker image in the United States. It's possible to specify other locations. See the [Google Container Registry docs](https://cloud.google.com/container-registry/docs/pushing-and-pulling) for more info.

A brief summary of what's about to happen, as there are a lot of moving parts. The Spring Boot app is going to be docker-ized: built into a docker image. When you run the deployment script on your cluster, it's going to try to pull this image from the Google Container registry. Therefore you need to push the image to the container registry and tag it so that Kubernetes can find the correct image.

If you're using a local Docker Desktop, go ahead and start it and wait for it to start. 

Before you do anything, you will need to configure Google Cloud and docker to play nicely together:

```bash
gcloud auth configure-docker
```

Build the docker image:

```bash
docker build -t kayak-app:1.0 .
```

Tag the image and push it to the Google container registry (again note the Google Cloud project name):

```bash
docker tag kayak-app:1.0 gcr.io/$PROJECT_NAME/kayak-app:1.0;  
docker push gcr.io/$PROJECT_NAME/kayak-app:1.0
```

Now apply the `deployment.yml` file to the GKE cluster:

```bash
kubectl apply -f deployment.yml
```

Check to make sure the pod deployed properly:

```bash
kubectl get pods
```

```bash
NAME                             READY     STATUS    RESTARTS   AGE
kayak-service-7df4fb9c88-srqkr   1/1       Running   0          56s
mongodb-c5b8bf947-dmghb          1/1       Running   0          16m
```

At this point, however, your cluster isn't quite ready. It's not publicly accessible. 

Create a file called `istio-gateway.yml`

```yaml
apiVersion: networking.istio.io/v1alpha3  
kind: Gateway  
metadata:  
  name: kayak-gateway  
spec:  
  selector:  
    istio: ingressgateway # use Istio default gateway implementation  
  servers:  
  - port:  
      name: http  
      number: 80  
      protocol: HTTP  
    hosts:  
    - '*'  
---  
apiVersion: networking.istio.io/v1alpha3  
kind: VirtualService  
metadata:  
  name: kayak-service  
spec:  
  hosts:  
  - "*"  
  gateways:  
  - kayak-gateway  
  http:  
  - match:  
    - uri:  
        prefix: /  
    route:  
    - destination:  
        port:  
          number: 8000  
        host: kayak-service
```

And apply it:

```bash
 kubectl apply -f istio-gateway.yml
```

You should get:

```bash
gateway.networking.istio.io "kayak-gateway" created
virtualservice.networking.istio.io "kayak-service" created
```

## Test the Deployed Google Kubernetes Engine + Spring Boot App

Now that you have successfully deployed the Spring Boot app to the Google Kubernetes cluster and created the gateway linking your service to the outside world, you'll want to test the endpoint.

There are some [good docs on the Istio website about ingress traffic](https://istio.io/docs/tasks/traffic-management/ingress/) that have a lot of good information. Below, copied from that page, are some commands that will determine the public-facing host/ip address and ports and save them into shell variables.

```bash
export INGRESS_HOST=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.status.loadBalancer.ingress[0].ip}');
export INGRESS_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="http2")].port}');
```

In your configuration, `INGRESS_PORT` will likely just be the default 80 for HTTP (no SSL).

Run the following command to see the host and ports:

```bash
echo "$INGRESS_HOST, HTTP PORT=$INGRESS_PORT";
```

The public IP address can also be found by looking at the load balancer IP address in the **Cloud Platform Dashboard -> Kubernetes Engine -> Services**.  Look for **istio-ingressgateway** service of type **LoadBalancer**.

Test the app!

```bash
http $INGRESS_HOST:$INGRESS_PORT/
```

You should see:

```bash
HTTP/1.1 200 OK
content-type: text/plain;charset=UTF-8
...

Alive
```

And hit the `/kayaks` endpoint:

```bash
http $INGRESS_HOST:$INGRESS_PORT/kayaks
```

You should see:

```bash
HTTP/1.1 200 OK
content-type: application/json;charset=UTF-8
...
[
  {
    "makeModel": "NDK",
    "name": "sea",
    "owner": "Andrew",
    "value": 300.12
  },
  {
    "makeModel": "Piranha",
    "name": "creek",
    "owner": "Andrew",
    "value": 100.75
  },
  {
    "makeModel": "Necky",
    "name": "loaner",
    "owner": "Andrew",
    "value": 75
  }
]
```

Welcome to the world of microservices!

There's obviously a ton more that can be done with GKE and Istio. In practices, microservices typically manage a large mesh of services and deployed pods that can be scaled up and down as needed, and complex security architectures can be managed between the different pieces and with the outside world. This tutorial won't get into more of that, but there is one more step left: adding JSON web token authentication with Okta.

## Create an OpenID Connect App on Okta

Log into your developer.okta.com account (You did sign up for one of their free developer accounts, right? If not head over to [developer.okta.com](https://developer.okta.com)). 

Click on the **Application** top menu, then the **Add Application** button.

Choose application type **Web**.

{% img blog/spring-boot-kubernetes/create-new-application.png alt:"Create New Application" width:"800" %}{: .center-image }

Click **Next**.

Give the app a name. I named mine "Spring Boot GKE".

Under **Login redirect URIs** add `https://oidcdebugger.com/debug`.

Toward the bottom, under **Grant type allowed**, check the **Implicit (hybrid)** box.

{% img blog/spring-boot-kubernetes/oidc-application-settings.png alt:"OIDC Application Settings" width:"700" %}{: .center-image }

Click **Done**.

Leave the page open and take note of the **Client ID** and **Client Secret**. You'll need them in a minute when you use the OIDC Debugger to generate a JSON web token.

## Update Your Spring Boot Microservices for OAuth 2.0

Add the following dependencies to your `build.gradle`:

```groovy

compile 'org.springframework.security:spring-security-oauth2-client'
compile 'org.springframework.security:spring-security-oauth2-resource-server'

```

You also need to add the following to your `src/main/resources/application.properties` file (filling in your own Oktadeveloper URL, something like dev-123456.okta.com):

```properties
spring.security.oauth2.resourceserver.jwt.issuer-uri=https://{yourOktaDomain}/oauth2/default
```

This tells Spring where it needs to go to authenticate the JSON web token (JWT) that you're going to generate in a moment.

Finally, you need to add a new Java class called `SecurityConfiguration.java`:

```java
package com.okta.spring.springbootkbe;  
  
import org.springframework.context.annotation.Bean;  
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;  
import org.springframework.security.config.web.server.ServerHttpSecurity;  
import org.springframework.security.web.server.SecurityWebFilterChain;  
  
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
public class SecurityConfiguration {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
            .authorizeExchange()
            .pathMatchers("/").permitAll()
            .anyExchange().authenticated()
            .and()
            .oauth2ResourceServer()
            .jwt();
        return http.build();
    }
}
```

This file configures the project to allow all transactions on the root endpoint but to authorize all other transactions.

## Build A New Docker Image and Push to the GKE Cluster

Now that you have a new, auth-enabled Spring Boot app, you need to build it, package it in a Docker container, push it to the Google Cloud Docker registry, and apply a new deployment to your Kubernetes cluster.

Go to the project root directory from your shell. 

Build the Spring Boot app with the authentication updates:

```bash
gradle clean build
```

Build the new Docker image. Notice the new image name (it includes `-auth`). Also: make sure your Docker Desktop is running.

```bash
docker build -t kayak-app-auth:1.0 .
```

Tag and push your Docker image to the Google Cloud container registry. Change the project name in the repo path, if necessary.

```bash  
docker tag kayak-app-auth:1.0 gcr.io/$PROJECT_NAME/kayak-app-auth:1.0;  
docker push gcr.io/$PROJECT_NAME/kayak-app-auth:1.0;  
```

Delete the deployed pod on the cluster:

```bash
kubectl delete -f deployment.yml
```

Update the `deployment.yml` file to reflect the new image name (line 28 in the file):

```yaml
spec:  
  containers:  
    - name: kayak-app  
      image: gcr.io/spring-boot-gke/kayak-app-auth:1.0
```

Re-deploy the updated Kubernetes deployment:

```bash
kubectl apply -f deployment.yml
```

Use `kubectl get pods` to check the status of the pod. It will take a few seconds to fully update. Once it's ready, test the `/` endpoint.

```bash
http $INGRESS_HOST:$INGRESS_PORT/
HTTP/1.1 200 OK
...

Alive
```

And the `/kayaks` endpoint, which should be protected:

```bash
$ http $INGRESS_HOST:$INGRESS_PORT/kayaks
HTTP/1.1 401 Unauthorized
...
```

So close! The last thing you need to do is to use the OIDC Debugger tool to generate a token and test the JWT authentication.

## Generate A JWT and Test OAuth 2.0

Go to the [OIDC Debugger](http://oidcdebugger.com). You'll need your **Client ID** from your Okta OIDC application.

* Fill in the Authorize URI: `https://{yourOktaDomain}/oauth2/default/v1/authorize`
* Fill in the **Client ID**. 
* Put  `abcdef` for the **state**. 
* At the bottom, click **Send Request**.

Copy the generated token, and store it in a shell variable for convenience:

```bash
TOKEN=eyJraWQiOiI4UlE5REJGVUJOTnJER0VGaEExekd6bWJqREp...
```

Run the GET on the `/kayaks` endpoint again, this time with the token:

```bash
http $INGRESS_HOST:$INGRESS_PORT/kayaks Authorization:"Bearer $TOKEN"
```

**NOTE the double quotes!** Single quotes won't work because the variable won't be expanded in the string.

You should get:

```bash
HTTP/1.1 200 OK
cache-control: no-cache, no-store, max-age=0, must-revalidate
content-type: application/json;charset=UTF-8
...
[
  {
    "makeModel": "NDK",
    "name": "sea",
    "owner": "Andrew",
    "value": 300.12
  },
  {
    "makeModel": "Piranha",
    "name": "creek",
    "owner": "Andrew",
    "value": 100.75
  },
  {
    "makeModel": "Necky",
    "name": "loaner",
    "owner": "Andrew",
    "value": 75
  }
]
```

## Move Forward with Spring Boot Microservices and Kubernetes

That's it! You've covered a ton of ground here. You created a Kubernetes Cluster with Istio using Google Kubernetes on Google Cloud. You configured your local system to interact with the cluster using `gcloud` and `kubectl`. You created a Spring Boot app that used a MongoDB backend, dockerized it, pushed it to the Google Cloud registry, and deployed it to your cluster. You also added OIDC authentication to the app.

You can find the source code for this example on GitHub at [oktadeveloper/okta-spring-boot-microservice-kubernetes](https://github.com/oktadeveloper/okta-spring-boot-microservice-kubernetes).

If you're into microservices and Spring Boot, you might like these posts too:

* [Build Spring Microservices and Dockerize Them for Production](/blog/2019/02/28/spring-microservices-docker)
* [Secure Service-to-Service Spring Microservices with HTTPS and OAuth 2.0](/blog/2019/03/07/spring-microservices-https-oauth2)
* [Build and Secure Microservices with Spring Boot 2.0 and OAuth 2.0](/blog/2018/05/17/microservices-spring-boot-2-oauth)

If you have any questions about this post, please add a comment below. For more awesome content, follow [@oktadev](https://twitter.com/oktadev) on Twitter, like us [on Facebook](https://www.facebook.com/oktadevelopers/), or subscribe to [our YouTube channel](https://www.youtube.com/channel/UC5AMiWqFVFxF1q9Ya1FuZ_Q).
