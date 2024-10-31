FROM node:14

WORKDIR /front

ENV PATH sources/front/node_modules/.bin:$PATH

COPY package.json sources/front/package.json
RUN npm install
RUN npm install react-scripts@4.0.0 -g

CMD npm install ; npm start
