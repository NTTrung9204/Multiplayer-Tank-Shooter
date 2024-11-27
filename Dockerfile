FROM node:18-alpine

WORKDIR /src

RUN apk add --no-cache make gcc g++ python3

RUN npm config set registry https://registry.npmjs.org

COPY package.json .

RUN npm install --only=production

COPY src/ .

CMD ["npx", "nodemon" , "src/index.js"]
