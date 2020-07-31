# Fuseki

ウェブサイト

    https://jena.apache.org/documentation/fuseki2/
    
クイックスタート

    https://jena.apache.org/documentation/fuseki2/fuseki-quick-start.html
    
本記事の対象バージョン
    
    3.16.0 (2020/07/09リリース)

ライセンスなど

    オープンソース（Apache 2.0 ライセンス）
    
必要なもの
    
    Java と Tomcat のインストール

## Installation

* https://jena.apache.org/download/ からFusekiを探してダウンロード
  * 例えば、wget で 3.16.0 をダウンロードする場合、以下のようにする
```
wget https://ftp.yz.yamagata-u.ac.jp/pub/network/apache/jena/binaries/apache-jena-fuseki-3.16.0.tar.gz
```

* 解凍したフォルダ内で、以下のコマンドを実行するとサーバが立ち上がるので、Webブラウザ上で`http://localhost:3030`からアクセスできるようになる。
```
./fuseki-server
```

  * デフォルトではlocalhost 以外からのアクセスが一部禁止されている（トップページは表示されるが、データセットのロードができない）ため、ホストの外からアクセスしたい場合は `./run/shiro.ini` の以下の行をコメントアウトする。
```
/$/** = localhostFilter
```


* データセットをロードするには、ブラウザからアクセスしたあと、manage datasetsメニューのadd new datasetタブから好きな名前とDataset typeを選んでDatasetを作成する。その後、datasetメニューに移動してupload filesタブからファイルをアップロードできる。
 


### Tomcatを使う場合

 * ダウンロードしたtarファイルを解凍後、中に入っているfuseki.warをTomcatのwebapps ディレクトリにコピーする
   * 例えば、Tomcatのインストールディレクトリが`/opt/tomcat/` なら
```
cp ./fuseki.war /opt/tomcat/webapps/
```

 * fusekiの実行に/etc/fuseki が必要らしいので、ディレクトリを作成してからtomcatのユーザに権限を付与する
```
sudo mkdir /etc/fuseki && sudo chgrp tomcat /etc/fuseki && sudo chown tomcat /etc/fuseki
```

 * これで、ブラウザから http://localhost:8080/fuseki でアクセスできるようになる。
   * デフォルトではlocalhost 以外からのアクセスが一部禁止されている（トップページは表示されるが、データセットのロードができない）ため、ホストの外からアクセスしたい場合は `/ets/fuseki/shiro.ini` の以下の行をコメントアウトする。
```
/$/** = localhostFilter
```
