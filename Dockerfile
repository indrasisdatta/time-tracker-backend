# -------- Stage 1 ------------
FROM node:18-alpine AS builder 
WORKDIR /usr/app  
COPY package*.json ./
RUN npm install 

# Copy from local machine's project root to WORKDIR of container 
COPY . .

# Run tests
RUN npm run test:unit
RUN npm run test:int

# Build the Typescript code
RUN npm run build:prod

# -------- Stage 2 ------------
FROM node:18-alpine
WORKDIR /usr/app  
COPY package*.json ./
RUN npm install --production
COPY --from=builder /usr/app/ ./
# ENTRYPOINT [ "node", "./src/server.js" ]

CMD ["npm", "start"]


