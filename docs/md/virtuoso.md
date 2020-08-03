# Virtuoso

[ウェブサイト](http://vos.openlinksw.com/owiki/wiki/VOS)

バージョン
* 7.2.5.1 (2018/08/15)

ライセンス
* GPLv2

その他必要条件
* automake, libtool, gperf (インストールされていない場合はaptでインストールする)

## インストール
* ソースを取得
```
git clone git@github.com:openlink/virtuoso-opensource.git
cd virtuoso-opensource
git checkout v7.2.0.1
```
* コンパイル
```
./autogen.sh
./configure --prefix=/path/to/install/directory --with-readline
make
make install
```
ポート1111を既に使用していると、makeの途中で失敗する。（テストに1111を使おうとするため）

configure に --with-port=1112 オプションを付けるなどすれば失敗を回避できるかもしれないが、1111を空けておくのが確実。
* 起動
```
cd /path/to/install/directory/var/lib/virtuoso/db/
/path/to/install/directory/bin/virtuoso-t +wait
```
http://localhost:8890/sparql でSPARQLエンドポイントが起動していることを確認する。
* ロード
データの取得
```
curl -LOR http://example.com/example.ttl
```
```
isql 1111 dba dba
SQL> DB.DBA.TTLP_MT(file_to_string_output('example.ttl'), '', 'http://example.com/example.ttl', 0);
```

## 設定変更
デフォルトから設定を変更したい場合
* 設定ファイルの編集
```
vi /path/to/install/directory/var/lib/virtuoso/db/virtuoso.ini
```

## トラブルシューティング
./configure で OpenSSLに関するエラーが出ることがある。この場合は、libssl1.0-dev をインストールする。
```
sudo apt install -y libssl1.0-dev
```
新しいUbuntuでは、パッケージ libssl1.0-dev が見つからないことがある。この場合は、/etc/apt/sources.list の末尾に以下を追加して apt update を行う。
```
deb http://security.ubuntu.com/ubuntu bionic-security main
```
```
sudo apt update
sudo apt install -y libssl1.0-dev
```
