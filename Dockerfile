# Dockerfile
# Use the official Node.js image as a parent image
FROM node:21

# Set the working directory in the container
WORKDIR /usr/src/app

# Create a non-root user and switch to it
RUN useradd --create-home myappuser

# Temporarily switch to root to install the latest version of npm
USER root
RUN npm install -g npm@latest

# Switch back to the non-root user
USER myappuser

# Copy package.json and package-lock.json (or npm-shrinkwrap.json)
COPY --chown=myappuser:myappuser package*.json ./

# Install production dependencies
RUN npm install

# Copy the source code into the container
COPY --chown=myappuser:myappuser . .

# Build the app (if necessary)
RUN npm run build

# Your app binds to port 8080 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 8080

# Define the command to run your app using CMD
CMD ["node", "dist/index.js"]