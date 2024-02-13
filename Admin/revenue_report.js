const front_end_url = "http://127.0.0.1:5500";
const back_end_url = "http://localhost:3100";

document.addEventListener("DOMContentLoaded", function () {
  let role = window.localStorage.getItem("role");
  if (role === undefined || role != 2)
    window.location.replace(front_end_url + "/Login/login.html");
  // else show_report();
  else get_all_purchse_history();
});

function get_all_purchse_history() {
  fetch(back_end_url + "/admin/get_all_purchase_history")
    .then((response) => response.json())
    .then((data) => load_report_table(data["data"]));
}
function load_report_by_type(type, element) {
  fetch(back_end_url + "/admin/load_report_by_type/" + type, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => load_report_table_type(data["data"], element));
}
function load_report_table_type(data, element) {
  let animal_table = "";
  // console.log(element);
  let table = element
    .getElementsByTagName("table")[0]
    .getElementsByTagName("tbody")[0];

  if (data.length === 0) {
    //insert no data table when there is no data
    table.innerHTML = "<tr><td class='no_data' colspan='6'>NO DATA</td></tr>";
    return;
  }

  data.forEach(function ({
    purchase_id,
    date_of_purchase,
    item_id,
    item_name,
    quantity,
    amount,
  }) {
    animal_table += "<tr>";
    animal_table += `<td>${purchase_id}</td>`;
    animal_table += `<td>${date_of_purchase}</td>`;
    animal_table += `<td>${item_id}</td>`;
    animal_table += `<td>${item_name}</td>`;
    animal_table += `<td>${quantity}</td>`;
    animal_table += `<td>$${amount}</td>`;
    animal_table += "</tr>";
  });
  animal_table += `<tr><td colspan='5'></td><td>Total: $${data[0].total_revenue}</td></tr>`;
  table.innerHTML = animal_table;
}
function load_report_table(data) {
  const table = document.querySelector("table tbody");
  let animal_table = "";

  data.forEach(function ({
    purchase_id,
    date_of_purchase,
    item_id,
    quantity,
    amount,
    item_name,
  }) {
    animal_table += "<tr>";
    animal_table += `<td>${purchase_id}</td>`;
    animal_table += `<td>${date_of_purchase}</td>`;
    animal_table += `<td>${item_id}</td>`;
    animal_table += `<td>${item_name}</td>`;
    animal_table += `<td>${quantity}</td>`;
    animal_table += `<td>$${amount}</td>`;
    animal_table += "</tr>";
  });
  animal_table += `<tr><td colspan='5'></td><td>Total: $${data[0].total_revenue}</td></tr>`;
  table.innerHTML = animal_table;
}

function show_report() {
  const selectedValue = document.getElementById("report_type").value;
  const reports = {
    total_revenue: {
      element: document.querySelector("#total_revenue"),
      type: "null",
    },
    gift_shop_sales: {
      element: document.querySelector("#gift_shop_sales"),
      type: "gift_shop",
    },
    membership_sales: {
      element: document.querySelector("#membership_sales"),
      type: "membership",
    },
    tickets_sales: {
      element: document.querySelector("#ticket_sales"),
      type: "tickets",
    },
  };

  // Hide all enclosures by default
  for (const key in reports) {
    reports[key].element.hidden = true;
  }

  // Show the selected enclosure
  const selectedEnclosure = reports[selectedValue];
  if (selectedEnclosure) {
    selectedEnclosure.element.hidden = false;
    if (selectedEnclosure.type != null)
      load_report_by_type(selectedEnclosure.type, selectedEnclosure.element);
    get_all_purchse_history();
  }
}
