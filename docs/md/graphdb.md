# GraphDB

## Installation
 * GrahDBのフリーエディションを使用するため、サイト上でユーザ登録をする https://www.ontotext.com/products/graphdb/graphdb-free/
 * ユーザ登録が完了すると、登録したメールアドレスにインストール用バイナリのダウンロード用リンクが送られてくる
 * Download as a stand-alone serverのリンクをクリックしてダウンロード（Desktop installationではない方）
 * ダウンロード後、zipを解凍してそのフォルダへ移動

       $ cd path/to/unzipped/folder

 * GraphDBをワークベンチモードで起動

       $ sudo ./bin/graphdb

 * ブラウザで localhost:7200 にアクセスすると、GraphDBのホーム画面がが表示される
 * 新しいリポジトリを作るため、左のメニューから、Setup->Repositories->Create new repositoryと選択する
 * リポジトリのIDを入力し、最下部のCreateをクリック
 * ターミナル上で、以下のコマンドを実行して ttl データをインポート
 
       $ sudo ./loadrdf -f -i <repository_name> -m parallel <path to dataset>

 * インポートが完了したら、ブラウザに戻り左のメニューからSPARQLをクリックする
 * リポジトリのリストが表示されるのでリポジトリを選択する
 * SPARQLのエディタが表示されるのでSPARQLを入力後、RUNで実行できる
