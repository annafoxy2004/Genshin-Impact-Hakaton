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
let cartModalBtn = document.querySelector('#cartModal-btn');
let closeCartBtn = document.querySelector('.btn-close-cart');
let cartTable = document.querySelector('table');
let createCartOrderBtn = document.querySelector('#create-cart-order-btn');
let cleanCartBtn = document.querySelector('#clean-cart-btn')
let cartTotalCost = document.querySelector('#cart-total-cost');

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
        <button class="btn mt-2 btn-light btnDesc" id="${
          card.id
        }" data-bs-toggle="modal" data-bs-target="#exampleModal2">
          Description
        </button>
        <button class="btn mt-2 btn-light btn-add-to-cart btn-cart" id="cart-${card.id}">
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

// description

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btnDesc")) {
    const cardId = e.target.id;
    console.log(cardId);

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
})


// !cart logic
function checkLoginUser() {
  let user = JSON.parse(localStorage.getItem('users'));
  return user;
};

// add product to cart
async function getOrderObjectById(id) {
  let res = await fetch(`${CHARACTERS_API}/${id}`);
  let characterObj = await res.json();
  return characterObj;
};

function countCartTotalCost(characters) {
  let cartTotalCost = characters.reduce((acc, currentItem) => {
      return acc + currentItem.totalCost;
  }, 0);
  return cartTotalCost;
};

function addNewCharacterToCart(characterCartObj) {
  let cartObj = JSON.parse(localStorage.getItem('cart'));
  cartObj.character.push(characterCartObj);
  cartObj.totalCost = countCartTotalCost(cartObj.character);
  localStorage.setItem('cart', JSON.stringify(cartObj));
};

function addCartObjToLocalStorage() {
  let cartOwner = JSON.parse(localStorage.getItem('users'));
  let cartObj = {
      id: Date.now(),
      owner: cartOwner.username,
      totalCost: 0,
      character: []
  };
  localStorage.setItem('cart', JSON.stringify(cartObj));
};

async function addCharacterToCart(e) {
  let characterId = e.target.id.split('-')[1];
  let characterObj = await getOrderObjectById(characterId);
  let cartCharacterCount = +prompt('Enter character count for cart');
  let characterCartObj = {
      count: cartCharacterCount,
      totalCost: +characterObj.price * cartCharacterCount,
      productItem: characterObj
  };
  let cartObj = JSON.parse(localStorage.getItem('cart'));
  if(cartObj) {
      addNewCharacterToCart(characterCartObj);
  } else {
      addCartObjToLocalStorage();
      addNewCharacterToCart(characterCartObj);
  };
};

function addCartEvent() {
  let cartBtns = document.querySelectorAll('.btn-cart');
  cartBtns.forEach(btn => btn.addEventListener('click', addCharacterToCart));
};

// render cart
function cartRender() {
  let cartObj = JSON.parse(localStorage.getItem('cart'));
  if(!cartObj) {
      cartTable.innerHTML = '<h3>No products in cart!</h3>';
      cartTotalCost.innerText = 'Total cost: 0$';
      return;
  };
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
  cartObj.character.forEach(cartCharacter => {
      cartTable.innerHTML += `
      <tr>
          <td class="border border-dark">
          <img src=${cartCharacter.productItem.image} alt="error:(" width="50" height="50">
          </td>
          <td class="border border-dark">${cartCharacter.productItem.name}</td>
          <td class="border border-dark">${cartCharacter.count}</td>
          <td class="border border-dark">${cartCharacter.productItem.price}</td>
          <td class="border border-dark">${cartCharacter.totalCost}</td>
          <td class="border border-dark">
          <button class="btn btn-danger del-cart-btn" id="cart-product-${cartCharacter.productItem.id}">DELETE</button>
          </td>
      </tr>
      `;
  });
  cartTotalCost.innerText = `Total cost: ${cartObj.totalCost}$`;
  addDeleteEventForCartProduct();
};

cartModalBtn.addEventListener('click', cartRender);

// remove product from cart
function deleteProductFromCart(e) {
  let productId = e.target.id.split('-');
  productId = productId[productId.length - 1];
  let cartObj = JSON.parse(localStorage.getItem('cart'));
  cartObj.character = cartObj.character.filter(cartProduct => cartProduct.productItem.id != productId);
  cartObj.totalCost = countCartTotalCost(cartObj.character);
  if(cartObj.character.length === 0) {
      localStorage.removeItem('cart');
  } else {
      localStorage.setItem('cart', JSON.stringify(cartObj));
  };
  cartRender();
};

function addDeleteEventForCartProduct() {
  let delCartProductBtns = document.querySelectorAll('.del-cart-btn');
  delCartProductBtns.forEach(btn => btn.addEventListener('click', deleteProductFromCart));
};

// create order
const ORDERS_API = 'http://localhost:8001/orders';

async function sendOrder(cartObj) {
  await fetch(ORDERS_API, {
      method: 'POST',
      body: JSON.stringify(cartObj),
      headers: {
          "Content-Type": "application/json;charset=utf-8"
      }
  });
};

async function createOrder() {
  let cartObj = JSON.parse(localStorage.getItem('cart'));
  if(!cartObj) {
      alert('No products in cart!');
      return;
  };
  await sendOrder(cartObj);
  localStorage.removeItem('cart');
  cartRender();
};

createCartOrderBtn.addEventListener('click', createOrder);

// clean cart
cleanCartBtn.addEventListener('click', () => {
  localStorage.removeItem('cart');
  cartRender();
});