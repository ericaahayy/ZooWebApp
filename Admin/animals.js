const front_end_url = "http://127.0.0.1:5500";
const back_end_url = "http://localhost:3100";
document.addEventListener("DOMContentLoaded", function () {
  let role = window.localStorage.getItem("role");
  if (role === undefined || role != 2)
    window.location.replace(front_end_url + "/Login/login.html");
  else
    fetch(back_end_url + "/admin/animaltable")
      .then((response) => response.json())
      .then((data) => load_animal_table(data["data"]));
});

let aleart_success = document.getElementById("aleart_success");

document
  .getElementById("animal_info_form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    const form = document.getElementById("animal_info_form");
    const formData = new FormData(form);

    // Convert the form data to a JSON object
    const jsonObject = {};
    formData.forEach((value, key) => {
      jsonObject[key] = value;
    });
    // console.log(jsonObject);
    if (jsonObject.enclosure === "Lion Habitat") {
      jsonObject.enclosure_id = 100;
    } else if (jsonObject.enclosure === "Elephant Zone") {
      jsonObject.enclosure_id = 101;
    } else if (jsonObject.enclosure === "Giraffe Exhibit") {
      jsonObject.enclosure_id = 102;
    } else if (jsonObject.enclosure === "Bird Aviary") {
      jsonObject.enclosure_id = 103;
    } else if (jsonObject.enclosure === "Jungle Cat") {
      jsonObject.enclosure_id = 104;
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
          insert_animal_row(data["data"]);
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
//insert row in animal table
function insert_animal_row(data) {
  const table = document.querySelector("table tbody");
  const isTableData = table.querySelector(".no-data");
  let animal_table = "<tr>";

  for (var key in data) {
    if (data.hasOwnProperty(key) && data[key].length > 50) {
      animal_table += `<td><img style="width: 5rem; height: 5rem;" src="${data[key]}" alt="picture of the animal"</td>`;
    } else if (data.hasOwnProperty(key)) {
      animal_table += `<td>${data[key]}</td>`;
    }
  }

  animal_table += `<td><button class="btn edit_btn" data-id=${data[key]} onclick="edit_animal(this)">Edit</button></td>`;
  animal_table += `<td><button class="btn delete_btn" data-id=${data[key]} onclick="deleteAnimalRow(this)">Delete</button></td>`;

  animal_table += "</tr>";

  if (isTableData) {
    table.innerHTML = animal_table;
  } else {
    const newRow = table.insertRow();
    newRow.innerHTML = animal_table;
  }
}

//load table when new animal is added
function load_animal_table(data) {
  const table = document.querySelector("table tbody");
  let animal_table = "";

  if (data.length === 0) {
    //insert no data table when there is no data
    table.innerHTML = "<tr><td class='no_data' colspan='10'>NO DATA</td></tr>";
    return;
  }
  data.forEach(function ({
    animal_id,
    image,
    animal_name,
    species,
    enclosure,
    age,
    gender,
    weight,
  }) {
    animal_table += "<tr>";
    animal_table += `<td>${animal_id}</td>`;
    animal_table += `<td><img class="animal_table_image" src="${image}" alt="picture of the animal"></td>`;
    animal_table += `<td>${animal_name}</td>`;
    animal_table += `<td>${species}</td>`;
    animal_table += `<td>${enclosure}</td>`;
    animal_table += `<td>${age}</td>`;
    animal_table += `<td>${gender}</td>`;
    animal_table += `<td>${weight}</td>`;
    animal_table += `<td><button class="btn edit_btn" data-id=${animal_id} onclick="edit_animal(this)">Edit</button></td>`;
    animal_table += `<td><button class="btn delete_btn" data-id=${animal_id} onclick="deleteAnimalRow(this)">Delete</button></td>`;
    animal_table += "</tr>";
  });
  table.innerHTML = animal_table;
}
//update animal
async function load_animal_by_id(id) {
  const res = await fetch(back_end_url + "/admin/get_animal_by_id/" + id, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  let data = await res.json();
  let animal = data.data[0];
  // console.log(animal);
  const form = document.querySelector("#animal_update_info_form");
  let elements = Array.from(form.elements);
  for (let element of elements) {
    if (animal[element.name]) element.value = animal[element.name];
  }
}

function edit_animal(object) {
  const id = object.getAttribute("data-id");
  const updateSection = document.querySelector("#update_form");
  const inputSection = document.querySelector("#input_form");
  inputSection.hidden = true;
  updateSection.hidden = false;
  load_animal_by_id(id);

  document
    .getElementById("animal_update_info_form")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent the default form submission
      const form = document.getElementById("animal_update_info_form");
      const formData = new FormData(form);
      // Convert the form data to a JSON object
      const jsonObject = {};
      formData.forEach((value, key) => {
        jsonObject[key] = value;
      });
      jsonObject.id = id;
      fetch(back_end_url + "/admin/update_animal", {
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
//delete animal
function deleteAnimalRow(object) {
  let id = object.getAttribute("data-id");
  //   console.log(id);
  fetch(back_end_url + "/admin/delete_animal_row/" + id, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        location.reload();
      }
    });
}
