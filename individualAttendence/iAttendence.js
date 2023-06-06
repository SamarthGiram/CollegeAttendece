var StudentData;
var StudentCount;
var StudentName;
var StudentGender;
var StudentCell;
var StudentMail;

var presentCount = 0;
var attendeceDatalength;
var TotalDays;
var curMonth;
var curYear;

// Sudent Data
const request2 = window.indexedDB.open('StudentData', 1);

request2.onerror = function (event) {
  // Handle errors
};

request2.onsuccess = function (event) {
  const db = event.target.result;
  const transaction = db.transaction(['StudentTable'], 'readonly');
  const objectStore = transaction.objectStore('StudentTable');

  const getAllRequest = objectStore.getAll();

  getAllRequest.onsuccess = function (event) {
    StudentData = event.target.result;
    StudentCount = StudentData.length;

  }
}



// get Data by roll no
var rollNo = localStorage.getItem("RollNo");
var attendeceData = 0;

// Attendence Data
const request = window.indexedDB.open('AttendenceData', 1);

request.onerror = function (event) {
  // Handle errors
};

request.onsuccess = function (event) {
  const db = event.target.result;
  const transaction = db.transaction(['AttendenceTable'], 'readonly');
  const objectStore = transaction.objectStore('AttendenceTable');

  const getAllRequest = objectStore.getAll();

  getAllRequest.onsuccess = function (event) {
    attendeceData = event.target.result;
    attendeceDatalength = attendeceData.length;
    const newData = {

    }
    for (let index = 0; index < attendeceData.length; index++) {
      if (rollNo == attendeceData[index].RollNo) {
        let tempDate = attendeceData[index].Date;
        let tempStatus = "lol";
        if (attendeceData[index].Status == "P" && attendeceData[index].Date.includes("2023-06")) { tempStatus = "present"; presentCount++ }
        else { tempStatus = "absent" }
        newData[tempDate] = tempStatus;
      }
    }

    // totalDays = daysInMonth;

    // Sample data for present and absent dates
    // const data = {
    //     "2023-06-01": "present",
    //     "2023-06-02": "absent",
    //     "2023-06-05": "present",
    //     "2023-06-07": "absent",
    //     "2023-06-08": "present",
    // ... and so on
    //   };

    // Function to generate the month graph
    function generateMonthGraph() {
      const graphContainer = document.getElementById("graph");
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const daysInMonth = new Date(year, month, 0).getDate();
      curYear = year;
      curMonth = month;
      TotalDays = daysInMonth;

      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
        const status = newData[date] || "unassigned";
        const dayElement = document.createElement("div");
        dayElement.classList.add("day", status);
        dayElement.innerText = day;
        graphContainer.appendChild(dayElement);
      }
    }

    const graphContainer2 = document.getElementById("green");
    const dayElement2 = document.createElement("div");
    dayElement2.classList.add("green");
    dayElement2.innerText ="Present";
    graphContainer2.appendChild(dayElement2);

    const graphContainer3 = document.getElementById("green");
    const dayElement3 = document.createElement("div");
    dayElement3.classList.add("absent");
    dayElement3.innerText = "Absent";
    graphContainer3.appendChild(dayElement3);

    const graphContainer1 = document.getElementById("green");
    const dayElement1 = document.createElement("div");
    dayElement1.classList.add("unassigned");
    dayElement1.innerText = "Unassigned";
    graphContainer1.appendChild(dayElement1);

    // Call the function to generate the month graph
    generateMonthGraph();

    const ProfileCard = (() => {
      const profile = document.querySelector('.profile-img');
      const name = document.querySelector('.name');
      const location = document.querySelector('.location');
      const description = document.querySelector('.description');
      const phone = document.querySelector('.phone');
      const cell = document.querySelector('.cell');
      const email = document.querySelector('.email');
      const totalDays = document.querySelector('.tDays');
      const presentDays = document.querySelector('.pDays');
      const perecentage = document.querySelector('.Percent');

      return {
        setData: function (data) {
          // let fullname = `${data.name.first} ${data.name.last}`;
          // let origin = `${data.location.city}, ${data.nat}`;

          // profile.src = data.picture.large;
          // name.textContent = fullname;
          // location.textContent = origin;
          // description.textContent = `Hello, i'm ${fullname} from ${origin}. To learn more about me, my username is` +
          // `${data.login.username}. Feel free to email me at ${data.email} !`;
          // phone.textContent = data.phone;
          // cell.textContent = data.cell;
          // email.textContent = data.email;
          for (let index = 0; index < StudentCount; index++) {
            if (StudentData[index].Rollno == parseInt(rollNo)) {
              StudentName = StudentData[index].Fullname;
              StudentCell = StudentData[index].PhoneNumber;
              StudentGender = StudentData[index].Gender;
              StudentMail = StudentData[index].Email;
            }
          }
          
          if(curMonth < 10){ curMonth = "0"+curMonth}
          var dayCount = 0;
          var currentMonth = curYear +"-"+ curMonth;
          
          for (let index = 0; index < attendeceDatalength; index++) {
            if (attendeceData[index].Date.includes(currentMonth) && attendeceData[index].RollNo == rollNo) {
              dayCount = dayCount + 1;
            }
          }

          profile.src = `../images/${rollNo}.png`;
          name.textContent = StudentName;
          location.textContent = rollNo;
          phone.textContent = StudentCell;
          cell.textContent = StudentGender;
          email.textContent = StudentMail;
          totalDays.textContent = parseInt(TotalDays);
          presentDays.textContent = dayCount;
          let tempx = dayCount /parseInt(TotalDays) * 100;
          perecentage.textContent = tempx.toFixed(2)+"%";

        }
      }
    })();

    fetch('https://randomuser.me/api/?results=1')
      .then((resp) => resp.json())
      .then((data) => {
        ProfileCard.setData(data.results[0]);
      });


  }
}

function navigate() {
  window.location.replace("../listStudents/liststudents.html")
}


