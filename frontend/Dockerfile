# Stage 1: Build the Angular app (Development)
FROM node:lts-alpine AS builder
ENV NODE_ENV=development
WORKDIR /src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install
COPY . .
RUN npm run build


# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /src/app/dist/parts-shop/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
