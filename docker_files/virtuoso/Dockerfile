FROM ubuntu:18.04

ENV VIRTUOSO_COMMIT 17c4ba1d5825822d8380ef8d9f978e2d57f4768f

RUN apt-get update \
    && apt-get install -y build-essential autotools-dev autoconf automake unzip wget net-tools libtool flex bison gperf gawk m4 libssl-dev libreadline-dev openssl crudini \
    # Workaround for #663
    && apt-get install -y libssl1.0-dev \
    && wget https://github.com/openlink/virtuoso-opensource/archive/${VIRTUOSO_COMMIT}.zip \
    && unzip ${VIRTUOSO_COMMIT}.zip \
    && rm ${VIRTUOSO_COMMIT}.zip \
    && cd virtuoso-opensource-${VIRTUOSO_COMMIT} \
    && ./autogen.sh \
    && export CFLAGS="-O2 -m64" && ./configure --disable-bpel-vad --enable-conductor-vad --enable-fct-vad --disable-dbpedia-vad --disable-demo-vad --disable-isparql-vad --disable-ods-vad --disable-sparqldemo-vad --disable-syncml-vad --disable-tutorial-vad --with-readline --program-transform-name="s/isql/isql-v/" \
    && make && make install \
    && ln -s /usr/local/virtuoso-opensource/var/lib/virtuoso/ /var/lib/virtuoso \
    && ln -s /var/lib/virtuoso/db /data \
    && cd .. \
    && rm -r /virtuoso-opensource-${VIRTUOSO_COMMIT} \
    && apt remove --purge -y build-essential autotools-dev autoconf automake unzip wget net-tools libtool flex bison gperf gawk m4 libssl-dev libreadline-dev \
    && apt autoremove -y \
    && apt autoclean

ENV PATH /usr/local/virtuoso-opensource/bin/:$PATH

VOLUME /data
WORKDIR /data
EXPOSE 8890 1111

CMD virtuoso-t +wait +foreground
