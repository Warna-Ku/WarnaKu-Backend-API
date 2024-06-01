FROM node:18.20.3-alpine3.20

# Set environment variable
ENV PORT=8080

RUN mkdir -p /opt/app

WORKDIR /opt/app

COPY package*.json .

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 8080

CMD ["npm", "run", "start"] 