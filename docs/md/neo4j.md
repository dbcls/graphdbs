# Neo4j

ウェブサイト
    https://neo4j.com/

インストール方法参考

    https://neo4j.com/docs/operations-manual/current/installation/
    
本記事の対象バージョン
    
    4.1.0 Communiti Edition

ライセンスなど

    オープンソース（Community Editionに限る。GPL v3）
    
必要なもの
    
    Java のインストール


## Installation (Ubuntu 18.04の場合)

 * 参考：https://neo4j.com/docs/operations-manual/current/installation/linux/debian/
 * Neo4Jのパッケージリポジトリを追加する
```
wget -O - https://debian.neo4j.com/neotechnology.gpg.key | sudo apt-key add -
echo 'deb https://debian.neo4j.com stable latest' | sudo tee -a /etc/apt/sources.list.d/neo4j.list
sudo apt-get update
```

 * aptでインストール
```
sudo apt-get install neo4j
```
 * Neo4jをサービスとして起動する
```
sudo service neo4j start
```
 * 停止する場合は以下のコマンド
```
sudo service neo4j stop
```
 * localhost:7474にアクセスするとNeo4J Browserが立ち上がるはず。
 * デフォルトだとユーザ名とパスワードは両方ともneo4jになっているので、これでログイン（ログイン後にパスワードの変更を求められる）

### 外部から接続したい場合
 * （以下を行うと、任意のホストからの接続を許可することになるので、セキュリティ上の問題が起きないよう注意すること）
 * /etc/neo4j/neo4j.confを開くと、以下のような記述があるので
```
#dbms.default_listen_address=0.0.0.0
```
 * コメントアウトを解除する
```
dbms.default_listen_address=0.0.0.0
```
 * Neo4Jを再起動する
```
sudo service neo4j restart
```
