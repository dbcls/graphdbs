# rdfstore-js

## Installation
* npmをインストール
      $ sudo apt install npm
* rdfstore-js で作業するためのディレクトリを作って移動
      $ mkdir ./rdfstore-js
      $ cd rdfstore-js
* npm を使って必要なパッケージをインストール
      $ npm install nodejs
      $ npm install rdfstore
* テキストエディタなどで、以下のようなファイルを作成する。ファイル名はtest.jsとする。
  * `/path/to/dataset.ttl`はロードしたいttlファイルのパスに変更する。

```
const rdfstore = require('rdfstore');
const fs = require('fs');

rdfstore.create(function(err, store){
  const rdf = fs.createReadStream('/path/to/dataset.ttl');
  store.load('text/turtle', rdf, function(s,d){
    console.log(s,d);
    store.execute("SELECT * WHERE { ?s ?p ?o } LIMIT 10",
      function(success, results){
        console.log(success, results);
      });
  });
});
```
* ファイル作成後、以下のコマンドで実行する。
     $ node test.js
