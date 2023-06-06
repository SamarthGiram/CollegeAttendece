function navigate() {
  window.location.replace('../index.html');
}

window.onload = document.getElementById("create").style.background = "gray";
let inputUser;
let inputPass;
let inputMobile;
let mobileValidator = false;
let btndisable = true;


function onInput() {
  inputUser = document.getElementById('Username').value;
  inputPass = document.getElementById('Password').value;
  inputMobile = document.getElementById('PhoneNumber').value;
  if (inputMobile.length == 10 && inputMobile.length < 11) {
    mobileValidator = true;
  } else {
    mobileValidator = false;
  }
  validation();
}
function validation() {
  flag = false;
  document.getElementById("error-message").textContent = null;
  document.getElementById("error-message").style.backgroundColor = "white";
  var color = document.getElementById("create").style.color;
  if (mobileValidator == true && inputUser.length > 3 && (inputPass).length > 7) {
    btndisable = false;
    document.getElementById("create").disabled = false;
    document.getElementById("create").style.background = color;
  } else {
    document.getElementById("create").disabled = true;
    document.getElementById("create").style.background = 'gray';
  }

}

var count = 0;
var data;
var flag = false;

function openDatabaseAndAddAdmin(u, p, m) {
  // Open the database
  const request = indexedDB.open("AdminData", 1);

  // Event handler for the database creation or upgrade
  request.onupgradeneeded = function (event) {
    const db = event.target.result;

    // Create an object store named "Admins" with auto-incrementing key
      const objectStore = db.createObjectStore("Admins", { autoIncrement: true });

    // Create an index on the "username" property
      objectStore.createIndex("usernameIndex", "mobile", { unique: true });
  };

  // Event handler for successful database opening
  request.onsuccess = function (event) {
    const db = event.target.result;

    // Function to add an admin to the database
    function addAdmin(username, password, mobile) {
      const transaction = db.transaction("Admins", "readwrite");
      const objectStore = transaction.objectStore("Admins");

      const admin = {
        username: username,
        password: password,
        mobile: mobile
      };
      setTimeout(() => {
        if (count == 0) {
          const transaction = db.transaction("Admins", "readwrite");
          const objectStore = transaction.objectStore("Admins");
          const request = objectStore.add(admin);
          window.location.reload();
        }
        else {

          for (let index = 0; index < count; index++) {
            if (
              data[index].mobile === document.getElementById('PhoneNumber').value
            ) {
              var errorMessage = "Mobile Number present, Enter another";
              document.getElementById("error-message").textContent = errorMessage; // Set error message
              document.getElementById("error-message").style.backgroundColor = "Red";
              flag = true;
            }
          }
          if (flag == false) {
            const transaction = db.transaction("Admins", "readwrite");
            const objectStore = transaction.objectStore("Admins");
            const request = objectStore.add(admin);
            window.location.reload();
            console.log("It should reload");
          }
        }
      }, 300);

      request.onsuccess = function () {
        console.log("Admin added successfully");
      };

      request.onerror = function (event) {
        console.error("Error adding admin", event.target.error);
      };
    }



    // Function to retrieve all admins from the database
    function getAllAdmins() {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction("Admins", "readonly");
        const objectStore = transaction.objectStore("Admins");
        const request = objectStore.getAll();

        request.onsuccess = function (event) {
          const admins = event.target.result;
          count = admins.length;
          resolve(admins);
        };

        request.onerror = function (event) {
          reject(event.target.error);
        };
      });
    }

    getAllAdmins()
      .then(admins => {
        data = admins;
      })
      .catch(error => {
        console.error("Error retrieving admins", error);
      });

    addAdmin(u, p, m);
  };



  // Event handler for database errors
  request.onerror = function (event) {
    console.error("Error opening database", event.target.error);
  };
}

function add() {
  let user = document.getElementById('Username').value;
  let mobile = document.getElementById('PhoneNumber').value;
  let pass = document.getElementById('Password').value;
  openDatabaseAndAddAdmin(user, pass, mobile);
}