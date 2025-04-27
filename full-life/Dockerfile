# Build the React app
FROM node:20-alpine AS build

WORKDIR /app

# Installing dependencies
COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]




# commands to run to add project in docker
# docker build -t full-life . 
# docker run -d -p 3000:80 full-life
# if docker gives a weird name, docker run -d --name full-life -p 3000:80 full-life
# docker start full-life