const front_end_url = "http://127.0.0.1:5500";
const back_end_url = "http://localhost:3100";
const currentDate = document.querySelector(".current-date"),
  daysTag = document.querySelector(".days"),
  prevNextIcon = document.querySelectorAll(".icons span");

let date = new Date(),
  currYear = date.getFullYear(),
  currMonth = date.getMonth();
let date_selected;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const renderCalendar = () => {
  let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(),
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(),
    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
  let liTag = "";

  for (let i = firstDayofMonth; i > 0; i--) {
    let d = `${currYear}-${currMonth}-${lastDateofLastMonth - i + 1}`;
    liTag += `
      <li class="inactive" date-data=${d} onclick="select_date(this)">
        ${lastDateofLastMonth - i + 1}
    </li>`;
  }

  for (let i = 1; i <= lastDateofMonth; i++) {
    let d = `${currYear}-${currMonth + 1}-${i}`;
    let isToday =
      i === date.getDate() &&
      currMonth === new Date().getMonth() &&
      currYear === new Date().getFullYear()
        ? "active"
        : "";
    if (isToday) date_selected = d;
    liTag += `<li class="${isToday}" date-data=${d} onclick="select_date(this)">${i}</li>`;
  }

  for (let i = lastDayofMonth; i < 6; i++) {
    let d = `${currYear}-${currMonth + 2}-${i - lastDayofMonth + 1}`;
    liTag += `<li class="inactive" date-data=${d} onclick="select_date(this)">${
      i - lastDayofMonth + 1
    }</li>`;
  }

  currentDate.innerText = `${months[currMonth]} ${currYear}`;
  daysTag.innerHTML = liTag;
  document.getElementById(
    "booking_selected_date"
  ).innerHTML = `Booking ticket for:   ${date_selected}`;
};
renderCalendar();

prevNextIcon.forEach((icon) => {
  icon.addEventListener("click", () => {
    currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

    if (currMonth < 0 || currMonth > 11) {
      date = new Date(currYear, currMonth);
      currYear = date.getFullYear();
      currMonth = date.getMonth();
    } else {
      date = new Date();
    }
    renderCalendar();
  });
});

function select_date(obj) {
  daysTag
    .querySelectorAll(".active")
    .forEach((element) => element.classList.remove("active"));
  obj.classList.add("active");
  date_selected = obj.getAttribute("date-data");
  document.getElementById(
    "booking_selected_date"
  ).innerHTML = `Booking ticket for:  ${date_selected}`;
}

function close_modal() {
  document.getElementById("modal").classList.remove("modal");
}

function open_modal() {
  document.getElementById("modal").classList.add("modal");
}
let ticket_price = {
  Adult: 15,
  Child: 5,
  Senior: 10,
};
let booking_tickets = [];

function check_out() {
  booking_tickets = [];
  if (window.localStorage.getItem("customer_id") === null) {
    alert("Please Login");
    return;
  }
  let adults_amount = parseInt(
    document.getElementById("ticket_booking_adult").value
  );
  let childs_amount = parseInt(
    document.getElementById("ticket_booking_child").value
  );
  let seniors_amount = parseInt(
    document.getElementById("ticket_booking_senior").value
  );
  if (adults_amount === 0 && seniors_amount === 0 && childs_amount === 0)
    return;
  //   open_modal();
  if (adults_amount != 0) {
    booking_tickets.push({
      type: "Adult",
      price: ticket_price["Adult"],
      date: date_selected,
      amount: adults_amount,
      item_id: 200,
    });
  }
  if (childs_amount != 0) {
    booking_tickets.push({
      type: "Child",
      price: ticket_price["Child"],
      date: date_selected,
      amount: childs_amount,
      item_id: 201,
    });
  }
  if (seniors_amount != 0) {
    booking_tickets.push({
      type: "Senior",
      price: ticket_price["Senior"],
      date: date_selected,
      amount: seniors_amount,
      item_id: 202,
    });
  }

  generate_ticket();
  handle_checkout_total();
  open_modal();
}

function generate_ticket() {
  let ticket_card_container = document.getElementById("ticket_card_container");
  ticket_card_container.innerHTML = "";
  for (let booking_ticket of booking_tickets) {
    for (let i = 0; i < booking_ticket.amount; i++) {
      ticket_card_container.innerHTML += `
                <div class="ticket_card">
                    <div class="ticket_left">
                        <div class="ticket_left_content">
                            <h5 class="ticket_title">T7 Zoo</h5>
                            <p>1 day pass</p>
                            <p class="ticket_date">${booking_ticket.date}</p>
                            <p class="ticket_price">Ticket price: $${booking_ticket.price}</p>
                        </div>
                    </div>
                    <div class="ticket_right">
                        <div class="ticket_barcode">
                            <p>${booking_ticket.type} Ticket</p>
                            <p class="barcode">aadee</p>
                        </div>
                    </div>
                </div>
            `;
    }
  }
}

function handle_checkout_total() {
  const ticket_checkout_info_prod = document.getElementById(
    "ticket_checkout_info_prod"
  );
  const ticket_checkout_info_price = document.getElementById(
    "ticket_checkout_info_price"
  );

  ticket_checkout_info_prod.innerHTML = "<h3>Product</h3>";
  ticket_checkout_info_price.innerHTML = "<h3>Total</h3>";
  let total = 0;
  for (let booking_ticket of booking_tickets) {
    let product = ticket_price[booking_ticket.type] * booking_ticket.amount;
    ticket_checkout_info_prod.innerHTML += `<div class="item">${booking_ticket.type} ticket x ${booking_ticket.amount}</div>`;
    ticket_checkout_info_price.innerHTML += `<div class="item">$${product}</div>`;
    total += product;
  }

  ticket_checkout_info_prod.innerHTML += `<div class="item">total</div>`;
  ticket_checkout_info_price.innerHTML += `<div class="item">$${total}</div>`;
}

async function confirm_checkout() {
  let success = true;
  let count = 0;
  let today1 = new Date();
  let date_of_purchase1 =
    today1.getFullYear() +
    "-" +
    ("0" + (today1.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + today1.getDate()).slice(-2);
  for (let booking_ticket of booking_tickets) {
    let { type, date, amount, item_id } = booking_ticket;
    // Insert into ticket
    const ticketResponse = await fetch(
      back_end_url + "/user/insert_into_ticket",
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          customer_id: parseInt(window.localStorage.getItem("customer_id")),
          ticket_type: type,
          quantity: amount,
          price: ticket_price[type],
          purchase_date: date_of_purchase1,
          ticket_date: date,
        }),
      }
    );

    count++;

    if (!ticketResponse.ok) {
      success = false;
      break; // Stop the loop if ticket insertion fails
    }

    // Insert into purchase history
    let today = new Date();
    let date_of_purchase =
      today.getFullYear() +
      "-" +
      ("0" + (today.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + today.getDate()).slice(-2);
    const historyResponse = await fetch(
      back_end_url + "/user/insert_into_purchase_history",
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          customer_id: parseInt(window.localStorage.getItem("customer_id")),
          date_of_purchase: date_of_purchase,
          item_id: item_id,
          quantity: amount,
          amount: ticket_price[type] * amount,
          item_name: type,
          item_from: "tickets",
        }),
      }
    );

    count++;

    if (!historyResponse.ok) {
      success = false;
      break; // Stop the loop if history insertion fails
    }
  }

  // Display alerts based on success
  if (success) {
    alert("Complete checkout");
  } else {
    alert("Server error");
  }

  // Reset input values and update UI
  document.getElementById("ticket_booking_adult").value = 0;
  document.getElementById("ticket_booking_child").value = 0;
  document.getElementById("ticket_booking_senior").value = 0;
  renderCalendar();
  close_modal();
  // add_to_history();
}

async function add_to_history() {
  let count = 0;
  for (let booking_ticket of booking_tickets) {
    let { type, amount, item_id } = booking_ticket;
    await fetch(back_end_url + "/user/insert_into_purchase_history", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        customer_id: parseInt(window.localStorage.getItem("customer_id")),
        item_id: item_id,
        date_of_purchase: new Date().toISOString().substring(0, 10),
        quantity: amount,
        price: ticket_price[type],
        ticket_type: type,
      }),
    }).then((response) => {
      count++;
      if (!response.ok) {
        success = false;
      } else {
        success = success && true;
      }
    });
  }
}
