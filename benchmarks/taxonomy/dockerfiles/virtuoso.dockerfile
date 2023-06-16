FROM ubuntu:20.04

ENV VIRTUOSO_VERSION 7.2.5.1
ENV SPANG_VERSION 2.4.8

RUN echo deb http://security.ubuntu.com/ubuntu bionic-security main >> /etc/apt/sources.list
RUN apt-get update && \
    apt-get install -y --no-install-recommends wget unzip automake libtool flex bison gperf gawk libssl1.0-dev build-essential net-tools openssl && \
    wget --no-check-certificate https://github.com/openlink/virtuoso-opensource/archive/refs/tags/v${VIRTUOSO_VERSION}.zip && \
    unzip v${VIRTUOSO_VERSION}.zip && \
    cd virtuoso-opensource-${VIRTUOSO_VERSION} && \
    ./autogen.sh && \
    ./configure && \
    make && make install && \
    rm -r /v${VIRTUOSO_VERSION}.zip /virtuoso-opensource-${VIRTUOSO_VERSION} && \
    cd / && \
    wget --no-check-certificate https://github.com/sparqling/spang/archive/refs/tags/v${SPANG_VERSION}.zip && \
    unzip v${SPANG_VERSION}.zip && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y npm && \
    cd spang-${SPANG_VERSION} && npm install && npm link && \
    npm install -g n && n lts && \
    apt-get purge -y npm && \
    # apt-get autoremove -y && \
    rm /v${SPANG_VERSION}.zip

ENV PATH /work/bin:$PATH

WORKDIR /work

CMD ["run"]
