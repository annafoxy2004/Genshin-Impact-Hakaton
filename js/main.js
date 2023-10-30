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

const adminPanelNews = document.querySelector("#admin-panel-news");

let addForm = document.querySelector("#add-form");

let favorites = document.querySelector("#favorites");

//!cart
let cartModalBtn = document.querySelector("#cartModal-btn");

//!favorites
let favoritesModalBtn = document.querySelector("#favoritesModal-btn");

//!modal payment
let modalPayment = document.querySelector(".modal-payment");
let loveModalBtn = document.querySelector('#favoritesModal-btn');
let basketBtn = document.querySelector("#cartModal-btn")

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
  if (user) return(user.isAdmin);
  return false;
}

function showAdminPanel() {
  if (!checkUserAccess()) {
    adminPanel.style.display = "none";
    adminPanelNews.style.display = "none"
  } else {
    adminPanel.style.display = "block";
    adminPanelNews.style.display = "block"
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
    <div class="cardd m-5 generalCard">
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
        <button class="btn mt-2 btn-light btnDesc" id="${
          card.id
        }" data-bs-toggle="modal" data-bs-target="#exampleModal2">
          Description
        </button>
        <button 
        class="btn mt-2 btn-light btn-add-to-cart btn-cart" id="cart-${
          card.id
        }">
          Add to cart
        </button>
        <button 
        class="btn mt-2 btn-dark btn-add-to-cart btn-favorites" id="cart-${
          card.id
        }" style="border-radius:14px; width:55px;">
        <img src="./images/favoritesIcon.svg" alt="favorites">
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
    alert("you're old");
    return;
  }

  if (ageInp.value <= 14) {
    alert("you're young");
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
    loveModalBtn.style.display = "none";
    basketBtn.style.display = "none"
  } else {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
    showUsername.innerText = JSON.parse(user).username;
    loveModalBtn.style.display = "block";
    basketBtn.style.display = "block"
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

// description

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btnDesc")) {
    const cardId = e.target.id;
    await fetch(`${CHARACTERS_API}/${cardId}`, {
    });
    render();
  }})

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

// !cart logic
let closeCartBtn = document.querySelector(".btn-close-cart");
let cartTable = document.querySelector(".cartTable");
let createCartOrderBtn = document.querySelector("#create-cart-order-btn");
let cleanCartBtn = document.querySelector("#clean-cart-btn");
let cartTotalCost = document.querySelector("#cart-total-cost");

//находим id элемента по которому кликаем
async function getCharacterIdByClick() {
  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-cart")) {
      let productIdSplited = e.target.id.split("-")[1];
      let res = await fetch(`${CHARACTERS_API}/${productIdSplited}`);
      let data = await res.json();
      let id = data.id;
      return id;
    }
  });
}

function initStorage() {
  if (!localStorage.getItem("cart")) {
    localStorage.setItem("cart", "[]");
  }
  if (!localStorage.getItem("productItem")) {
    localStorage.setItem("productItem", "[]");
  }
}
initStorage();

function setCharacterToLocalStorageOnClick() {
  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-cart")) {
      let productIdSplited = e.target.id.split("-")[1];
      let res = await fetch(`${CHARACTERS_API}/${productIdSplited}`);
      let data = await res.json();
      let characterObj = {
        name: data.name,
        price: data.price,
        image: data.image,
        id: data.id,
      };
      localStorage.setItem("productItem", JSON.stringify(characterObj));
      addProductToCart();
    }
  });
}
setCharacterToLocalStorageOnClick();

function getClickedCharacterFromLocalStorage() {
  let obj = JSON.parse(localStorage.getItem("productItem"));
  return obj;
}

// Функция для добавления продукта в корзину
function addProductToCart(e) {
  let cartOwner = JSON.parse(localStorage.getItem("user"));

  // Получаем ID продукта, на который кликнули
  let productId = getCharacterIdByClick();
  // Запрашиваем у пользователя количество продукта в корзине
  let cartProductCount = +prompt("Enter product count for cart");

  let productObj = getClickedCharacterFromLocalStorage();

  let productCartObj = {
    count: cartProductCount, // Количество продукта в корзине
    totalCost: +productObj.price * cartProductCount, // Общая стоимость 1 продукта
    productItem: productObj, // Сам продукт
  };
  // Получаем текущее состояние корзины из localStorage
  let cartObj = JSON.parse(localStorage.getItem("cart"));
  // Если корзина уже существует, добавляем в неё новый продукт
  if (cartObj) {
    addNewProductToCart(productCartObj);
    cartRender();
  } else {
    // Если корзины ещё нет, создаем новую корзину и добавляем в неё продукт
    createCartInLocalStorage();
    addNewProductToCart(productCartObj);
    cartRender();
  }
}

// Функция для создания объекта корзины и сохранения его в localStorage
function createCartInLocalStorage() {
  // Получаем информацию о владельце корзины из localStorage (пользователе)
  let cartOwner = JSON.parse(localStorage.getItem("user"));

  let cartObj = {
    id: Date.now(),
    owner: cartOwner.username,
    totalCost: 0,
    products: [],
  };
  localStorage.setItem("cart", JSON.stringify(cartObj));
}
createCartInLocalStorage();
// Функция для добавления нового продукта в корзину
function addNewProductToCart(productCartObj) {
  let cartObj = JSON.parse(localStorage.getItem("cart"));

  cartObj.products.push(productCartObj);
  cartObj.totalCost = countCartTotalCost(cartObj.products);
  localStorage.setItem("cart", JSON.stringify(cartObj));
}

// Функция для подсчета общей стоимости продуктов в корзине
function countCartTotalCost(products) {
  let cartTotalCost = products.reduce((acc, currentItem) => {
    return acc + currentItem.totalCost;
  }, 0);
  return cartTotalCost;
}

// Функция для отображения содержимого корзины
function cartRender() {
  let cartObj = JSON.parse(localStorage.getItem("cart"));
  if (!cartObj) {
    // Если корзины нет, выводим сообщение об отсутствии продуктов
    cartTable.innerHTML = "<h3>No products in cart!</h3>";
    cartTotalCost.innerText = "Total cost: 0$";
    return;
  }

  cartTable.innerHTML = `
        <tr>
            <th class="border border-dark">Image</th>
            <th class="border border-dark">Title</th>
            <th class="border border-dark">Count</th>
            <th class="border border-dark">Price</th>
            <th class="border border-dark">Total</th>
            <th class="border border-dark">Delete</th>
        </tr>
    `;
  cartObj.products.forEach((cartProduct) => {
    // Для каждого продукта в корзине отображаем его информацию
    cartTable.innerHTML += `
        <tr class="h-100">
            <td class="border border-dark">
            <img src="${cartProduct.productItem.image}" alt="error:(" class="w-100 h-100">
            </td>
            <td class="border border-dark">${cartProduct.productItem.name}</td>
            <td class="border border-dark">${cartProduct.count}</td>
            <td class="border border-dark">${cartProduct.productItem.price}</td>
            <td class="border border-dark">${cartProduct.totalCost}</td>
            <td class="border border-dark">
            <button class="btn btn-danger del-cart-btn" id="cart-product-${cartProduct.productItem.id}">DELETE</button>
            </td>
        </tr>
        `;
  });
  cartTotalCost.innerText = `Total cost: ${cartObj.totalCost}$`;
  // Добавляем событие "click" на кнопки удаления продуктов из корзины
  addDeleteEventForCartProduct();
}
cartRender();

// Функция для удаления продукта из корзины
function deleteProductFromCart(e) {
  let productId = e.target.id.split("-");
  productId = productId[productId.length - 1];
  // Получаем текущее состояние корзины из localStorage
  let cartObj = JSON.parse(localStorage.getItem("cart"));
  // Фильтруем список продуктов в корзине, оставляя только те, которые не удаляем
  cartObj.products = cartObj.products.filter(
    (cartProduct) => cartProduct.productItem.id != productId
  );
  // Пересчитываем общую стоимость корзины
  cartObj.totalCost = countCartTotalCost(cartObj.products);
  if (cartObj.products.length === 0) {
    // Если больше нет продуктов в корзине, удаляем корзину из localStorage
    localStorage.removeItem("cart");
  } else {
    // Иначе сохраняем обновленное состояние корзины в localStorage
    localStorage.setItem("cart", JSON.stringify(cartObj));
  }
  // Повторно отображаем содержимое корзины
  cartRender();
}

// Функция для добавления события "click" на кнопки удаления продуктов из корзины
function addDeleteEventForCartProduct() {
  let delCartProductBtns = document.querySelectorAll(".del-cart-btn");
  delCartProductBtns.forEach((btn) =>
    btn.addEventListener("click", deleteProductFromCart)
  );
}

const ORDERS_API = "http://localhost:8001/orders";

// Функция для отправки заказа на сервер
async function sendOrder(cartObj) {
  await fetch(ORDERS_API, {
    method: "POST",
    body: JSON.stringify(cartObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
}

// Функция для создания заказа
async function createOrder() {
  // Получаем текущее состояние корзины из localStorage
  let cartObj = JSON.parse(localStorage.getItem("cart"));
  if (!cartObj) {
    alert("No products in cart!");
    return;
  }
  // Отправляем заказ на сервер и очищаем корзину
  await sendOrder(cartObj);
  localStorage.removeItem("cart");
  cartRender();
}

// Обработчик клика по кнопке "Create Order"
createCartOrderBtn.addEventListener("click", () => {
  createOrder();
  modalPayment.classList.add("modal-payment-flex");
});

cleanCartBtn.addEventListener("click", () => {
  // Удаляем корзину из localStorage и обновляем отображение корзины
  localStorage.removeItem("cart");
  cartRender();
});
cartRender();

//!favorites logic
let closeFavoritesBtn = document.querySelector(".btn-close-favorites");
let favoritesTable = document.querySelector(".favoritesTable");
let cleanFavoritesBtn = document.querySelector("#clean-favorites-btn");

//находим id элемента по которому кликаем
async function fgetCharacterIdByClick() {
  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-favorites")) {
      let productIdSplited = e.target.id.split("-")[1];
      let res = await fetch(`${CHARACTERS_API}/${productIdSplited}`);
      let data = await res.json();
      let id = data.id;
      return id;
    }
  });
}

function finitStorage() {
  if (!localStorage.getItem("favorites")) {
    localStorage.setItem("favorites", "[]");
  }
  if (!localStorage.getItem("favoritesItem")) {
    localStorage.setItem("favoritesItem", "[]");
  }
}
finitStorage();

function fsetCharacterToLocalStorageOnClick() {
  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-favorites")) {
      let productIdSplited = e.target.id.split("-")[1];
      let res = await fetch(`${CHARACTERS_API}/${productIdSplited}`);
      let data = await res.json();
      let characterObj = {
        name: data.name,
        price: data.price,
        image: data.image,
        id: data.id,
      };
      localStorage.setItem("favoritesItem", JSON.stringify(characterObj));
      faddProductToCart();
    }
  });
}
fsetCharacterToLocalStorageOnClick();

function fgetClickedCharacterFromLocalStorage() {
  let obj = JSON.parse(localStorage.getItem("favoritesItem"));
  return obj;
}

// Функция для добавления продукта в корзину
function faddProductToCart(e) {
  let cartOwner = JSON.parse(localStorage.getItem("user"));

  // Получаем ID продукта, на который кликнули
  let productId = fgetCharacterIdByClick();
  // Запрашиваем у пользователя количество продукта в корзине
  let cartProductCount = +prompt("Enter product count for cart");

  let productObj = fgetClickedCharacterFromLocalStorage();

  let productCartObj = {
    count: cartProductCount, // Количество продукта в корзине
    totalCost: +productObj.price * cartProductCount, // Общая стоимость 1 продукта
    productItem: productObj, // Сам продукт
  };
  // Получаем текущее состояние корзины из localStorage
  let cartObj = JSON.parse(localStorage.getItem("favorites"));
  // Если корзина уже существует, добавляем в неё новый продукт
  if (cartObj) {
    faddNewProductToCart(productCartObj);
    fcartRender();
  } else {
    // Если корзины ещё нет, создаем новую корзину и добавляем в неё продукт
    fcreateCartInLocalStorage();
    faddNewProductToCart(productCartObj);
    fcartRender();
  }
}

// Функция для создания объекта корзины и сохранения его в localStorage
function fcreateCartInLocalStorage() {
  // Получаем информацию о владельце корзины из localStorage (пользователе)
  let cartOwner = JSON.parse(localStorage.getItem("user"));

  let cartObj = {
    id: Date.now(),
    owner: cartOwner.username,
    totalCost: 0,
    products: [],
  };
  localStorage.setItem("favorites", JSON.stringify(cartObj));
}
fcreateCartInLocalStorage();
// Функция для добавления нового продукта в корзину
function faddNewProductToCart(productCartObj) {
  let cartObj = JSON.parse(localStorage.getItem("favorites"));

  cartObj.products.push(productCartObj);
  cartObj.totalCost = fcountCartTotalCost(cartObj.products);
  localStorage.setItem("favorites", JSON.stringify(cartObj));
}

// Функция для подсчета общей стоимости продуктов в корзине
function fcountCartTotalCost(products) {
  let cartTotalCost = products.reduce((acc, currentItem) => {
    return acc + currentItem.totalCost;
  }, 0);
  return cartTotalCost;
}

// Функция для отображения содержимого корзины
function fcartRender() {
  let cartObj = JSON.parse(localStorage.getItem("favorites"));
  if (!cartObj) {
    // Если корзины нет, выводим сообщение об отсутствии продуктов
    favoritesTable.innerHTML = "<h3>No products in favorites!</h3>";
    return;
  }

  favoritesTable.innerHTML = `
        <tr>
            <th class="border border-dark">Image</th>
            <th class="border border-dark">Title</th>
            <th class="border border-dark">Count</th>
            <th class="border border-dark">Price</th>
            <th class="border border-dark">Total</th>
            <th class="border border-dark">Delete</th>
        </tr>
    `;
  cartObj.products.forEach((cartProduct) => {
    // Для каждого продукта в корзине отображаем его информацию
    favoritesTable.innerHTML += `
        <tr class="h-100">
            <td class="border border-dark">
            <img src="${cartProduct.productItem.image}" alt="error:(" class="w-100 h-100">
            </td>
            <td class="border border-dark">${cartProduct.productItem.name}</td>
            <td class="border border-dark">${cartProduct.count}</td>
            <td class="border border-dark">${cartProduct.productItem.price}</td>
            <td class="border border-dark">${cartProduct.totalCost}</td>
            <td class="border border-dark">
            <button class="btn btn-danger del-favorites-btn" id="cart-product-${cartProduct.productItem.id}">DELETE</button>
            </td>
        </tr>
        `;
  });
  // Добавляем событие "click" на кнопки удаления продуктов из корзины
  faddDeleteEventForCartProduct();
}
fcartRender();

// Функция для удаления продукта из корзины
function fdeleteProductFromCart(e) {
  let productId = e.target.id.split("-");
  productId = productId[productId.length - 1];
  // Получаем текущее состояние корзины из localStorage
  let cartObj = JSON.parse(localStorage.getItem("favorites"));
  // Фильтруем список продуктов в корзине, оставляя только те, которые не удаляем
  cartObj.products = cartObj.products.filter(
    (cartProduct) => cartProduct.productItem.id != productId
  );
  // Пересчитываем общую стоимость корзины
  cartObj.totalCost = fcountCartTotalCost(cartObj.products);
  if (cartObj.products.length === 0) {
    // Если больше нет продуктов в корзине, удаляем корзину из localStorage
    localStorage.removeItem("favorites");
  } else {
    // Иначе сохраняем обновленное состояние корзины в localStorage
    localStorage.setItem("favorites", JSON.stringify(cartObj));
  }
  // Повторно отображаем содержимое корзины
  fcartRender();
}

// Функция для добавления события "click" на кнопки удаления продуктов из корзины
function faddDeleteEventForCartProduct() {
  let delCartProductBtns = document.querySelectorAll(".del-favorites-btn");
  delCartProductBtns.forEach((btn) =>
    btn.addEventListener("click", fdeleteProductFromCart)
  );
}

cleanFavoritesBtn.addEventListener("click", () => {
  // Удаляем корзину из localStorage и обновляем отображение корзины
  localStorage.removeItem("favorites");
  fcartRender();
});
fcartRender();

//! modal payment logic

let btnSubmPay = document.querySelector(".btn-submit-modal-payment");
let inpCardNum = document.querySelector("#cardNumber");
let inpCardName = document.querySelector("#cardName");
let inpCardCVV = document.querySelector("#cardCvv");

btnSubmPay.addEventListener("click", () => {
  modalPayment.style.display = "none";
  inpCardNum.value = "";
  inpCardName.value = "";
  inpCardCVV.value = "";
});

//! news CRD

let inpNewsTitle = document.getElementById("news-title");
let inpNewsDesc = document.getElementById("news-desc");
let inpNewsImage = document.getElementById("news-image");
let inpNewsDate = document.getElementById("news-date");

let addNewsForm = document.querySelector("#news-add-form");

let NEWS_API = "http://localhost:8001/news";

async function addNews(e) {
  e.preventDefault();
  if (
    !inpNewsTitle.value.trim() ||
    !inpNewsDesc.value.trim() ||
    !inpNewsImage.value.trim() ||
    !inpNewsDate.value.trim()
  ) {
    alert("Some inputs are empty!");
    return;
  }

  let cardObj = {
    title: inpNewsTitle.value,
    date: inpNewsDate.value,
    desc: inpNewsDesc.value,
    image: inpNewsImage.value,
  };

  await fetch(NEWS_API, {
    method: "POST",
    body: JSON.stringify(cardObj),
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  inpNewsTitle.value = "";
  inpNewsDate.value = "";
  inpNewsDesc.value = "";
  inpNewsImage.value = "";
  renderNews();
}

addNewsForm.addEventListener("submit", addNews);

//! read
let sectionNews = document.getElementById("news");
async function renderNews(d) {
  let response = await fetch(NEWS_API);
  let data = await response.json();
  sectionNews.innerHTML = "";
  data.forEach((card) => {
    sectionNews.innerHTML += `<div class="cardNews content d-flex flex-column m-5">
    <div class="imageNews"><img src="${card.image}" class="detailsCard imageCard" alt="${
      card.image
    }"/></div>
     <div class="contentNews">
       
         <span class="titleNews">
          <h5 style="font-size: 30px" class="card-title">${card.title}</h5>
         </span>
       
   
       <p class="descNews">
        <p class="card-text">
          Date: ${card.date}
        <br>
          ${card.desc}
       </p>
       </p>
       ${
        checkUserAccess()
          ? `<button class="mb-2 btn btn-danger btn-delete-news" id="${card.id}">
          Delete
        </button>`
          : ""
      }
     </div>
   </div>`
  });
}

renderNews();

//! delete

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-delete-news")) {
    const cardId = e.target.id;

    await fetch(`${NEWS_API}/${cardId}`, {
      method: "DELETE",
    });
    renderNews();
  }
});

// Отзывы

const COMMENT_API = "http://localhost:8001/comments"

const modalCommentsBg = document.querySelector("#modal-comments-bg")
const inpCommen = document.querySelector("#inputComment")
const formComment = document.querySelector("#form-comment-modal-id")
let userComentCont = document.querySelector("#userComentContainer")

document.addEventListener("click", (e) =>{
  if(e.target.classList.contains("commentsBtn")){
    modalCommentsBg.style.display = "flex";
  }
})

async function addComment(e) {
  e.preventDefault();
  if(!inpCommen.value.trim()){
    alert("You can't send emptu messege")
    return;
  }

  let user = localStorage.getItem("user");
  const showName = showUsername.innerText = JSON.parse(user).username
  
  let objCommen = {
    user: showName,
    comment: inpCommen.value,
  }

  await fetch(`${COMMENT_API}`, {
    method: "POST",
    body: JSON.stringify(objCommen),
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  inpCommen.value = ""
  renderComment()
}
formComment.addEventListener("submit", addComment);

async function renderComment() {
  let responseCom = await fetch(COMMENT_API);
  let dataCom = await responseCom.json();
  userComentCont.innerHTML = "";
  dataCom.forEach((commen) => {
    userComentCont.innerHTML += `
    <h3 style="font-size: 120%;">${commen.user}</h3>
    <p>${commen.comment}</p>
    `
  })
}
renderComment()
document.addEventListener("click", (e) =>{
  if(e.target.classList.contains("btnCommentClose")){
    modalCommentsBg.style.display = "none"
  }
})

const deskCloseBtn = document.querySelector("#buttonDeskClose");

document.addEventListener("click", (e) =>{
  if(e.target.classList.contains("btnDeskClose")){
    modalDeckBg.style.display = "none"
  }
})


// description

const modalDeckBg = document.querySelector("#modal-deck-bg-log");
const btnDesk = document.querySelector(".btnDesc");

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btnDesc")) {
    modalDeckBg.style.display = "flex";

  const descId = e.target.id;
  console.log(descId)
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
                  <p>${deskObj.desc}</p>
                  <p>Элемент: ${deskObj.category}</p>
                  <p>Оружие: ${deskObj.weapon}</p>
                  <p>Регион: ${deskObj.region}</p>
                  <p>Цена: ${deskObj.price}$</p>
                </div>
                <button class="commentsBtn">Отзывы</button>
  
              </div>
            </div>
      `;
  }
});