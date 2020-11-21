# Neo4j

[ウェブサイト](https://neo4j.com/)

[インストールマニュアル](https://neo4j.com/docs/operations-manual/current/installation/)
    
本記事の対象バージョン
* 4.1.0 Communiti Edition

ライセンスなど
* オープンソース（Community Editionに限る。GPL v3）
    
必要なもの
* Java のインストール

## Installation (Ubuntu 18.04の場合)

[参考](https://neo4j.com/docs/operations-manual/current/installation/linux/debian/)

 * Neo4jのパッケージリポジトリを追加する
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
 * localhost:7474にアクセスするとNeo4j Browserが立ち上がるはず。
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
 * Neo4jを再起動する
```
sudo service neo4j restart
```

 
### NeoSemanticsを使用する場合
 * NeoSemanticsはRDFデータを変換しつつNeo4jにインポートできるようになるNeo4jプラグイン
 * まずNeoSemanticsのjarをダウンロード
```
wget https://github.com/neo4j-labs/neosemantics/releases/download/4.1.0.1/neosemantics-4.1.0.1.jar
```
 * これをNeo4jのpluginsフォルダに移動
```
sudo mv neosemantics-4.1.0.1.jar /var/lib/neo4j/plugins/
```
 * Neo4jの再起動
```
sudo service neo4j restart
```
 * うまくいっていれば、Neo4j Browser上で`call dbms.procedures()`というコマンドの実行結果の中に、n10sから始まるものが含まれているはず。
 * 早速データをロード・・・する前に、Resourceのuriにユニーク制約を張っておく

```
CALL n10s.graphconfig.init();
```
```
CREATE CONSTRAINT n10s_unique_uri ON (r:Resource)
ASSERT r.uri IS UNIQUE
```

[参考](https://neo4j.com/docs/labs/nsmntx/current/config/)

 * あとはn10s.rdf.import.fetchでデータをロードする。リモートのデータをロードする場合はurlの指定をhttp:// から始める。ローカルのデータをロードする場合はfile:// から始めれば良い。以下は/home/user_name/file_name.ntをロードする場合の例。

```
CALL n10s.rdf.import.fetch(
  'file:///home/user_name/file_name.nt',
  'Turtle'
)
```

 * ロードする際にはプレフィックスを省略表記にするかなどをオプションで設定できる。
 * 設定できるオプションの一覧は以下URLを参照
   * https://neo4j.com/docs/labs/nsmntx/current/reference/
 * 例えば、次のような形で指定可能
 
```
CALL n10s.graphconfig.init({
  handleVocabUris: 'MAP'
})
```
