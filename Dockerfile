FROM node as builder

WORKDIR /app
COPY . .

RUN npm install

RUN npm run build


FROM nginx

WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist .

CMD ["nginx", "-g", "daemon off;"]
