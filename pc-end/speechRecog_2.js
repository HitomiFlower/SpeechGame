// 音声認識機能
var recognition;

// 音声認識中か否かのフラグ
var nowRecognition = false;

// 音声認識を開始するメソッド
function start () {
  // 音声認識のインスタンスを作成します
  recognition = new webkitSpeechRecognition();
  // 利用言語を選択します（Chromeでは日本語も使えます）
  recognition.lang = document.querySelector('#select1').value; // en-US or ja-JP
  // 音声認識が終了したら結果を取り出すためのコールバック
  recognition.onresult = function (e) {
    if (e.results.length > 0) {
      var value = e.results[0][0].transcript;
      document.querySelector('#area1').textContent = value;
    }
  };
  // 音声認識開始
  recognition.start();
  nowRecognition = true;
};

// 音声認識を停止するメソッド
function stop () {
  recognition.stop();
  nowRecognition = false;
}

// ボタンアクションを定義
document.querySelector('#btn1').onclick = function () {

  // unsupported.
  if (!'webkitSpeechRecognition' in window) {
    alert('Web Speech API には未対応です.');
    return;
  }

  if (nowRecognition) {
    // 音声認識終了
    stop();
    this.value = '音声認識を始める';
    this.className = '';
  } else {
    // 音声認識開始
    start();
    this.value = '音声認識を止める';
    this.className = 'select';
  }
}
