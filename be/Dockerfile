FROM ubuntu:latest AS build

RUN apt-get update
RUN apt-get install openjdk-17-jdk -y
COPY . .

RUN mkdir -p ./src/main/resources

RUN cp /etc/secrets/application.properties ./src/main/resources/application.properties

RUN chmod +x mvnw && ./mvnw clean install

FROM openjdk:17-jdk-slim

EXPOSE 8080

COPY --from=build /target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]