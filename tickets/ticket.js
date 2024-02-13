const front_end_url = "http://127.0.0.1:5500";
const back_end_url = "http://localhost:3100";

document.addEventListener("DOMContentLoaded", function () {
  const id = parseInt(window.localStorage.getItem("customer_id"));
  fetch(back_end_url + "/user/load_ticket_history/" + id)
    .then((response) => response.json())
    .then((data) => {
      let role = window.localStorage.getItem("role");
      if (role != null && role === "1") {
        load_ticket_table(data["data"]);
      } else {
        window.location.replace(front_end_url + "/Login/login.html");
      }
    });
});

function load_ticket_table(data) {
  const table = document.querySelector("table tbody");
  let ticket_table = "";
  console.log(data);
  if (data.length === 0) {
    //insert no data table when there is no data
    table.innerHTML =
      "<tr><td class='no_data' colspan='4'>You don't have any tickets</td></tr>";
    return;
  }
  data.forEach(function ({
    purchase_date,
    ticket_date,
    ticket_type,
    quantity,
  }) {
    ticket_table += "<tr>";
    ticket_table += `<td>${purchase_date}</td>`;
    ticket_table += `<td>${ticket_date}</td>`;
    ticket_table += `<td>${ticket_type}</td>`;
    ticket_table += `<td>${quantity}</td>`;
    ticket_table += "</tr>";
  });
  table.innerHTML = ticket_table;
}
