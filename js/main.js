const CHARACTERS_API = "http://localhost:8001/characters";

let inpName = document.getElementById("character-name");
let inpPrice = document.getElementById("character-price");
let inpDesc = document.getElementById("character-desc");
let inpImage = document.getElementById("character-image");
let inpWeapon = document.getElementById("character-Weapon");
let inpRegion = document.getElementById("character-region");
let inpBirthday = document.getElementById("character-birthday");
let inpCategory = document.getElementById("character-category");
const adminPanel = document.querySelector("#admin-panel-card");

let addForm = document.querySelector("#add-form");

//!cart
let cartModalBtn = document.querySelector("#cartModal-btn");

// !поиск
let search = "";
const searchInp = document.querySelector("#search-inp");

//!pagination
const nextPage = document.querySelector("#next");
const prevPage = document.querySelector("#prev");
const pageDiv = document.querySelector("#page");
let currentPage = 1;

//!filtration
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
  if (user) return user.isAdmin;
  return false;
}

function showAdminPanel() {
  if (!checkUserAccess()) {
    adminPanel.style.display = "none";
  } else {
    adminPanel.style.display = "block";
  }
}

showAdminPanel();

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
let sectionCards = document.getElementById("cards");
async function render(d) {
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
        <img src="${card.image}" class="detailsCard imageCard" alt="${
      card.image
    }"/>
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
        <button class="btn mt-2 btn-light btnDesc" id="${card.id}">
          Description
        </button>
        <button 
        class="btn mt-2 btn-light btn-add-to-cart btn-cart" id="cart-${
          card.id
        }">
          Add to cart
        </button>
        </div>
    </div>
  </div>
    `;
  });
  addCategoryNomination();
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

//!search
searchInp.addEventListener("input", () => {
  search = searchInp.value;
  currentPage = 1;
  render();
});

//! voice search
if ("webkitSpeechRecognition" in window) {
  const startButton = document.getElementById("startButton");
  const recognition = new webkitSpeechRecognition();

  recognition.continuous = false;
  recognition.lang = "ru-RU";
  recognition.interimResults = true;

  startButton.addEventListener("click", function () {
    recognition.start();
    startButton.disabled = true;
    startButton.textContent = "Слушаем...";
  });

  recognition.onstart = function () {
    console.log("Распознавание запущено");
  };

  recognition.onresult = function (event) {
    const result = event.results[0][0].transcript;
    console.log("Результат: ", result);
    search = result;

    recognition.stop();
    startButton.disabled = false;
    startButton.textContent = "Начать поиск голосом";
    render();
  };

  recognition.onerror = function (event) {
    console.log("Ошибка распознавания: ", event.error);
    recognition.stop();
    startButton.disabled = false;
    startButton.textContent = "Начать поиск голосом";
  };

  recognition.onend = function () {
    console.log("Распознавание завершено");
  };
} else {
  alert("Web Speech API не поддерживается в этом браузере.");
}

//!pagination
async function getPagesCount() {
  let res = await fetch(CHARACTERS_API);
  let data = await res.json();
  let pagesCount = Math.ceil(data.length / 6);
  return pagesCount;
}

async function checkPages() {
  let maxPagesNum = await getPagesCount();
  if (currentPage === 1) {
    prevPage.setAttribute("style", "display: none;");
    nextPage.setAttribute("style", "display: block;");
  } else if (currentPage === maxPagesNum) {
    prevPage.setAttribute("style", "display: block;");
    nextPage.setAttribute("style", "display: none;");
  } else {
    prevPage.setAttribute("style", "display: block;");
    nextPage.setAttribute("style", "display: block;");
  }
}
checkPages();

prevPage.addEventListener("click", () => {
  currentPage--;
  pageDiv.innerText = currentPage;
  checkPages();
  render();
});

nextPage.addEventListener("click", () => {
  currentPage++;
  pageDiv.innerText = currentPage;
  checkPages();
  render();
});

// !Register logic start

const modalReg = document.querySelector("#modalRegister");
const modalBg = document.querySelectorAll(".modalka-bg");
const registerBtn = document.querySelector("#registerUser-modal");
const userInp = document.querySelector("#username");
const ageInp = document.querySelector("#age");
const passInp = document.querySelector("#pass");
const passConfInp = document.querySelector("#passConf");
const addUserBtn = document.querySelector("#regBtn");
const registerForm = document.querySelector("#registerForm");
const isAdminInp = document.querySelector("#isAdmin");

const USER_API = "http://localhost:8001/users";

// logic Modal

modalBg.forEach((item) => {
  item.addEventListener("click", () => {
    item.style.display = "none";
  });
});

const modal = document.querySelectorAll(".modalka");
modal.forEach((item) =>
  item.addEventListener("click", (e) => {
    e.stopPropagation();
  })
);

registerBtn.addEventListener("click", () => {
  modalReg.style.display = "flex";
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

const loginSub = document.querySelector("#loginSubmit");
//logout
const logoutBtn = document.querySelector("#logoutUser-btn");

loginBtn.addEventListener("click", () => {
  modalLog.style.display = "flex";
});

function checkLoginLogoutStatus() {
  let user = localStorage.getItem("user");
  if (!user) {
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
    showUsername.innerText = "No user";
    cartModalBtn.style.display = "none";
  } else {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
    showUsername.innerText = JSON.parse(user).username;
    cartModalBtn.style.display = "block";
  }

  showAdminPanel();
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
  checkUserAccess();
  render();
});

//!filtration
async function addCategoryNomination() {
  let res = await fetch(CHARACTERS_API);
  let data = await res.json();
  let categories = new Set(data.map((product) => product.category));
  addClickEventFiltration();
}

function addClickEventFiltration() {
  let categoryItems = document.querySelectorAll(".one-btn-filter");
  categoryItems.forEach((item) =>
    item.addEventListener("click", function filterOnCategory(e) {
      let categoryText = e.target.value;
      if (categoryText === "all") {
        category = "";
      } else {
        category = categoryText;
      }

      render();
    })
  );
}

//!background switch
let btnAnemo = document.querySelector(".anemo");
btnAnemo.addEventListener("click", () => {
  body.classList.add("anemo-bg");
});
let btnPyro = document.querySelector(".pyro");
btnPyro.addEventListener("click", () => {
  body.classList.add("pyro-bg");
});
let btnAll = document.querySelector(".all");
btnAll.addEventListener("click", () => {
  body.classList.add("all-bg");
});
let btnElectro = document.querySelector(".electro");
btnElectro.addEventListener("click", () => {
  body.classList.add("electro-bg");
});
let btnHydro = document.querySelector(".hydro");
btnHydro.addEventListener("click", () => {
  body.classList.add("hydro-bg");
});
let btnGeo = document.querySelector(".geo");
btnGeo.addEventListener("click", () => {
  body.classList.add("geo-bg");
});
let btnCryo = document.querySelector(".cryo");
btnCryo.addEventListener("click", () => {
  body.classList.add("cryo-bg");
});
let btnDendro = document.querySelector(".dendro");
btnDendro.addEventListener("click", () => {
  body.classList.add("dendro-bg");
});

// description

const modalDeckBg = document.querySelector(".modal-descrip-bg");
const btnDesk = document.querySelector(".btnDesc");

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btnDesc")) {
    modalDeckBg.style.display = "flex";
    const descId = e.target.id;

  let response = await fetch(`${CHARACTERS_API}/${descId}`);
  let deskObj = await response.json();

  modalDeckBg.innerHTML = `
  <div class="modal-descrip-body">
          <div class="modal-desc-img" style="width: 35%; height: 100%; background-color: rgb(62, 58, 141);">
          <img src="${deskObj.image}" alt="${deskObj.image}">
          </div>
          <div class="modal-desc-coments" style="width: 65%; height: 100%;">
            <div class="desck-info" style="color: aliceblue;">
              <button class="btnDeskClose" id="buttonDeskClose">X</button>
              <h2>${deskObj.name}</h2>
              <p>${deskObj.price}</p>
              <p>${deskObj.desc}</p>
              <p>${deskObj.weapon}</p>
              <p>${deskObj.region}</p>
              <p>${deskObj.category}</p>
            </div>
            <img id="line" src="https://t3.ftcdn.net/jpg/03/95/48/86/360_F_395488683_CfxpbZa3he1ygTZXHdSpHUvZyqL4sv2v.jpg" alt="">
            <h2 style="font-size: 200%; color: whitesmoke; margin-top: 5%;">COMMENTS</h2>
            <div class="modal-dialog" style="width: 100%; height: auto">
              <div style="color: aliceblue;">
                <p>User</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur quod rerum soluta in adipisci repellendus voluptate maiores odit vel id, excepturi incidunt ratione facere temporibus, qui est. Expedita, molestiae sint.</p>
              </div>
              <div style="color: aliceblue;">
                <p>User</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur quod rerum soluta in adipisci repellendus voluptate maiores odit vel id, excepturi incidunt ratione facere temporibus, qui est. Expedita, molestiae sint.</p>
              </div>
              <div style="color: aliceblue;">
                <p>User</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur quod rerum soluta in adipisci repellendus voluptate maiores odit vel id, excepturi incidunt ratione facere temporibus, qui est. Expedita, molestiae sint.</p>
              </div>
              <div style="color: aliceblue;">
                <p>User</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur quod rerum soluta in adipisci repellendus voluptate maiores odit vel id, excepturi incidunt ratione facere temporibus, qui est. Expedita, molestiae sint.</p>
              </div>
              <div style="color: aliceblue;">
                <p>User</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur quod rerum soluta in adipisci repellendus voluptate maiores odit vel id, excepturi incidunt ratione facere temporibus, qui est. Expedita, molestiae sint.</p>
              </div>
            </div>
            <img id="line" src="https://t3.ftcdn.net/jpg/03/95/48/86/360_F_395488683_CfxpbZa3he1ygTZXHdSpHUvZyqL4sv2v.jpg" alt="">
            <div class="desk-like-favorite" style="width: 100%; height: 12%;">
            </div>
            <div class="deck-iput-comments" style="width: 100%; height: 9%;">
            <input style="width: 60%; height: 60%;" type="text" placeholder="Add comments...">
            <button>publish</button>
            </div>

          </div>
        </div>
  `;
  }
});

const buttonDeskClose = document.querySelector("#buttonDeskClose");

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btnDeskClose")) {
    modalDeckBg.style.display = "none";
  }
});
