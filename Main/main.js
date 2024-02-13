function hide_and_show() {
  let role = window.localStorage.getItem("role");
  if (role != null && role === "1") {
    const login_btn = document.querySelector("#login_btn");
    const user_icon = document.querySelector("#user_icon");
    login_btn.hidden = true;
    user_icon.hidden = false;
  }
}

hide_and_show();

function drop_down() {
  const drop_down = document.querySelector("#nav_user_dropdown");
  drop_down.hidden = !drop_down.hidden;
}

function log_out() {
  window.localStorage.clear();
  const login_btn = document.querySelector("#login_btn");
  const user_icon = document.querySelector("#user_icon");
  login_btn.hidden = false;
  user_icon.hidden = true;
}
