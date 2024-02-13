const front_end_url = "http://127.0.0.1:5500";
const back_end_url = "http://localhost:3100";
document.addEventListener("DOMContentLoaded", function () {
  let role = window.localStorage.getItem("role");
  if (role === undefined || role != 2)
    window.location.replace(front_end_url + "/Login/login.html");
  else
    fetch(back_end_url + "/admin/employeetable")
      .then((response) => response.json())
      .then((data) => load_employee_table(data["data"]));
});

let aleart_success = document.getElementById("aleart_success");

document
  .getElementById("employee_info_form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    const form = document.getElementById("employee_info_form");
    const formData = new FormData(form);

    // Convert the form data to a JSON object
    const jsonObject = {};
    formData.forEach((value, key) => {
      jsonObject[key] = value;
    });
    // console.log(jsonObject);
    if (jsonObject.department === "Anthropod") {
      jsonObject.department_id = 1;
    } else if (jsonObject.enclosure === "Amphibian") {
      jsonObject.department_id = 2;
    } else if (jsonObject.enclosure === "Bird") {
      jsonObject.department_id = 3;
    } else if (jsonObject.enclosure === "Fish") {
      jsonObject.department_id = 4;
    } else if (jsonObject.enclosure === "Reptile") {
      jsonObject.department_id = 5;
    }else if (jsonObject.enclosure === "Mammal") {
    jsonObject.department_id = 6;
  }


    fetch(back_end_url + "/admin/insert", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(jsonObject),
    })
      .then((response) => response.json())
      .then((data) => {
        if (Object.keys(data).length === 0) {
          alert("enclosure already full");
          location.reload();
          return;
        } else {
          insert_employee_row(data["data"]);
          event.target.reset();
          aleart_success.hidden = false;
          aleart_success.classList.add("fade_animate");
          setTimeout(() => {
            aleart_success.hidden = true;
            aleart_success.classList.remove("fade_animate");
          }, 2000);
        }
      });
  });
//insert row in employee table
function insert_employee_row(data) {
  const table = document.querySelector("table tbody");
  const isTableData = table.querySelector(".no-data");
  let employee_table = "<tr>";

  for (var key in data) {
    if (data.hasOwnProperty(key) && data[key].length > 50) {
      employee_table += `<td><img style="width: 5rem; height: 5rem;" src="${data[key]}" alt="picture of the employee"</td>`;
    } else if (data.hasOwnProperty(key)) {
      employee_table += `<td>${data[key]}</td>`;
    }
  }

  employee_table += `<td><button class="btn edit_btn" data-id=${data[key]} onclick="edit_employee(this)">Edit</button></td>`;
  employee_table += `<td><button class="btn delete_btn" data-id=${data[key]} onclick="deleteemployeeRow(this)">Delete</button></td>`;

  employee_table += "</tr>";

  if (isTableData) {
    table.innerHTML = employee_table;
  } else {
    const newRow = table.insertRow();
    newRow.innerHTML = employee_table;
  }
}

//load table when new employee is added
function load_employee_table(data) {
  const table = document.querySelector("table tbody");
  let employee_table = "";

  if (data.length === 0) {
    //insert no data table when there is no data
    table.innerHTML = "<tr><td class='no_data' colspan='10'>NO DATA</td></tr>";
    return;
  }
  data.forEach(function ({
    employee_id,
    mgr_id,
    department_id,
    ssn,
    first_name,
    last_name,
    phone_number,
    email,
    address,
    race,
    date_of_birth,
    gender,
    salary,
    start_date,
  }) {
    employee_table += "<tr>";
    employee_table += `<td>${employee_id}</td>`;
    employee_table += `<td>${mgr_id}</td>`;
    employee_table += `<td>${department_id}</td>`;
    employee_table += `<td>${first_name}</td>`;
    employee_table += `<td>${last_name}</td>`;
    employee_table += `<td>${gender}</td>`;
    employee_table += `<td>${race}</td>`
    employee_table += `<td>${date_of_birth}</td>`;
    employee_table += `<td>${ssn}</td>`;
    employee_table += `<td>${phone_number}</td>`;
    employee_table += `<td>${email}</td>`;
    employee_table += `<td>${address}</td>`;
    employee_table += `<td>${start_date}</td>`;
    employee_table += `<td>${salary}</td>`;
    employee_table += `<td><button class="btn edit_btn" data-id=${employee_id} onclick="edit_employee(this)">Edit</button></td>`;
    employee_table += `<td><button class="btn delete_btn" data-id=${employee_id} onclick="deleteemployeeRow(this)">Delete</button></td>`;
    employee_table += "</tr>";
  });
  table.innerHTML = employee_table;
}
//update employee
async function load_employee_by_id(id) {
  const res = await fetch(back_end_url + "/admin/get_employee_by_id/" + id, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  let data = await res.json();
  let employee = data.data[0];
  // console.log(employee);
  const form = document.querySelector("#employee_update_info_form");
  let elements = Array.from(form.elements);
  for (let element of elements) {
    if (employee[element.name]) element.value = employee[element.name];
  }
}

function edit_employee(object) {
  const id = object.getAttribute("data-id");
  const updateSection = document.querySelector("#update_form");
  const inputSection = document.querySelector("#input_form");
  inputSection.hidden = true;
  updateSection.hidden = false;
  load_employee_by_id(id);

  document
    .getElementById("employee_update_info_form")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent the default form submission
      const form = document.getElementById("employee_update_info_form");
      const formData = new FormData(form);
      // Convert the form data to a JSON object
      const jsonObject = {};
      formData.forEach((value, key) => {
        jsonObject[key] = value;
      });
      jsonObject.id = id;
      fetch(back_end_url + "/admin/update_employee", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(jsonObject),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            event.target.reset();
            //hide the update form and show the add form
            const updateSection = document.querySelector("#update_form");
            const inputSection = document.querySelector("#input_form");
            inputSection.hidden = false;
            updateSection.hidden = true;
            location.reload();
          }
          //reset the form input values
        });
    });
}
function cancel_update() {
  const updateSection = document.querySelector("#update_form");
  const inputSection = document.querySelector("#input_form");
  inputSection.hidden = false;
  updateSection.hidden = true;
}
//delete employee
function deleteEmployeeRow(object) {
  let id = object.getAttribute("data-id");
  //   console.log(id);
  fetch(back_end_url + "/admin/delete_employee_row/" + id, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        location.reload();
      }
    });
}
