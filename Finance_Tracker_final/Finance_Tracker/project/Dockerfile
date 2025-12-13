FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY Finance_Tracker_final/Finance_Tracker .

# give execute permission to mvnw
RUN chmod +x mvnw

# build the app
RUN ./mvnw clean package -DskipTests || mvn clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/*.jar"]
