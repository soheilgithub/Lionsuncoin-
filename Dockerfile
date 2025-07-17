# Use official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Copy package.json files
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm ci --only=production

# Install client dependencies and build
COPY client/ ./client/
RUN cd client && npm ci && npm run build && cd ..

# Copy the rest of the application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads logs

# Set proper permissions
RUN addgroup -g 1001 -S nodejs
RUN adduser -S lionsuncoin -u 1001
RUN chown -R lionsuncoin:nodejs /usr/src/app
USER lionsuncoin

# Expose the port the app runs on
EXPOSE 5000

# Define environment variable
ENV NODE_ENV=production
ENV PORT=5000

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start the application
CMD ["npm", "start"]
