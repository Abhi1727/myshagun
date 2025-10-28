# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 5001

# Define environment variables
# Secrets like database credentials and JWT_SECRET will be provided at runtime from a .env file.
# See .env.example for a list of required variables.
ENV PORT=5001

# Run the application
CMD [ "npm", "start" ]
