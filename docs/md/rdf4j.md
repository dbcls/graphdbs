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

### コンソールからデータをロードする場合

* zipを解凍したフォルダ内の bin/console.sh を実行するとCUIが起動する。
  * まずサーバに接続
```
> connect http://localhost:8085/rdf4j-server
Disconnecting from default data directory
Connected to http://localhost:8085/rdf4j-server
```
  * 次にリポジトリを作成する。最初にリポジトリのタイプ（native, memoryなど）を選択してから、リポジトリ名など必要事項を入力する。デフォルトで良い場合は何も入力しない。
  
```
> create native
Please specify values for the following variables:
Repository ID [native]: 
Repository title [Native store]: 
Query Iteration Cache size [10000]: 
Triple indexes [spoc,posc]: 
EvaluationStrategyFactory [org.eclipse.rdf4j.query.algebra.evaluation.impl.StrictEvaluationStrategyFactory]: 
Repository created
```

  * なお、すでにリポジトリを作成済みの場合は`open <repository_name>`のようにすると開くことができる）
  
  * 最後に、loadコマンドでロードを行う。into以下は省略可能
```
> load <input_path> into <name_of_graph>
Loading data...
Data has been added to the repository (2565 ms)
```

### Java プログラムから使用する場合

* TBA
