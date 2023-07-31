FROM node:18-alpine AS builder 
WORKDIR /usr/app  
COPY package*.json ./
RUN npm install 
# Copy from local machine's project root to WORKDIR of container 
COPY . .
EXPOSE 4000 
RUN npm run build 
CMD ["node", "dist/src/server.js"]

