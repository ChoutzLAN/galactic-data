# Base stage for common setup
FROM node:21 AS base
WORKDIR /usr/src/app

# Create a non-root user and ensure the working directory is owned by this user
RUN useradd --create-home myappuser \
    && chown -R myappuser:myappuser /usr/src/app
USER myappuser

# Install node modules based on the environment
COPY --chown=myappuser:myappuser package*.json ./
RUN npm install --legacy-peer-deps && npm cache clean --force

# Development stage with development tools and Terraform
FROM base AS development
# Re-run npm install in case there are any dev dependencies
RUN npm install --only=development
COPY --chown=myappuser:myappuser . .
# Install Terraform and other development tools as root
USER root
ARG TERRAFORM_VERSION="1.1.7"
RUN apt-get update && apt-get install -y wget unzip \
  && wget https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip \
  && unzip terraform_${TERRAFORM_VERSION}_linux_amd64.zip -d /usr/local/bin \
  && rm terraform_${TERRAFORM_VERSION}_linux_amd64.zip \
  && npm install -g npm@latest
# Switch back to the non-root user for safety
USER myappuser
CMD ["npm", "run", "dev"]

# Production stage for a slim image
FROM base AS production
# Assuming build process is needed, otherwise remove the npm run build line
COPY --chown=myappuser:myappuser . .
RUN npm run build
EXPOSE 8080
CMD ["node", "dist/index.js"]
