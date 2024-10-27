FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

#here you define process.env variable
ENV PORT=8080
ENV MONGO_URI="mongodb://mongodb:27017/saunaTemps"

#port on which docker listens
EXPOSE 8080

CMD ["npm", "start"]