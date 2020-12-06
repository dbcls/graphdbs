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

 
### NeoSemanticsを使用する場合
 * NeoSemanticsはRDFデータを変換しつつNeo4JにインポートできるようになるNeo4Jプラグイン
 * まずNeoSemanticsのjarをダウンロード
```
wget https://github.com/neo4j-labs/neosemantics/releases/download/4.1.0.1/neosemantics-4.1.0.1.jar
```
 * これをNeo4Jのpluginsフォルダに移動
```
sudo mv neosemantics-4.1.0.1.jar /var/lib/neo4j/plugins/
```
 * Neo4Jの再起動
```
sudo service neo4j restart
```
 * うまくいっていれば、Neo4J Browser上で`call dbms.procedures()`というコマンドの実行結果の中に、n10sから始まるものが含まれているはず。
 * 早速データをロード・・・する前に、Resourceのuriにユニーク制約を張っておく

```
CREATE CONSTRAINT n10s_unique_uri ON (r:Resource)
ASSERT r.uri IS UNIQUE
```

 * また、ロードする前にconfigを初期化しておく必要があるのでn10s.graphconfig.initを呼び出す。
 * ロードする際にプレフィックスを省略表記にするかなどをオプションで設定できる。
 * 設定できるオプションの一覧は以下URLを参照
   * https://neo4j.com/docs/labs/nsmntx/current/reference/
 * 例えば、次のような形で指定可能
 
```
CALL n10s.graphconfig.init({
  handleVocabUris: 'MAP'
})
```


 * あとはn10s.rdf.import.fetchでデータをロードする。リモートのデータをロードする場合はurlの指定をhttp:// から始める。ローカルのデータをロードする場合はfile:// から始めれば良い。以下は/home/user_name/file_name.ntをロードする場合の例。

```
CALL n10s.rdf.import.fetch(
  'file:///home/user_name/file_name.nt',
  'Turtle'
)
```

### curlでクエリを実行する方法（実行時間を計測したい場合など）
 * コマンドラインのスクリプトから起動する場合など、curlでクエリを実行したい場合にはcurlの`-d`オプション（`--data`オプション）にクエリを指定して、`/db/data/transaction/commit`に対して実行すればよい。
   * 例えば、以下のようなスクリプトを手元に用意する。名前は仮に`curl_cypher.sh`とする。
```
query=$(cat $1 | tr -d '\n')
param="{ \"statements\": [ {\"statement\": \"$query\"}]}"
curl -o $2 -X POST -H 'Content-type: application/json;charset=utf-8' -d "$param"  'http://localhost:7474/db/data/transaction/commit' 
```
   * また、サンプルのクエリとして以下のようなファイルを、sample_query.cypとして保存する。
```
MATCH (n) RETURN n LIMIT 10
```
   * その後、`sh ./curl_cypher.sh sample_cypher.cyp`のようにして実行することで、結果がJSON形式で表示される。
     * 実行時間を計測したい場合は、`time sh ./curl_cypher.sh sample_cypher.cyp`のようにすればよい。

 * なおNeo4j BrowserやNeo4j Consoleを使用する場合、一応クエリごとの実行時間は表示してくれるが、これはあまり信用してはいけないらしい（以下のURLで don’t rely on that exact timing though ）
   * https://neo4j.com/developer/neo4j-browser/
   * Enterprise版だと、dbms.logs.query.*のようなオプションが用意されている。



