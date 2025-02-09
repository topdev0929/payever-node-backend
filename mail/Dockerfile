ARG BUILD_NODE_DEBIAN_IMAGE
ARG PROD_NODE_DEBIAN_IMAGE
ARG CI_COMMIT_SHA

FROM $PROD_NODE_DEBIAN_IMAGE AS build

COPY package.json package-lock.json .npmrc /payever/
RUN cd /payever && npm ci --ignore-scripts

COPY . /payever
RUN cd /payever && npm run build


FROM $PROD_NODE_DEBIAN_IMAGE AS dependency
ENV DEBIAN_FRONTEND=noninteractive
RUN apt update && apt install -y build-essential python

COPY package.json package-lock.json .npmrc /payever/
RUN cd /payever && npm ci --only=prod

FROM $PROD_NODE_DEBIAN_IMAGE
COPY --from=dependency /payever/node_modules /payever/node_modules
COPY --from=build /payever/dist /payever/dist
COPY . /payever
RUN apt-get update && \
    DEBIAN_FRONTEND='noninteractive' apt-get install -y wget libnss3-dev libgdk-pixbuf2.0-dev libgtk-3-dev libxss-dev \
    libdbus-glib-1-2 multiarch-support libpci-dev libc6-dev libxt6 flatpak libatk1.0 libatk1.0-data libgtk2.0 libgtk2.0-common \
    libgstreamer1.0 libopus0 libxslt1.1 libwoff1 libgstreamer-plugins-base1.0-0 libgstreamer-gl1.0-0 \
    libgstreamer-plugins-bad1.0-0 libopenjp2-7 libwebpdemux2 libasound2 xvfb

RUN echo $CI_COMMIT_SHA && echo $CI_COMMIT_SHA > /payever/version
