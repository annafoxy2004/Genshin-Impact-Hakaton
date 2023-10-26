const CHARACTERS_API = "http://localhost:8000/characters";

let inpName = document.getElementById("character-name");
let inpPrice = document.getElementById("character-price");
let inpDesc = document.getElementById("character-desc");
let inpImage = document.getElementById("character-image");
let inpWeapon = document.getElementById("character-Weapon");
let inpRegion = document.getElementById("character-region");
let inpBirthday = document.getElementById("character-birthday");
let inpCategory = document.getElementById("character-category");
const adminPanel = document.querySelector("#admin-panel-card")

let addForm = document.querySelector("#add-form");

let search = "";
const searchInp = document.querySelector("#search-inp");

//pagination
const nextPage = document.querySelector("#next");
const prevPage = document.querySelector("#prev");
const pageDiv = document.querySelector("#page");

//переменная для пагинации
let currentPage = 1;
let category = "";

//? CRUD characters

//!create

function initStorege() {
  if (!localStorage.getItem("user")) {
    localStorage.setItem("user", "{}");
  }
}

initStorege();

function checkUserAccess() {
  let user = JSON.parse(localStorage.getItem("user"));
  if(user) return user.isAdmin
  return false
}

function showAdminPanel() {
  if (!checkUserAccess()) {
    adminPanel.style.display = "none";
  } else {
    adminPanel.style.display = "block";
  }
}

showAdminPanel()

async function addProduct(e) {
  e.preventDefault();
  if (
    !inpName.value.trim() ||
    !inpPrice.value.trim() ||
    !inpDesc.value.trim() ||
    !inpImage.value.trim() ||
    !inpBirthday.value.trim() ||
    !inpCategory.value.trim() ||
    !inpRegion.value.trim() ||
    !inpWeapon.value.trim()
  ) {
    alert("Some inputs are empty!");
    return;
  }

  let cardObj = {
    name: inpName.value,
    price: inpPrice.value,
    desc: inpDesc.value,
    image: inpImage.value,
    birthday: inpBirthday.value,
    category: inpCategory.value,
    region: inpRegion.value,
    weapon: inpWeapon.value,
  };

  await fetch(CHARACTERS_API, {
    method: "POST",
    body: JSON.stringify(cardObj),
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  inpName.value = "";
  inpPrice.value = "";
  inpDesc.value = "";
  inpImage.value = "";
  inpBirthday.value = "";
  inpCategory.value = "";
  inpRegion.value = "";
  inpWeapon.value = "";
  render();
}

addForm.addEventListener("submit", addProduct);

//! read

async function render() {
  let sectionCards = document.getElementById("cards");

  let requestAPI = `${CHARACTERS_API}?q=${search}&category=${category}&_page=${currentPage}&_limit=6`;
  if (!category) {
    requestAPI = `${CHARACTERS_API}?q=${search}&_page=${currentPage}&_limit=6`;
  }

  let response = await fetch(requestAPI);
  let data = await response.json();
  sectionCards.innerHTML = "";
  data.forEach((card) => {
    sectionCards.innerHTML += `
    <div class="cardd m-5">
    <div class="content d-flex flex-column">
      <div class="content d-flex align-items-start m-2">
        <img src="${card.image}" class="detailsCard imageCard" alt="${card.image}"/>
          <div class="text-card">
            <h5 style="font-size: 30px" class="card-title">${card.name}</h5>
            <p class="card-text">
              Price: ${card.price}$
            <br>
              Element: ${card.category}
           </p>
          </div>
      </div>
      <div class="w-100 d-flex flex-row flex-wrap  batton-crad">
      ${
        checkUserAccess()
        ? `<button class="mb-2 btn btn-outline-danger btn-delete" id="${card.id}">
          Delete
        </button>
        <button class="btn btn-outline-warning btn-edit" id="${card.id}" data-bs-toggle="modal" data-bs-target="#exampleModal">
          Edit
         </button>`
         : ""
      }
        <button class="btn mt-2 btn-outline-primary btnDesc" id="${card.id}" data-bs-toggle="modal" data-bs-target="#exampleModal2">
          Description
        </button>
        <button class="btn mt-2 btn-outline-primary btn-add-to-cart" data-bs-toggle="modal" data-bs-target="#exampleModal2">
          Add to cart
        </button>
        </div>
    </div>
  </div>
    `;
  });
}

render();

//! delete

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-delete")) {
    console.log(e.target);
    const cardId = e.target.id;

    await fetch(`${CHARACTERS_API}/${cardId}`, {
      method: "DELETE",
    });
    render();
  }
});

//! EDIT

let editName = document.querySelector("#editInpName");
let editPrice = document.querySelector("#editInpPrice");
let editDesc = document.querySelector("#editInpDescription");
let editImage = document.querySelector("#editInpImage");
let editWeapon = document.querySelector("#editInpWeapon");
let editRegion = document.querySelector("#editInpRegion");
let editBirthday = document.querySelector("#editInpBirthday");
let editCharacterCategory = document.querySelector("#editCharacterCategory");

let editForm = document.querySelector("#edit-form");
let editBtnSave = document.querySelector("#editBtnSave");

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-edit")) {
    let cardId = e.target.id;
    let response = await fetch(`${CHARACTERS_API}/${cardId}`);
    let cardObj = await response.json();

    editName.value = cardObj.name;
    editPrice.value = cardObj.price;
    editDesc.value = cardObj.desc;
    editImage.value = cardObj.image;
    editWeapon.value = cardObj.weapon;
    editRegion.value = cardObj.region;
    editBirthday.value = cardObj.birthday;
    editCharacterCategory.value = cardObj.category;

    editForm.id = "edit-form " + cardObj.id;
  }
});

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  let updatedObj = {
    name: editName.value,
    price: editPrice.value,
    desc: editDesc.value,
    image: editImage.value,
    birthday: editBirthday.value,
    category: editCharacterCategory.value,
    region: editRegion.value,
    weapon: editWeapon.value,
  };

  let id = e.target.id.split(" ")[1];

  await fetch(`${CHARACTERS_API}/${id}`, {
    method: "PUT",
    body: JSON.stringify(updatedObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  render();
});

//search
searchInp.addEventListener("input", () => {
  search = searchInp.value;
  currentPage = 1;
  render();
});

//pagination
nextPage.addEventListener("click", (e) => {
  currentPage++;
  pageDiv.innerText = currentPage;
  checkPages();
  render();
});

prevPage.addEventListener("click", (e) => {
  if (currentPage < 2) {
    return;
  }
  checkPages();
  currentPage--;
  pageDiv.innerText = currentPage;

  render();
});

async function checkPages() {
  let res = await fetch(CHARACTERS_API);
  let data = await res.json();
  let pages = Math.ceil(data.length / 6);
  if (currentPage === 1) {
    prevPage.style.display = "none";
    nextPage.style.display = "block";
  } else if (currentPage === pages) {
    nextPage.style.display = "none";
    prevPage.style.display = "block";
  }
}

checkPages();

// Register logic start

const modalReg = document.querySelector("#modalRegister");
const modalBg = document.querySelector(".modalka-bg");
const registerBtn = document.querySelector("#registerUser-modal");
const userInp = document.querySelector("#username");
const ageInp = document.querySelector("#age");
const passInp = document.querySelector("#pass");
const passConfInp = document.querySelector("#passConf");
const addUserBtn = document.querySelector("#regBtn");
const registerForm = document.querySelector("#registerForm");
const isAdminInp = document.querySelector("#isAdmin");

const USER_API = "http://localhost:8000/users";

registerBtn.addEventListener("click", () => {
  modalReg.style.display = "block";
});

async function checkUniqueUser(username) {
  let res = await fetch(USER_API);
  let users = await res.json();
  return users.some((item) => item.username === username);
}

async function registerUserName(e) {
  e.preventDefault();

  if (
    !userInp.value.trim() ||
    !ageInp.value.trim() ||
    !passInp.value.trim() ||
    !passConfInp.value.trim()
  ) {
    alert("Some input are empty");
    return;
  }

  let uniqueUser = await checkUniqueUser(userInp.value);
  if (uniqueUser) {
    alert("This username already in use!");
    return;
  }

  if (passInp.value.length <= 6) {
    alert("Min length of password is 6!");
    return;
  }

  if (passInp.value !== passConfInp.value) {
    alert("Passwords don't match");
    return;
  }

  if (ageInp.value >= 140) {
    alert("you old");
    return;
  }

  if (ageInp.value <= 14) {
    alert("you yang");
    return;
  }

  let userObj = {
    username: userInp.value,
    age: ageInp.value,
    password: passInp.value,
    passConf: passConfInp.value,
    isAdmin: isAdminInp.checked,
  };

  await fetch(USER_API, {
    method: "POST",
    body: JSON.stringify(userObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  modalReg.style.display = "none";

  userInp.value = "";
  ageInp.value = "";
  passInp.value = "";
  passConfInp.value = "";
  isAdminInp.checked = false;

  alert("Registered successfully!");
}

registerForm.addEventListener("submit", registerUserName);

// login start

const modalLog = document.querySelector("#modalLogin");
const loginBtn = document.querySelector("#loginUser-modal");
const loginUserInp = document.querySelector("#userLogin");
const loginPassInp = document.querySelector("#passLogin");
const loginForm = document.querySelector("#loginForm");
const changeThemeBtn = document.querySelector("#changeTheme");
const showUsername = document.querySelector("#showUsername");
const body = document.querySelector("body");

//! Card

const basketBtn = document.querySelector("#basketBtn");

const loginSub = document.querySelector("#loginSubmit");
//logout
const logoutBtn = document.querySelector("#logoutUser-btn");

loginBtn.addEventListener("click", () => {
  modalLog.style.display = "block";
});

function checkLoginLogoutStatus() {
  let user = localStorage.getItem("user");
  if (!user) {
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
    showUsername.innerText = "No user";
    basketBtn.style.display = "none";
  } else {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
    showUsername.innerText = JSON.parse(user).username;
    basketBtn.style.display = "block";
  }

  showAdminPanel()
}

checkLoginLogoutStatus();

function checkUsersInUsers(username, users) {
  return users.some((item) => item.username === username);
}

function checkUserPassword(user, password) {
  return user.password === password;
}

function setUserToStorage(username, isAdmin) {
  localStorage.setItem(
    "user",
    JSON.stringify({
      username,
      isAdmin,
    })
  );
}

async function loginUser() {
  let res = await fetch(USER_API);
  let users = await res.json();
  initStorege();

  if (!loginUserInp.value.trim() || !loginPassInp.value.trim()) {
    alert("Some inputs are empty");
    return;
  }

  if (!checkUsersInUsers(loginUserInp.value, users)) {
    alert("User not found");
    return;
  }

  let userObj = users.find((item) => item.username === loginUserInp.value);

  if (!checkUserPassword(userObj, loginPassInp.value)) {
    alert("Wrong password");
  }

  setUserToStorage(userObj.username, userObj.isAdmin);

  loginUserInp.value = "";
  loginPassInp.value = "";

  checkLoginLogoutStatus();
  render();

  modalLog.style.display = "none";
}

loginSub.addEventListener("click", loginUser);

// logout

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("user");
  showAdminPanel();
  checkLoginLogoutStatus();
  checkUserAccess()
  render();
});
