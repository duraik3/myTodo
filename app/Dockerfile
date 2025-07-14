# ---- Base Stage: Use an official Node.js runtime as a parent image ----
# Using a specific version is good practice for reproducibility.
FROM node:18-alpine AS base

# Set the working directory in the container
WORKDIR /usr/src/app

# ---- Dependencies Stage ----
FROM base AS dependencies
# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./
# Install app dependencies
RUN npm install

# ---- Build Stage ----
FROM base AS build
# Copy dependencies from the previous stage
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
# Copy the rest of the application source code
COPY . .
# Transpile TypeScript to JavaScript
RUN npm run build

# ---- Production Stage ----
FROM base AS production
# Copy package.json for production dependencies
COPY package*.json ./
# Install only production dependencies
RUN npm ci --only=production
# Copy the built application from the build stage
COPY --from=build /usr/src/app/dist ./dist
# Expose the port the app runs on
EXPOSE 8080
# Define the command to run the application
CMD [ "node", "dist/index.js" ]
