FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

#here you define process.env variable
ENV PORT=8080

#port on which docker listens
EXPOSE 8080

CMD ["npm", "start"]