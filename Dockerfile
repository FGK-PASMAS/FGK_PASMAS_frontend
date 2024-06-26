FROM node as builder

WORKDIR /app
COPY . .

RUN npm install

RUN npm run build

FROM nginx

COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
