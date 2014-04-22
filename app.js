var setup = false,
 api = "http://notify-me.net/api/index.php/sms",
 token;

// A generic onclick callback function.
function genericOnClick(info, tab) {
  if (setup){
    sendSMS(info,tab);
  }else{
    setupToken();
  }
}

function sendSMS(info, tab){
    var message = "Selected text from:"+tab.title+"\n("+tab.url+")\n\n"
      + info.selectionText;
    // var sms = api.replace("{message}", encodeURIComponent(message)).replace('{token}',token);
    var req = new XMLHttpRequest();
    req.open("POST", api, true);
    req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    req.send("token="+token+"&sms="+encodeURIComponent(message));
}

function setupToken(){
    var temptoken = window.prompt("Enter the token obtained from NotifyMe","Follow the tutorial on http://blog.notify-me.net/post/81997548208/simple-sms-gateway");
    chrome.storage.sync.set({token : temptoken});
    updateToken();
}

var contexts = ["selection"];

function updateToken(){
  chrome.storage.sync.get('token', function(map){
    console.log(map);
    if (map.token){
      token = map.token;
      setup = true;
    }else{
      setupToken()
    }
  });
}
updateToken();
chrome.contextMenus.create({"title": "Send to mobile", "contexts": contexts,
                                       "onclick": genericOnClick});
