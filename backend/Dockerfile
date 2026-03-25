FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV MONGODB_URI=mongodb://mongodb:27017/mini-lms
ENV PORT=3000

CMD ["npm", "start"]