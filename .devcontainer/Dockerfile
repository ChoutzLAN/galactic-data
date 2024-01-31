# Start from the official Node.js image
FROM node:21

# Create a non-root user for better security
RUN useradd -m nodeuser

# Create the working directory and ensure proper permissions
RUN mkdir -p /usr/src/app && chown nodeuser:nodeuser /usr/src/app
WORKDIR /usr/src/app

# Use the non-root user
USER nodeuser

# Copy package.json, package-lock.json (if available), and tsconfig.json
COPY --chown=nodeuser:nodeuser package*.json tsconfig.json ./

# Install local dependencies including 'typescript' and 'nodemon'
RUN npm install

# Copy the source code (make sure .dockerignore excludes node_modules and lib)
COPY --chown=nodeuser:nodeuser . .

# Build the app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app using nodemon for development, using npx to execute the local package
CMD ["npx", "nodemon", "lib/index.js"]
