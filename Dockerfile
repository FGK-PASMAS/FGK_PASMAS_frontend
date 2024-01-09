FROM node as builder

WORKDIR /app
COPY . .

RUN npm install

CMD [ "npm", "run", "build" ]


FROM nginx

WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist .
