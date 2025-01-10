FROM node:16-alpine
RUN mkdir node
COPY . /usr/app
WORKDIR /usr/app
# USER node
RUN npm install 
EXPOSE 3000
CMD ["npm", "start"]