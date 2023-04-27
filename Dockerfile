FROM node:19

WORKDIR /home/app
COPY ["package*.json", "./"]
RUN npm install --production

COPY . ./
RUN mv .env.default .env
RUN npm run build
CMD npm run start