import { back_end_url, front_end_url } from "../Helper/location_link.js";

const wrapper = document.querySelector(".wrapper");
const loginLink = document.querySelector(".login-link");
const registerLink = document.querySelector(".register-link");

registerLink.addEventListener("click", () => {
  wrapper.classList.add("active");
});

loginLink.addEventListener("click", () => {
  wrapper.classList.remove("active");
});

document
  .getElementById("user_login")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("log_username").value;
    const password = document.getElementById("log_password").value;
    const log_error = document.getElementById("log_error");
    try {
      fetch(back_end_url + "/api/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            log_error.innerHTML = "Username or Password not match";
            throw new Error("Username or Password not match");
          }
          return response.json();
        })
        .then((data) => {
          log_error.innerText = "";
          let { username, role, customer_id } = data.data[0];
          window.localStorage.setItem("role", role);
          window.localStorage.setItem("username", username);
          window.localStorage.setItem("customer_id", customer_id);
          if (role === 2)
            window.location.replace(front_end_url + "/Admin/animals.html");
          else window.location.replace(front_end_url + "/Main/main.html");
        });
    } catch (error) {
      document.getElementById("log_error").innerHTML =
        "Username or Password not match";
      console.error(error);
    }
  });

document
  .getElementById("user_reg")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const username = document.getElementById("reg_username").value;
    const password = document.getElementById("reg_password").value;
    const role = 1;
    const confirm_password = document.getElementById(
      "reg_confirm_password"
    ).value;
    const reg_error = document.getElementById("reg_error");
    const reg_success = document.getElementById("reg_success");
    reg_error.innerHTML = "";
    reg_success.innerHTML = "";

    if (password !== confirm_password) {
      reg_error.innerHTML = "Password not match";
      return;
    }

    const res = await fetch(back_end_url + "/user/register", {
      method: "POST",
      body: JSON.stringify({ username, password, role }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (!res.ok) {
      reg_error.innerHTML = data.message;
    } else {
      reg_success.innerHTML = "Register Successfully";
      event.target.reset();
      location.reload();
    }
  });
