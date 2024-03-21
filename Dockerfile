# Use an official Node runtime as a parent image
FROM node:21.7.1

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Ignore files specified in .dockerignore

# Install any needed packages specified in package.json
RUN npm install

# Install Chromium for Puppeteer
RUN apt-get update && apt-get install -y chromium

# Get the path of installed Chromium
RUN which chromium

# Set Puppeteer to use Chromium from the installed location
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Define environment variable
ENV NODE_ENV production

# Run server.js when the container launches
CMD ["node", "server.js"]
