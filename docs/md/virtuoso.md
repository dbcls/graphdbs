# Virtuoso

## Installation
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
* 設定ファイルの編集
```
cd /path/to/install/directory
vi var/lib/virtuoso/db/virtuoso.ini
```
