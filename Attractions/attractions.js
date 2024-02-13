document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:3100/admin/attractionstable")
    .then((response) => response.json())
    .then((data) => load_attraction_table(data["data"]));
});

let aleart_success = document.getElementById("aleart_success");

document
  .getElementById("attraction_info_form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    const form = document.getElementById("attraction_info_form");
    const formData = new FormData(form);

    // Convert the form data to a JSON object
    const jsonObject = {};
    formData.forEach((value, key) => {
      jsonObject[key] = value;
    });
    // console.log(jsonObject);
    fetch("http://localhost:3100/admin/insertattraction", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(jsonObject),
    })
      .then((response) => response.json())
      .then((data) => {
        insert_attraction_row(data["data"]);
        event.target.reset();
        aleart_success.hidden = false;
        aleart_success.classList.add("fade_animate");
        setTimeout(() => {
          aleart_success.hidden = true;
          aleart_success.classList.remove("fade_animate");
        }, 2000);
      });
  });
//insert row in animal table
function insert_attraction_row(data) {
  const table = document.querySelector("table tbody");
  const isTableData = table.querySelector(".no-data");
  let attraction_table = "<tr>";

  for (var key in data) {
    if (data.hasOwnProperty(key) && data[key].length > 50) {
      attraction_table += `<td><img style="width: 5rem; height: 5rem;" src="${data[key]}" alt="picture of the animal"</td>`;
    } else if (data.hasOwnProperty(key)) {
      attraction_table += `<td>${data[key]}</td>`;
    }
  }

  attraction_table += `<td><button class="btn edit_btn" data-id=${data[key]} onclick="edit_attraction(this)">Edit</button></td>`;
  attraction_table += `<td><button class="btn delete_btn" data-id=${data[key]} onclick="deleteAttractionRow(this)">Delete</button></td>`;

  attraction_table += "</tr>";

  if (isTableData) {
    table.innerHTML = attraction_table;
  } else {
    const newRow = table.insertRow();
    newRow.innerHTML = attraction_table;
  }
}

//load table when new animal is added
function load_attraction_table(data) {
  const table = document.querySelector("table tbody");
  let attraction_table = "";

  if (data.length === 0) {
    //insert no data table when there is no data
    table.innerHTML = "<tr><td class='no_data' colspan='10'>NO DATA</td></tr>";
    return;
  }
  data.forEach(function ({
    attraction_id,
    image,
    animal_name,
    exhibit_name,
    description,
    ride,
  }) {
    attraction_table += "<tr>";
    attraction_table += `<td><img style="width: 5rem; height: 5rem;" src="${image}" alt="picture of the animal"></td>`;
    attraction_table += `<td>${animal_name}</td>`;
    attraction_table += `<td>${exhibit_name}</td>`;
    attraction_table += `<td>${description}</td>`;
    attraction_table += `<td>${ride}</td>`;
    attraction_table += "</tr>";
  });
  table.innerHTML = attraction_table;
}
//update attraction
function edit_attraction(object) {
  const id = object.getAttribute("data-id");
  //   console.log(id);
  const updateSection = document.querySelector("#update_form");
  const inputSection = document.querySelector("#input_form");
  inputSection.hidden = true;
  updateSection.hidden = false;

  document
    .getElementById("attraction_update_info_form")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent the default form submission

      const form = document.getElementById("attraction_update_info_form");
      const formData = new FormData(form);
      // Convert the form data to a JSON object
      const jsonObject = {};
      formData.forEach((value, key) => {
        jsonObject[key] = value;
      });
      jsonObject.id = id;
      //   console.log(jsonObject);
      fetch("http://localhost:3100/admin/update_attraction", {
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
//delete animal
function deleteAttractionRow(object) {
  let id = object.getAttribute("data-id");
  //   console.log(id);
  fetch("http://localhost:3100/admin/delete_attraction_row/" + id, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        location.reload();
      }
    });
}
