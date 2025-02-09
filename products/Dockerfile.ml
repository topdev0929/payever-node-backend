FROM nvidia/cuda:11.2.2-cudnn8-devel-ubuntu18.04

COPY . /payever
RUN chmod 755 /payever/deploy -R
COPY ./deploy /payever/deploy

ENV TZ=Europe/Berlin
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt update && apt install -y software-properties-common && apt update && \
    add-apt-repository ppa:deadsnakes/ppa -y && apt install -y wget curl build-essential checkinstall
RUN apt install -y libreadline-gplv2-dev libncursesw5-dev libssl-dev libsqlite3-dev \
    tk-dev libgdbm-dev libc6-dev libbz2-dev libffi-dev zlib1g-dev
RUN cd /opt && wget https://www.python.org/ftp/python/3.9.16/Python-3.9.16.tgz && \
    tar xzf Python-3.9.16.tgz && cd Python-3.9.16 && ./configure --enable-optimizations && \
    make altinstall && ln -s /usr/local/bin/python3.9 /usr/local/bin/python && curl https://bootstrap.pypa.io/get-pip.py | python


WORKDIR /payever/model
RUN pip install -r requirements.txt --root-user-action=ignore

ARG CI_COMMIT_SHA
RUN echo $CI_COMMIT_SHA && echo $CI_COMMIT_SHA > /payever/version
