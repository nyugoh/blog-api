let registerForm = $("#register-form");
let loginForm = $("#login-form");
let registerEmail = $("#registerEmail");
let registerFullName = $("#fullName");
let registerUsername = $("#username");
let registerPassword = $("#registerPassword");
let loginEmail = $("#loginEmail");
let loginPassword = $("#loginPassword");
let loginButton = $("#loginButton");
let registerButton = $("#registerButton");
let baseUrl = "http://localhost:8080";

loginForm.on('submit', (e) => {
  e.preventDefault();
  let email = loginEmail.val();
  let password = loginPassword.val();

  loginButton.text("Logging in...");
  loginForm.addClass('was-validated');

  if (email.trim().length === 0) {
    loginButton.text("Login");
    return loginEmail.addClass("invalid");
  }

  if (password.trim().length === 0) {
    loginButton.text("Login");
    return loginPassword.addClass("invalid");
  }

  postData(`${baseUrl}/login`, { email, password })
    .then((response) => response.json())
    .then((response) => {
      if (response.token !== undefined) {
        login(response.token);
      } else {
        $("#loginError").text(response.message);
        loginButton.text("Login");
      }
    })
    .catch((error) => {
      $("#loginError").text(error.message);
    });

});

registerForm.on('submit', (e) => {
  e.preventDefault();
  let email = registerEmail.val();
  let fullName = registerFullName.val();
  let username = registerUsername.val();
  let password = registerPassword.val();

  registerForm.addClass('was-validated');
  registerButton.text("Registering...")
  if (email.trim().length === 0) {
    return registerEmail.addClass("invalid");
  }
  if (fullName.trim().length === 0) {
    return registerUsername.addClass("invalid");
  }
  if (password.trim().length === 0) {
    return registerPassword.addClass("invalid");
  }
  if (username.trim().length === 0) {
    return registerUsername.addClass("invalid");
  }

  postData(`${baseUrl}/register`, {
    email,
    username,
    fullName,
    password
  }).then((response) => response.json())
    .then((response) => {
      if (response.token !== undefined) {
        login(response.token);
      } else {
        $("#registerError").text(response.message);
        registerButton.text("Register");
      }
    })
    .catch((error) => {
      $("#registerError").text(error.message);
    });
});

function login(token) {
  if (token !== undefined) {
    localStorage.setItem('token', token);
    window.location = "/admin";
  } else {
    alert("Can't login, try again");
  }
}

function logout() {
  localStorage.clear();
}

function postData(url, data = {}) {
  let token = localStorage.getItem("token");
  return fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json; charset=utf-8", "x-access-token": token },
    redirect: "follow",
    referrer: "no-referrer",
    body: JSON.stringify(data)
  });
}
