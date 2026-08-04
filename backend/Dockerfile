# Use Node.js 20 slim as the base image
# yt-dlp and ffmpeg are no longer needed — MP3 conversion is done via RapidAPI
FROM node:20-slim

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=10000

# Expose the port
EXPOSE 10000

# Start the application
CMD ["node", "src/server.js"]
