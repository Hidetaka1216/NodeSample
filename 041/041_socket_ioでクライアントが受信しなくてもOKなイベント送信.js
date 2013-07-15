/*
 * hello, world
 * IPなど設定：http://testcording.com/?p=1164
 */
/*
 * モジュール読み込み
 */
var http = require("http");
var fs = require("fs");
var socketio = require("socket.io");
var setting = require("./999_param.js");

/*
 * サーバの作成
 */
var server = http.createServer();
var io = socketio.listen(server);


/*
 * requestイベント受信時の処理(イベントハンドラ)を作成する
 */
server.on("request", function(req, res) {
	// 外部のHTMLデータを読み込み
	fs.readFile(
		"./041_client.html",
		function (err, data) {
			if (err) { throw err; }

			// HTTPレスポンスヘッダを作成・送信(200:OK,500:ServerError,404:NotFound)
			res.writeHead(200, {"Content-Type": "text/html; charset=UTF-8"});
			res.end(data);
		}
	);
});

/*
 * イベント待受状態を開始する
 */
server.listen(setting.PORT, setting.IP, setting.startServer);

/*
 * 通信時の処理
 * クライアント側がio.connect()を実行すると、サーバの以下処理が実行される(イベント名：connection)
 */
io.sockets.on("connection", function (socket) {
	// [myEvent]イベント発信(コールバック関数を登録:クライアントから呼び出し可能)
	// emitはバッファを使うので、ネットワークが不安定になると溜まり過ぎる場合がある
	socket.volatile.emit("myEvent", "誰かが接続しました。", function (data) {
		// クライアントから呼び出され、サーバで処理が実行される
		console.log("クライアント：" + data);
	});
});
