# Use official Node.js 18 image (or any supported LTS version)
FROM node:18

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the backend source code
COPY . .

# Expose port your app listens on
EXPOSE 5000

# Run with nodemon for development (install nodemon globally)
RUN npm install -g nodemon

# Command to start the app with nodemon (auto-reload)
CMD ["nodemon", "app.js"]
