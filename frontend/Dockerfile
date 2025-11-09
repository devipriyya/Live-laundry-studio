# ---------- Stage 1: Build the frontend ----------
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy dependency files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the project files
COPY . .

# Build the production-ready frontend
RUN npm run build

# ---------- Stage 2: Serve with Nginx ----------
FROM nginx:alpine

# Remove default nginx config
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copy the built app from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy your custom nginx configuration (if you have one)
COPY --from=build /app/nginx.conf /etc/nginx/nginx.conf

# (Optional) Ensure correct permissions — safe, no need to re-add nginx user
RUN chown -R nginx:nginx /usr/share/nginx/html

# Run as non-root user for security
USER nginx

# Expose port 80 for web traffic
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
