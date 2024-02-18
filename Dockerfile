# Use Node.js 21 as the base image
FROM node:21 AS builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Start a new, final image to reduce size
FROM node:21-slim

# Create a non-root user and set the working directory
RUN useradd --create-home appuser
WORKDIR /home/appuser
USER appuser

# Copy the build artifacts from the previous stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Expose port 8080 and run the application
EXPOSE 8080
CMD ["node", "dist/index.js"]
