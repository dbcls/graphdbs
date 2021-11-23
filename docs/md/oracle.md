# Oracle

[ウェブサイト](https://www.oracle.com/jp/database/technologies/appdev/xe.html)

[参考](https://github.com/med2rdf/icgc/blob/master/README.md)

バージョン：18.4.0 XE

ライセンス：[Oracle Free Use Terms and Conditions](https://www.oracle.com/downloads/licenses/oracle-free-license.html)
([Permitted Features](https://docs.oracle.com/en/database/oracle/oracle-database/18/xelic/licensing-information.html#GUID-3BD43E8F-53C3-42F0-BBBD-B743FD41F951))

関連
 * [Setup RDF Graph Server with Autonomous Database](https://github.com/ryotayamanaka/setup_rdf_adb)

## Installation

Get Dockerfile to build Docker image of Oracle Database.

    $ mkdir oracle
    $ cd oracle
    $ git clone https://github.com/oracle/docker-images.git

Build docker image (needs 4GB memory).

    $ cd ~/oracle/docker-images/OracleDatabase/SingleInstance/dockerfiles/18.4.0/
    $ docker build -t oracle/database:18.4.0-xe -f Dockerfile.xe .

Launch Oracle Database on a docker container.

    $ docker run --name oracle \
      -p 1522:1521 -e ORACLE_PWD=Welcome1 \
      -v $HOME:/host-home \
      oracle/database:18.4.0-xe

Once you got the message below, you can quit with Ctl+C.

    #########################
    DATABASE IS READY TO USE!
    #########################

### Configuration

Start the conteiner.

    $ docker start oracle

Configure the database as a triplestore.

    $ docker exec -it oracle \
      sqlplus sys/Welcome1@XEPDB1 as sysdba @/host-home/icgc/scripts/setup.sql

Create a user.

    $ docker exec -it oracle \
      sqlplus sys/Welcome1@XEPDB1 as sysdba @/host-home/icgc/scripts/00_user.sql
