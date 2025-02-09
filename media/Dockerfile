ARG BUILD_NODE_IMAGE
ARG PROD_NODE_IMAGE

FROM $BUILD_NODE_IMAGE AS build

COPY package.json package-lock.json .npmrc /payever/
RUN cd /payever && npm ci --ignore-scripts

COPY . /payever
RUN cd /payever && npm run build
RUN npm rebuild jpegtran-bin


FROM $BUILD_NODE_IMAGE AS dependency

COPY package.json package-lock.json .npmrc /payever/
RUN cd /payever && npm ci --only=prod
RUN npm rebuild jpegtran-bin

FROM $PROD_NODE_IMAGE

RUN apk update --no-cache && apk add --no-cache ffmpeg wget autoconf automake libtool build-base
RUN wget https://github.com/file/file/archive/refs/tags/FILE5_45.tar.gz -O /tmp/file.tar.gz \
    && cd /tmp \
    && tar -xzf file.tar.gz 
COPY js-magic-file /tmp/file-FILE5_45/magic/Magdir/javascript
RUN cd /tmp/file-FILE5_45 \
    && pwd \
    && aclocal \
    && autoreconf --install \
    && ./configure \
    && make \
    && make install \
    && rm -rf /tmp/file*

COPY --from=dependency /payever/node_modules /payever/node_modules
COPY --from=build /payever/dist /payever/dist
COPY . /payever

ARG CI_COMMIT_SHA

RUN echo $CI_COMMIT_SHA && echo $CI_COMMIT_SHA > /payever/version
