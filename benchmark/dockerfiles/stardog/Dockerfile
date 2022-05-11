FROM adoptopenjdk/openjdk11:alpine

WORKDIR /opt

RUN wget https://downloads.stardog.com/stardog/stardog-latest.zip && \
    unzip stardog-latest.zip && \
    rm stardog-latest.zip && \
    mv stardog-* stardog

RUN chmod a+x /opt/stardog/bin/stardog-admin

RUN apk add --no-cache bash util-linux procps net-tools busybox-extras less curl

ENV STARDOG_HOME /stardog-home

ENV PATH "/opt/stardog/bin:$PATH"

WORKDIR /stardog-home

ENTRYPOINT /opt/stardog/bin/stardog-admin server start --foreground
