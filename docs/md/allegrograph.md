# AllegroGraph

ウェブサイト

    https://allegrograph.com/products/allegrograph/

Quick Start

    https://franz.com/agraph/support/documentation/current/agraph-quick-start.html
    
本記事の対象バージョン
    
    7.0.0

ライセンスなど

    Free, Developer, Enterpriseの3形態あり。Free だと 5000,000 トリプルと3サーバまでの制限あり(https://allegrograph.com/allegrograph-editions/)
      
      
## Installation

 * 以下のURLに名前とメールアドレスを入力して、tarファイルをダウンロード

        https://franz.com/franz/agraph/ftp/pri/acl/ag/ag7.0.0/linuxamd64.64/agraph-7.0.0-linuxamd64.64.tar.gz.lhtml?l=agfree

 * tar ファイルを解凍後、解凍したフォルダに移動し、インストールしたいディレクトリを指定してインストール

 
        cd agraph-7.0.0
        sudo ./install-agraph /path/to/install/directory
 * インストールの際、いくつか質問されるので答えていく。ユーザ名とパスワード以外はデフォルトで良さそう。
   * ユーザ名とパスワードに関しては、後でデータセットをロードする時に必要になる。
   * ユーザはデフォルトだとagraphになるが、シェルのユーザ名と同じにしておくと良い。
 * インストールしたディレクトリに移動後、以下のコマンドでサーバを起動
     
        sudo ./bin/agraph-control --config ./lib/agraph.cfg start
 * ブラウザで、`http://127.0.0.1:10035` にアクセスする。
 * ユーザ名とパスワードを入力して、サインインする。
 * リポジトリを好きな名前で作成する。
 * コマンドラインに戻り、以下のコマンドでロードを行う。`repository_name`と`path/to/dataset`は適宜読み替える。（ブラウザ上のimport RDFからロードすることも可能）
        
        ./bin/agtool load repository_name path/to/dataset
 * ロード完了後、ブラウザ上でqueries のタブを選択し、クエリを入力して実行する。
 * 実行中のサーバを止めたい場合は、以下のコマンドを実行する。
         
        sudo ./bin/agraph-control --config ./lib/agraph.cfg stop
