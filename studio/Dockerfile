ARG BUILD_NODE_IMAGE
ARG PROD_NODE_IMAGE

FROM $BUILD_NODE_IMAGE AS build

COPY package.json package-lock.json .npmrc /payever/
RUN cd /payever && npm ci --ignore-scripts

COPY . /payever
RUN cd /payever && npm run build

FROM $BUILD_NODE_IMAGE AS dependency

COPY package.json package-lock.json .npmrc /payever/
RUN cd /payever && npm ci --only=prod

FROM $PROD_NODE_IMAGE

RUN apk update --no-cache && apk add --no-cache ffmpeg

COPY --from=dependency /payever/node_modules /payever/node_modules
COPY --from=build /payever/dist /payever/dist
COPY . /payever
COPY ./deploy /payever/deploy
RUN chmod 755 /payever/deploy -R

ARG CI_COMMIT_SHA

RUN echo $CI_COMMIT_SHA && echo $CI_COMMIT_SHA > /payever/version
