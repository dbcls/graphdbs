# Oracle

[ウェブサイト](https://www.oracle.com/jp/database/technologies/appdev/xe.html)

 * [参考1](https://github.com/med2rdf/icgc/blob/master/README.md) (RDFの利用)
 * [参考2](https://github.com/ryotayamanaka/setup_pg_docker) (PGの利用)
 * [参考3](https://github.com/ryotayamanaka/setup_rdf_adb) (Oracle Cloudの利用)

バージョン：18.4.0 XE

ライセンス：[Oracle Free Use Terms and Conditions](https://www.oracle.com/downloads/licenses/oracle-free-license.html)
([Permitted Features](https://docs.oracle.com/en/database/oracle/oracle-database/18/xelic/licensing-information.html#GUID-3BD43E8F-53C3-42F0-BBBD-B743FD41F951))


## Installation

### Docker版を利用

Get Dockerfile to build Docker image of Oracle Database (needs 4GB memory).

    $ git clone https://github.com/oracle/docker-images.git
    $ cd docker-images/OracleDatabase/SingleInstance/dockerfiles/18.4.0/
    $ docker build -t oracle/database:18.4.0-xe -f Dockerfile.xe .

Launch Oracle Database on a docker container.

    $ docker run --name oracle -p 1521:1521 -e ORACLE_PWD=Welcome1 -v $HOME:/host-home oracle/database:18.4.0-xe

Once you got the message below, the database is ready (you can quit with Ctl+C).

    #########################
    DATABASE IS READY TO USE!
    #########################

Configure the database as a triplestore.

    $ docker exec -it oracle sqlplus sys/Welcome1@XEPDB1 as sysdba @/host-home/icgc/scripts/setup.sql

Create a user.

    $ docker exec -it oracle sqlplus sys/Welcome1@XEPDB1 as sysdba @/host-home/icgc/scripts/00_user.sql
