FROM mhart/alpine-node

WORKDIR /app

COPY package*.json ./

RUN apk --no-cache add --virtual builds-deps build-base python

# Install project dependencies
RUN npm install

COPY . .

EXPOSE 8081

CMD ["npm", "start"]