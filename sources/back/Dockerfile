
# base image
FROM node:14

# set working directory
WORKDIR /back

# add `/app/node_modules/.bin` to $PATH
ENV PATH sources/back/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json sources/back/package.json
RUN npm install

# start app
CMD npm install ; npm start
