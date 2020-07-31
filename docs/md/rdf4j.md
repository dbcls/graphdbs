# RDF4j

ウェブサイト

    https://rdf4j.org/
    
本記事の対象バージョン
    
    3.3.0

ライセンスなど

    オープンソース（Eclipse Distribution License (EDL), v1.0.）
    
必要なもの
    
    Java と Tomcat のインストール


## Installation

### Webサーバとして実行する場合

RDFJ Server and Workbenchを使う

* まず、https://rdf4j.org/download/ からRDF4J 3.3.0 SDK (zip) をダウンロード

* zipファイルを解凍後、war/rdf4j-*.warをTomcatのwebappsディレクトリに以下にコピーする。
  * 例えばTomcat のインストール先が/opt/tomcatなら以下のようなコマンドでコピーできる
```
cp rdf4j-*.war /opt/tomcat/webapps/
```

* ブラウザから、`http://localhost:8080/rdf4j-workbench`にアクセスするとトップページが表示される。
  * Repositories -> New repository から、IDとタイトルなどを入力してリポジトリを作成する。
  * リポジトリ作成後、Modify->Addからファイルをアップロードしてデータをインポートできる。
 

### Java プログラムから使用する場合

* TBA
