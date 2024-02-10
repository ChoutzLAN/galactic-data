# Dockerfile 
FROM node:21 AS base
WORKDIR /usr/src/app

# Create a non-root user and ensure the working directory is owned by this user
RUN useradd --create-home myappuser && \
    chown -R myappuser:myappuser /usr/src/app
USER myappuser

# Install node modules based on the environment
COPY --chown=myappuser:myappuser package*.json ./
RUN npm install --legacy-peer-deps && npm cache clean --force

# Development stage with development tools and Terraform
FROM base AS development
COPY --chown=myappuser:myappuser . .
# Removed the command to install npm globally as myappuser due to permissions issue
RUN npm install --only=development
CMD ["npm", "run", "dev"]

# Production stage for a slim image
FROM base AS production
COPY --chown=myappuser:myappuser . .
RUN npm run build
EXPOSE 8080
CMD ["node", "dist/index.js"]
