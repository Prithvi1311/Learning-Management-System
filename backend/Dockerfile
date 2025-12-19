# Use an official OpenJDK runtime as a parent image
FROM eclipse-temurin:17-jdk-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the application's jar file to the container
# Assuming the jar file is built as app.jar or similar in target/
# We will copy the maven wrapper and pom.xml first for caching
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Download dependencies (this step isolates dependency downloading from code changes)
# Grant execution permissions to the wrapper
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

# Copy the rest of the source code
COPY src ./src

# Build the application
RUN ./mvnw clean package -DskipTests

# Run the jar file
# Adjust the jar name pattern if necessary
CMD ["java", "-jar", "target/Learning-Management-System-0.0.1-SNAPSHOT.jar"]
