var currentDate = new Date();
var formattedDate = currentDate.toISOString().split('T')[0];
document.getElementById('date').value = formattedDate;
if( localStorage.getItem("Date") != null){
  document.getElementById('date').value = localStorage.getItem("Date");
  formattedDate = localStorage.getItem("Date");
}

var newDate;
var newFlag = false;
var presentFlag = false;
var absentFlag = false;

function setDate(event){
// event.target.value = formattedDate;
// formattedDate = event.target.value.toISOString().split('T')[0];
formattedDate = event.target.value;
localStorage.setItem("Date",event.target.value);
console.log(formattedDate);
  newFlag = true;
}

var user;
var pass;
var mob;
var count;
var data;
var count2;
var data2;
var added;

const request = window.indexedDB.open('StudentData', 1);

request.onerror = function (event) {
  // Handle errors
};

request.onsuccess = function (event) {
  const db = event.target.result;
  const transaction = db.transaction(['StudentTable'], 'readonly');
  const objectStore = transaction.objectStore('StudentTable');

  const getAllRequest = objectStore.getAll();

  getAllRequest.onsuccess = function (event) {
    data = event.target.result;
    count = data.length;

    // Function to retrieve all admins from the database
    function getAllAdmins() {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction("StudentTable", "readonly");
        const objectStore = transaction.objectStore("StudentTable");
        const request = objectStore.getAll();

        request.onsuccess = function (event) {
          const admins = event.target.result;
          resolve(admins);
        };

        request.onerror = function (event) {
          reject(event.target.error);
        };
      });
    }

    getAllAdmins()
      .then(Students => {
        data = Students;

        const request = window.indexedDB.open('AttendenceData', 1);

        request.onerror = function (event) {
          // Handle errors
        };

        request.onupgradeneeded = function (event) {
          const db = event.target.result;
          const objectStore = db.createObjectStore('AttendenceTable', { keyPath: 'id', autoIncrement: true });
        };

        request.onsuccess = function (event) {
          const db = event.target.result;
          const transaction = db.transaction(['AttendenceTable'], 'readwrite');
          const objectStore = transaction.objectStore('AttendenceTable');

          const getAllRequest = objectStore.getAll();
          // Perform operations on the object store (e.g., add, delete, update)
          getAllRequest.onsuccess = function (event) {
            const temp = event.target.result;
            data2 = temp;
              count2 = temp.length;
          }
          function assign(rollno, status) {
            const transaction = db.transaction(['AttendenceTable'], 'readwrite');
            const objectStore = transaction.objectStore('AttendenceTable');
            const getAllRequest = objectStore.getAll();
            if(formattedDate == null){
            newDate = formattedDate;}
            const attendeceData = {
              Date: formattedDate,
              RollNo: rollno,
              Status: status
            }
            if (count2 == 0) {
              objectStore.add(attendeceData);
              window.location.reload();
            }
            for (let index = 0; index < count2; index++) {
              if(data2[index].Date == formattedDate && data2[index].RollNo == rollno){
                added = true;
                objectStore.delete(data2[index].id);
                objectStore.put(attendeceData);
                // window.location.reload();
                break;
              }else{ added = false; }
            }
            if(added == false){
              objectStore.add(attendeceData);
              // window.location.reload();
              
            }
            }
            


            for (let index = 0; index < count; index++) {
              let key = data[index].Rollno;
              let Fullname = data[index].Fullname;
              let Email = data[index].Email;
              let Mobile = data[index].PhoneNumber;
              let Gender = data[index].Gender;

              const tableBody = document.querySelector("#local-storage-table tbody");
              const row = document.createElement("tr");
              const valueCell = document.createElement("td");
              const valueCell2 = document.createElement("td");
              const valueCell3 = document.createElement("td");
              const valueCell4 = document.createElement("td");
              const valueCell5 = document.createElement("td");
              const buttonCell = document.createElement("td");

             

              const button = document.createElement("button");
              button.innerText = "Assign";
              button.classList.add("styled-button");
              buttonCell.appendChild(button);

              const button2 = document.createElement("button");
              button2.innerText = "Check";
              button2.style.marginLeft = "10px";
              button2.classList.add("styled-butto");
              buttonCell.appendChild(button2);

              button2.addEventListener("click", function () {
                localStorage.setItem("RollNo", key);
                window.location.replace("../individualAttendence/iAttendence.html");
              })

              button.addEventListener("click", function () {
                const popup = document.createElement("div");
                popup.style.position = "fixed";
                popup.classList.add("popup");

                let str = `Attendence
                Name : ${Fullname}
                Roll No : ${key}
                ${document.getElementById('date').value} \n\n `
                popup.innerText = str;

                const button1 = document.createElement("button");
                button1.id = "button1";
                button1.innerText = "Present";
                button1.classList.add("styled-button");
                popup.appendChild(button1);
                button1.style.marginRight = "5px";

                button1.addEventListener("click", function () {
                  var button = document.getElementById("button2");
                  button.style.display = "none";
                  assign(key,"P");
                  document.body.removeChild(popup);
                  localStorage.setItem("RollNo", key);
                })

                const button2 = document.createElement("button");
                button2.id = "button2";
                button2.innerText = "Absent";
                button2.classList.add("styled-button2");
                popup.appendChild(button2);

                button2.addEventListener("click", function () {
                  var button = document.getElementById("button1");
                  button.style.display = "none";
                  assign(key,"A");
                  document.body.removeChild(popup);
                  localStorage.setItem("RollNo", key);
                })

                const button3 = document.createElement("button");
                button3.id = "button3";
                button3.innerText = "Close";
                button3.classList.add("styled-button3");
                popup.appendChild(button3);
                button3.style.marginLeft = "5px";

                button3.addEventListener("click", function () {
                  var button = document.getElementById("button1");
                  button.style.display = "none";
                  document.body.removeChild(popup);
                  
                })

                // Add the popup to the document body
                document.body.appendChild(popup);

                //           // Show the popup
                popup.classList.add("show");

                //           // Hide the popup when clicked outside
                // document.addEventListener("click", function (event) {
                //   if (!popup.contains(event.target) && event.target !== button) {
                //     //               // Remove the popup from the document body
                //     // document.body.removeChild(popup);
                //   }
                // });
              });

              valueCell.innerText = key;
              valueCell2.innerText = Fullname
              valueCell3.innerText = Email
              valueCell4.innerText = Mobile
              valueCell5.innerText = Gender

              row.appendChild(valueCell);
              row.appendChild(valueCell2);
              row.appendChild(valueCell3);
              row.appendChild(valueCell4);
              row.appendChild(valueCell5);
              row.appendChild(buttonCell);
              tableBody.appendChild(row);

            }
          };
        })
      .catch(error => {
        console.error("Error retrieving admins", error);
      });
  };

};


// Event handler for database errors
request.onerror = function (event) {
  console.error("Error opening database", event.target.error);
};






function filterByName() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("name");
  filter = input.value.toUpperCase();
  table = document.getElementById("local-storage-table");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function navigate() {
  window.location.replace('../createaccount/createaccount.html');
}

function logOut() {
  window.location.replace('../index.html');
}

function filterByRollNo() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("rollNo");
  filter = input.value.toUpperCase();
  table = document.getElementById("local-storage-table");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}
