# PGX

本記事の対象バージョン
* 20.4.0

ライセンスなど
* [OTN license](https://www.oracle.com/downloads/licenses/standard-license.html)
    
必要なもの
* Java のインストール

## Installation
### Ubuntu 18.04の場合
 * 2021/1 現在、公式に配布されているのは rpm パッケージのみなので、Ubuntuにインストールするためにまず deb パッケージ に変換してからインストールする。
  * 参考：[https://phoenixnap.com/kb/install-rpm-packages-on-ubuntu]
```
sudo add-apt-repository universe
sudo apt-get update
sudo apt install alien
sudo alien --scripts oracle-graph-20.4.0.x86_64.rpm # --scriptsオプションをつけないとインストール時に権限周りで失敗する
sudo dpkg -i oracle-graph_20.4.0-1_amd64.deb 
```

 * インストール後、標準では `/opt/oracle/graph/` にインストールされる。とりあえずコマンドライン上で試すのであれば、bin/opg-jshell が試しやすい
```
sudo /opt/oracle/graph/bin/opg-jshell
```
  * `sudo systemctl start pgx` のようにしてサーバプロセスとして起動することもできるが、その場合 `/etc/oracle/graph/server.conf` や `/etc/oracle/graph/pgx.conf` にセキュリティ関係の設定を適切に編集する必要があるほか、Oracle DB などを IdentityProvider として使用する必要があるため割愛。
  
 * `opg-jshell` 内でPGQLを実行する場合は、例えば以下のようにする
```
opg-jshell> var G = session.readGraphWithProperties("/tmp/example.pgx.json") // 読み込みたいpgx 用の json を指定
G ==> PgxGraph[name=sample.pgx,N=554,E=1528,created=1612683135450]
opg-jshell> G.queryPgql("SELECT * MATCH (a)-[]->(b) LIMIT 10").print() // 任意のリレーションを最大10個取得して表示
```
