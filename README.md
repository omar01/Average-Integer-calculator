# average-integer-calculator

## Problem

We need to implement these components

### Random integer generators

- every 100ms generates a random integer from 1 to 10000
- the value gets pushed through the message broker of your choice

### Integer average calculator

- subscribes to the topic where generators publish the values
- computes the average integer for the last 5 seconds
- exposes an http endpoint where this computed value could be obtained via GET request

## Solution

**integerGenerator.js** is responsible for generating, each 100 ms, random integers and publishing them to a queue on RabbitMQ. We can test it with ``` npm run startPublisher ```.

**integerAverageCalculator.js** consumes from the queue every 5 seconds then calculates the average of all integers generated during that period. Also, it provides the web framework with the average value in order to display it in a HTML page. We can test it with ``` npm run startConsumer ```.

## How to run it locally ? 
Build the image locally
```
docker build -t calculator:latest .
```
Run the rabbitMQ broker 
```
docker run -p 5672:5672 -d --name=rabbitmq rabbitmq:latest
```

Run the 2 publishers and override the local.toml configuration with yours including the machine ip or hostname

```
docker run --name publisher1 -v local.toml/local.toml  calculator:latest npm run startPublisher
```

```
docker run --name publisher2 -v local.toml/local.toml  calculator:latest npm run startPublisher
```

Start the consumer with the same local configuration file 
```
docker run --name consumer -v local.toml/local.toml  calculator:latest npm start
```

Go to ```localhost:3000```, it will redirect you to the GET HTTP endpoint ```/average```. The page displays the current average integer which will be updated each 5 seconds.

## Enhancements

- Unify the application logging with fluentd, then send out these logs to Sumologic in order to be able to query them easily and in an advanced way
- Integrate New relic in order to inspect the infrastructure hosting these docker containers
- Enable the rabbitMQ dashboard in order to be able monitoing the queues
- Automate the build of the docker images and push them to dockerhub with Bamboo
- Using terraform to automate the provisionning of these containers into AWS ECS. Each docker image will be deployed into an EC2 machine apart
- More focus on the error management in the application (lack of time)
