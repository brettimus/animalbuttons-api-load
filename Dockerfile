# Start with the official k6 base image
FROM grafana/k6:latest

# Set the working directory in the container
WORKDIR /app

# Copy the k6 script into the container
COPY script.js .

# Command to run when the container starts up
ENTRYPOINT ["k6", "run", "./script.js"]
