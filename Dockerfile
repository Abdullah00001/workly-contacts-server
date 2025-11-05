# ------------ STAGE 1: Build Stage ------------
    FROM node:22.14.0-slim AS builder

    WORKDIR /usr/src/app

    # Install deps for build
    COPY package*.json ./
    RUN npm install
    
    # Copy full source code and build it
    COPY . .
    RUN npm run build
    
    
    # ------------ STAGE 2: Production Stage ------------
    FROM node:22.14.0-slim
    
    WORKDIR /usr/src/app
    
    # Copy only production dependencies
    COPY package*.json ./
    RUN npm install --omit=dev
    
    # Copy built code from builder
    COPY --from=builder /usr/src/app/dist ./dist
    COPY --from=builder /usr/src/app/swagger.yaml ./swagger.yaml
    COPY --from=builder /usr/src/app/public ./public
    
    # Copy any necessary runtime assets (optional)
    # COPY --from=builder /usr/src/app/public ./public
    
    # Expose the app port
    EXPOSE 8080
    
    # Define the startup command
    CMD ["node", "dist/server.js"]
    