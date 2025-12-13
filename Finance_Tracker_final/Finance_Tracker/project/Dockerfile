FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# copy everything from the current (project) directory
COPY . .

RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests || mvn clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/*.jar"]

