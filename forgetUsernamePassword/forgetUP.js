var mobile;
var OTP;
var teleUser;
var data;
var count;

window.onload = document.getElementById("verify").style.background = "gray";
function onInput(){
    teleUser = document.getElementById('username').value;
    mobile = document.getElementById('mobile').value;
    validation();
}
function validation(){
  var color = document.getElementById("verify").style.color;
    if(teleUser.length >= 4 && mobile.length == 10 ){
      console.log("if");
      document.getElementById("verify").disabled = false;
    document.getElementById("verify").style.background = color;
    }else{
      document.getElementById("verify").style.background = "gray";
      document.getElementById("verify").disabled = true;
    }
}



  function navigate(){
    window.location.replace('../index.html');
  }

function otpWindow(){
  let url = "https://api2.callmebot.com/txt/login.php";
  window.open(url, "_blank");
  openNewWindow();
}

function generateRandomText(length) {
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var text = "";
  for (var i = 0; i < length; i++) {
    var randomIndex = Math.floor(Math.random() * characters.length);
    text += characters.charAt(randomIndex);
  }
  return text;
}

function openNewWindow() {
  var username = teleUser;
  var customText = generateRandomText(4);
  OTP = customText;
  var url = "https://api.callmebot.com/text.php?user=@" + username + "&text=" + encodeURIComponent(customText);
  fetch(url)
    .then(function(response) {
      // Handle the response
      console.log("Request sent successfully.");
    })
    .catch(function(error) {
      // Handle any errors
      console.log("Error sending the request:", error);
    });
}

function Verify(){
  let str = '';
  console.log(data);
  for (let index = 0; index < count; index++) {
   if(document.getElementById('mobile').value == data[index].mobile ){
      str = `username: ${data[index].username}
    password: ${data[index].password}`
   }
    
  }
  if(OTP == document.getElementById('otp').value){
    var username = teleUser;
  var customText = str;
  var url = "https://api.callmebot.com/text.php?user=@" + username + "&text=" + encodeURIComponent(customText);
  fetch(url)
    .then(function(response) {
      // Handle the response
      console.log("Request sent successfully.");
    })
    .catch(function(error) {
      // Handle any errors
      console.log("Error sending the request:", error);
    });
  } 
}

const request = window.indexedDB.open('AdminData', 1);

request.onerror = function (event) {
  // Handle errors
};

request.onsuccess = function (event) {
  const db = event.target.result;
  const transaction = db.transaction(['Admins'], 'readonly');
  const objectStore = transaction.objectStore('Admins');

  const getAllRequest = objectStore.getAll();

  getAllRequest.onsuccess = function (event) {
    data = event.target.result;
    count = data.length;
  }}