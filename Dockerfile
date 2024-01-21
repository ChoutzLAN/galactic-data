# Use the official Node.js 21 image as a parent image
FROM node:21

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code into the container
COPY . .

# If you have a tsconfig.production.json, you might want to use that instead.
RUN npm run build

# Your app binds to port 3000 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3000

# Define the command to run your app using the compiled JavaScript from the lib directory
CMD [ "node", "lib/index.js" ]
