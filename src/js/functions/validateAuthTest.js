export function validateLogin(login) {
  if (login === "" || login.length < 6 || login.includes(" ")) {
    return false;
  }
  return true;
}

export function validatePassword(password) {
  if (password === "" || password.length < 6 || password.includes(" ")) {
    return false;
  }
  return true;
}
