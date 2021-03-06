# Stardog

[ウェブサイト](https://www.stardog.com/)
    
[Getting Started](https://www.stardog.com/docs/#_setting_path)

本記事の対象バージョン：7.3.2（2020/07/01リリース）

ライセンス
* 完全にフリーなライセンスは存在しないが、30日分の体験版、1年のアカデミックライセンスの体験版がある。


## Installation

* Stardogの最新版をダウンロードして解凍して移動
```
wget https://downloads.stardog.com/stardog/stardog-latest.zip
unzip stardog-latest.zip
cd stardog
```

* Stardogのサーバを起動。
```
./bin/stardog-admin server start
```

* 初回起動時にはライセンスに関する質問をされるので、利用規約への同意やメールアドレス、
Stardogから送られる情報をメールで受け取りたいかなどを聞かれるので、答える。

* この時点で5820番ポートでサーバが起動するが、このままの状態ではWebブラウザからアクセスしても何も表示されない。
 * GUIが必要な場合は、別途Stardog Studioをインストールする必要があるらしい https://www.stardog.com/studio/
 * なおデフォルトのユーザ名/パスワードはadmin/admin
 * コマンドライン上でクエリを実行できればいい場合は、以下を参照のこと。

* データのロードをしてDBを作るため、以下のようなコマンドを使用する。

```
./bin/stardog-admin db create -n myDB /path/to/some/data.ttl
```

* 名前付きグラフにロードしたい場合は、入力するRDFファイルの名前の前に@<グラフのURL>のようにする。以下はhttp://examples.org の例
```
./bin/stardog-admin db create -n myDB @http://examples.org /path/to/some/data.ttl
```

* クエリはコマンドライン上から以下のように実行できる
```
./bin/stardog query myDB "SELECT DISTINCT ?s WHERE { ?s ?p ?o } LIMIT 10"
```

* Web API越しにSPARQLを実行したい場合は http://localhost:5820/<DB名>/query に対してGETリクエストを送る
