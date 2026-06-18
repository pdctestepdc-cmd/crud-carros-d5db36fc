# syntax=docker/dockerfile:1
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml ./
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn -B -q package -DskipTests -Dmaven.test.skip=true
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENV JAVA_OPTS="-XX:TieredStopAtLevel=1 -XX:+UseSerialGC -XX:MaxRAMPercentage=75 -Dspring.main.lazy-initialization=true -Dspring.jmx.enabled=false"
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar app.jar"]
