FROM node:lts-alpine 

WORKDIR /app 

COPY . . 
COPY . .

COPY package*.json ./

COPY client/package*.json client/
RUN npm install-client --omit=dev

COPY server/package*.json server/
RUN npm run install-server --omit=dev

COPY client/ client/
RUN npm run build --prefix client 

COPY server/ server/

USER node 

CMD ["npm","start","--prefix","server"]

EXPOSE 8000