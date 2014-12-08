var https = require('https');
var fs = require('fs');
var ws = require('ws').Server;

var CHROME_PORT = 12001;
var UNITY_PORT = 12002;

var certification = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

//Chrome
var server = https.createServer(certification, function(req,res){
  fs.readFile('test.html', function(err,data){
    if(err){
      res.writeHead(500);
      res.end("Internal Server Error");
    }else{
      res.writeHead(200);
      res.end(data.toString());
    }
  })
});
server.listen(CHROME_PORT);

//Unity
var unityWebSockets = [];
var chromews;
var unityServer = new ws({port: UNITY_PORT});
unityServer.on('connection', function(ws){
  console.log('Unity connected');
  ws.send('You have connected');
  unityWebSockets.push(ws);
  //Receive command from Unity
  ws.on('message', function(info){
    try{
      chromews.send(info);
      console.log(info);
    }catch(e){
      console.error('Please open the chrome');
    }
  })
  ws.on('close', function(){
    console.log('Unity not connected');
    chromews.send('info_stop');
    unityWebSockets.splice(unityWebSockets.indexOf(ws), 1);
  })
})

//Get Result
var chromeVoiceRecogServer = new ws({server: server});
chromeVoiceRecogServer.on('connection', function(ws){
  console.log('Chrome connected');
  chromews = ws;
  ws.on('message', function(word){
    console.log('Recognized:' + word);
    unityWebSockets.forEach(function(unityWebSocket){
      unityWebSocket.send(word);
    })
  } ).on('close', function(){
    console.log('Chrome disconneted');
  })
})
