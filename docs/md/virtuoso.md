# Virtuoso

[ウェブサイト](http://vos.openlinksw.com/owiki/wiki/VOS)

バージョン
* 7.2.5.1 (2018/08/15)

ライセンス
* GPLv2

その他必要条件
* automake, libtool, gperf (インストールされていない場合はaptでインストールする)

## Installation
* ソースを取得
```
git clone git@github.com:openlink/virtuoso-opensource.git
cd virtuoso-opensource
git checkout v7.2.5.1
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

### Troubleshooting
./configure で OpenSSLに関するエラーが出ることがある。この場合は、libssl1.0-dev をインストールする。
```
sudo apt install -y libssl1.0-dev
```
Ubuntu 20.04 LTSでは、パッケージ libssl1.0-dev が見つからないことがある。この場合は、/etc/apt/sources.list の末尾に以下を追加して apt update を行う。
```
deb http://security.ubuntu.com/ubuntu bionic-security main
```
```
sudo apt update
sudo apt install -y libssl1.0-dev
```

## Configuration
デフォルトから設定を変更したい場合
* 設定ファイルの編集
```
vi /path/to/install/directory/var/lib/virtuoso/db/virtuoso.ini
```
問い合わせによって、virtuoso-temp.dbのサイズが肥大化していくことがある。その場合、virtuoso.iniの中でTempAllocationPct(virtuoso.dbに対して、何％まで許容するか)を設定する。[参照](http://docs.openlinksw.com/virtuoso/dbadm/)
```
TempAllocationPct        = 100
```

## Miscellaneous

### X-SPARQL-MaxRowsについて
* クエリの結果が`ResultSetMaxRows`(デフォルト10000)で切れた場合は、レスポンスヘッダーに`X-SPARQL-MaxRows: 10000`が設定される。
* クエリの末尾を`OFFSET 10000 LIMIT 10000`と修正して再度投げると、次の10000件を取得することができる。
* `X-SPARQL-MaxRows`が現れなくなくなるまで`OFFSET`をずらしていけば、全件を取得することができる。

### VALUESに与える要素の最大数について
Virtuosoソースコード`libsrc/Wi/sparql_core.c`に`0xFFF`(=4095)とハードコーディングされている。

VALUESに与える要素の数が4095以上のとき、下記のようなエラーが返される。
```
Error: 400
Virtuoso 37000 Error SP030: SPARQL compiler, line 0: Too many arguments of a standard built-in function in operator()
```

以下は、実験的に最大値を増やしてみた際の記録である。

**変更1**

`libsrc/Wi/sparql_core.c`で以下の部分をコメントアウトする。
```
      if (argcount > sbd->sbd_maxargs)
        sparyyerror_impl (sparp, NULL, t_box_sprintf (100, "Too many arguments of a standard built-in function %s()", sbd->sbd_name));
```

1万要素でも渡せる。

**変更2**

要素数をさらに増やすと、以下のエラーに遭遇する。
```
Error: 400 Bad Request
Virtuoso 37000 Error SP031: SPARQL: Internal error: The length of generated SQL text has exceeded 10000 lines of code
```
`libsrc/Wi/sparql2sql.h`で以下の部分を削除する。
```
    if (SSG_MAX_ALLOWED_LINE_COUNT == ssg->ssg_line_count++) \
      spar_sqlprint_error_impl (ssg, "The length of generated SQL text has exceeded 10000 lines of code"); \
```
すると、さらに以下のエラーが出る。
```
Error: 500 Internal Server Error
Virtuoso ..... Error SQ200: Query too large, variables in state over the limit
```

**変更3**

`libsrc/Wi/wi.h`で以下の部分を修正する。
```
#ifdef LARGE_QI_INST
#define MAX_STATE_SLOTS 0xffffe
#else
#define MAX_STATE_SLOTS 0xfffe
#endif
```
`MAX_STATE_SLOTS`を`0xffffe`にする(16倍にする)。

すると以下のエラーが出る。
```
Error: 500 Internal Server Error
Virtuoso 42000 Error SQ199: Maximum size (32767) of a code vector exceeded by 3967441 bytes. Please split the code in smaller units.
```

**変更4**

`libsrc/Wi/sqlexp.c`の以下の部分をコメントアウトする。
```
      if (BOFS_TO_OFS (byte_len) > SHRT_MAX)
	{
	  sqlc_new_error (sc->sc_cc, "42000", "SQ199",
	      "Maximum size (%ld) of a code vector exceeded by %ld bytes. "
	      "Please split the code in smaller units.", (long) SHRT_MAX, (long) (byte_len - SHRT_MAX));
	}
```
以上4カ所の修正で、結果的には、数万から10万要素でも答えが返ってくるようになる. ただし数万以上ともなると急激に遅くなり、何分もかかる。
