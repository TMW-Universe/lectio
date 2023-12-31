# Stage 1: Build React app
FROM node:20.6.1-alpine3.18 as build
WORKDIR /app/client

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

# Stage 2: Serve React app with Nginx
FROM nginx:latest
COPY --from=build /app/client/dist /client/usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy SSL certificate and key
COPY ./ssl/certificate.crt /client/etc/nginx/cert/
COPY ./ssl/private.key /client/etc/nginx/cert/

EXPOSE 8003

CMD ["nginx", "-g", "daemon off;"]