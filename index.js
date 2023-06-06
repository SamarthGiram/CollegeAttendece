window.onload = document.getElementById("login").style.background = "gray";

let inputUser;
let inputPass;
let inputMobile;
let mobileValidator = false;

function onInput() {
    inputUser = document.getElementById('username').value;
    inputPass = document.getElementById('password').value;
    inputMobile = document.getElementById('mobile').value;
    if (inputMobile.length == 10 && inputMobile.length < 11) {
        mobileValidator = true;
    }else{
        mobileValidator = false;
    }
    validation();
}
function validation() {
    var color = document.getElementById("login").style.color;
    if (mobileValidator == true && inputUser.length > 3 && inputPass.length > 7) {
        btndisable = false;
        document.getElementById("login").disabled = false;
        document.getElementById("login").style.background = color;
    }else{
        document.getElementById("login").disabled = true;
        document.getElementById("login").style.background = "gray";
    }
}


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

var user;
var pass;
var mob;
var count;
var data;
// Event handler for successful database opening
request.onsuccess = function (event) {
    const db = event.target.result;

    // Function to add an admin to the database
    //   function addAdmin(username, password, mobile) {
    //     const transaction = db.transaction("Admins", "readwrite");
    //     const objectStore = transaction.objectStore("Admins");

    //     const admin = {
    //       username: username,
    //       password: password,
    //       mobile: mobile
    //     };

    //     const request = objectStore.add(admin);

    //     request.onsuccess = function() {
    //       console.log("Admin added successfully");
    //     };

    //     request.onerror = function(event) {
    //       console.error("Error adding admin", event.target.error);
    //     };
    //   }


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
};

// Event handler for database errors
request.onerror = function (event) {
    console.error("Error opening database", event.target.error);
};

function logins() {
    setTimeout(() => {
        for (let index = 0; index < count; index++) {
            if (
                data[index].mobile == document.getElementById('mobile').value &&
                data[index].username == document.getElementById('username').value &&
                data[index].password == document.getElementById('password').value
            ) {
                window.location.replace('./listStudents/liststudents.html');
            } else {
                var errorMessage = "Credentials are invalid";
                document.getElementById("error-message").textContent = errorMessage; // Set error message
                document.getElementById("error-message").style.backgroundColor = "Red";
            }
        }
    }, 300);
}
