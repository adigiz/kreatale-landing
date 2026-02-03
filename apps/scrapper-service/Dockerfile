# --- Builder Stage ---
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for building)
RUN npm ci

# Copy source code
COPY . .

# Build the TypeScript application
RUN npm run build

# --- Production Stage ---
FROM node:20-slim AS runner

# Install dependencies for Puppeteer (Chromium)
# We need these in the final image because Puppeteer runs here
RUN apt-get update && apt-get install -y \
  chromium \
  fonts-ipafont-gothic \
  fonts-wqy-zenhei \
  fonts-thai-tlwg \
  fonts-kacst \
  fonts-freefont-ttf \
  libxss1 \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

# Tell Puppeteer to use the installed Chromium if desired, 
# or ensure it can run the bundled one. 
# Usually for 'node:slim' we rely on installed libraries so the bundled chromium works.
# Or we can set ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true and use /usr/bin/chromium 
# but simply having the libs is often enough and safer for compatibility.

WORKDIR /app

# Copy package files for production install
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --only=production

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 4000

# Start command
CMD ["node", "dist/index.js"]
