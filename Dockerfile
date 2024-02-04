# Dockerfile
# Use the official Node.js 21 image as a parent image
FROM node:21

# Set the working directory in the container
WORKDIR /usr/src/app

# Create a non-root user and switch to it
RUN useradd --create-home myappuser
RUN chown -R myappuser:myappuser /usr/src/app
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

# Define the command to run your app using the compiled JavaScript from the dist directory
CMD ["node", "dist/index.js"]