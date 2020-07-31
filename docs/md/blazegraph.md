# Blazegraph

ウェブサイト
* https://blazegraph.com/

Quick start
* https://github.com/blazegraph/database/wiki/Quick_Start

本記事の対象バージョン：2.1.6 (2020/02/04リリース)
    
ライセンス
* オープンソース (GPL2.0ライセンス)

その他必要条件
* Java 9以上


## Installation

 * Blazegraph のリポジトリから最新リリースのjarファイルをダウンロードする(https://github.com/blazegraph/database/releases)。
  * 以下は wget でダウンロードする例。
```
wget https://github.com/blazegraph/database/releases/download/BLAZEGRAPH_2_1_6_RC/blazegraph.jar
```
 * ダウンロードされたjarファイルを、以下のコマンドで実行する
  * 実行するとWebサーバが起動するので、http://localhost:9999/ でアクセスできる
  * `Go to http://<自分のサーバのIP>/blazegraph/` のような表示も出るが、こちらでもアクセス可能
```
java -server -Xmx4g -jar <downloaded_dir>/blazegraph.jar
```

 * データをロードするにはブラウザ内で、Updateタブを選択して以下のようなコマンドを入れて下の方のUpdateボタンをクリックする。
```
load <file:///path/to/your.ttl>
```
 * 実行すると、一番下に小さく`Running update...`と表示されるので完了するまで待つ。

 * クエリを実行する場合は、Queryタブに移動してクエリを入力後、Executeボタンをクリックして実行できる。
