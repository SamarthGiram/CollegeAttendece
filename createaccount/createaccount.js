var selectedGenderValue;
var gender;
function displayRadioValue() {
  var ele = document.getElementsByName('gender');
  for (i = 0; i < ele.length; i++) {
    if (ele[i].checked)
      gender = ele[i].value;
  }
  onInput();
}


window.onload = document.getElementById("register").style.background = "gray";
let inputName;
let inputRollno;
let inputMobile;
let inputEmail;
let mobileValidator = false;
let btndisable = true;

function onInput() {

  inputName = document.getElementById('Fullname').value;
  inputRollno = document.getElementById('rollno').value;
  inputMobile = document.getElementById('PhoneNumber').value;
  inputEmail = document.getElementById('Email').value;
  if (inputMobile.length == 10 && inputMobile.length < 11) {
    mobileValidator = true;
  } else {
    mobileValidator = false;
  }
  validation();
}
function validation() {
  let validMail = false;
  flag = false;
  document.getElementById("error-message").textContent = null; // Set error message
  document.getElementById("error-message").style.backgroundColor = "white";
  if (String(inputEmail).includes("@") && String(inputEmail).includes(".com")) {
    validMail = true;
  }
  var color = document.getElementById("register").style.color;
  if (mobileValidator == true && inputName.length > 8 && inputRollno.length == 3 && inputMobile.length == 10 && validMail == true) {
    btndisable = false;
    document.getElementById("register").disabled = false;
    document.getElementById("register").style.background = color;
  } else {
    document.getElementById("register").disabled = true;
    document.getElementById("register").style.background = 'gray';
  }
}

//********************************* */
function navigate() {
  window.location.replace('../index.html');
}


function navTolist() {
  window.location.replace('../listStudents/liststudents.html')
}

var data;
var count = 0;
var flag = false;

function openDatabaseAndAddAdmin(name, roll, mail, phone, gender) {
  
  const request = window.indexedDB.open('StudentData', 1);

  request.onerror = function (event) {
    // Handle errors
  };

  request.onupgradeneeded = function (event) {
    const db = event.target.result;
    const objectStore = db.createObjectStore('StudentTable', { keyPath: 'id', autoIncrement: true });
  };

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction(['StudentTable'], 'readwrite');
    const objectStore = transaction.objectStore('StudentTable');

    function addAdmin(name, roll, mail, phone, gender) {
      const transaction = db.transaction("StudentTable", "readwrite");
      const objectStore = transaction.objectStore("StudentTable");

      const Students = {
        Fullname: name,
        Rollno: roll,
        Email: mail,
        PhoneNumber: phone,
        Gender: gender
      };
      setTimeout(() => {
        if (count == 0) {
          const transaction = db.transaction("StudentTable", "readwrite");
          const objectStore = transaction.objectStore("StudentTable");
          const request = objectStore.add(Students);
          window.location.reload();
        }
        else {

          for (let index = 0; index < count; index++) {
            if (data[index].Rollno == document.getElementById('rollno').value
              || data[index].PhoneNumber == document.getElementById('PhoneNumber').value
              || data[index].Email == document.getElementById('Email').value) {
              console.log(data[index].Rollno);
              console.log(document.getElementById('rollno').value);
              console.log(data[index].PhoneNumber);
              console.log(document.getElementById('PhoneNumber').value);
              console.log(data[index].Email);
              console.log(document.getElementById('Email').value);
              var errorMessage = "Data already available, enter another rollNo/Email/mobile";
              document.getElementById("error-message").textContent = errorMessage; // Set error message
              document.getElementById("error-message").style.backgroundColor = "Red";
              flag = true;
              console.log(flag);
            }
          }
          if (flag == false) {
            const transaction = db.transaction("StudentTable", "readwrite");
            const objectStore = transaction.objectStore("StudentTable");
            const request = objectStore.add(Students);
            window.location.reload();
            console.log("It should reload");
          }
        }
      }, 300);

      request.onsuccess = function () {
        console.log("Student added successfully");
      };

      request.onerror = function (event) {
        console.error("Error adding Student", event.target.error);
      };
    }

    function getAllAdmins() {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction("StudentTable", "readonly");
        const objectStore = transaction.objectStore("StudentTable");
        const request = objectStore.getAll();

        request.onsuccess = function (event) {
          const Students = event.target.result;
          count = Students.length;
          resolve(Students);
        };

        request.onerror = function (event) {
          reject(event.target.error);
        };
      });
    }

    getAllAdmins()
      .then(Students => {
        data = Students;
      })
      .catch(error => {
        console.error("Error retrieving admins", error);
      });

    addAdmin(name, roll, mail, phone, gender);
  };

  // Event handler for database errors
  request.onerror = function (event) {
    console.error("Error opening database", event.target.error);
  };
    
  };


function add() {
  let name = document.getElementById('Fullname').value;
  let roll = document.getElementById('rollno').value;
  let mail = document.getElementById('Email').value;
  let phone = document.getElementById('PhoneNumber').value;
  openDatabaseAndAddAdmin(name, roll, mail, phone, gender);
}