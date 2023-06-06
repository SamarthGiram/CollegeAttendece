let mobile;

async function TwilioNameLookup() {
    var myHeaders = new Headers();
myHeaders.append("apikey", "iTcC6eAK82uUzZRO8DDiKWzvl08bu8b1");
console.log(localStorage.getItem('mobile'));
var requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: myHeaders
};
const keys = Object.keys(localStorage);
        keys.forEach((key) => {
            if(document.getElementById('rollno').value == key){
                const values = localStorage.getItem(key).split(",");
                mobile = values[5].replace(/"mobile":|"/gi,'');
            }})
var no = mobile;
if (document.getElementById('mobile').value == no) {
    fetch("https://api.apilayer.com/number_verification/validate?number="+no, requestOptions)
  .then(response => response.text())
  .then(result =>{ console.log(result);})
  .catch(error => console.log('error', error));
    
} else {
    alert("Wrong mobile number.")
}

  }

  function navigate(){
    window.location.replace('../index.html');
  }

