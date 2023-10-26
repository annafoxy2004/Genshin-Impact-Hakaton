const CHARACTERS_API = "http://localhost:8000/characters";

let inpName = document.getElementById("character-name");
let inpPrice = document.getElementById("character-price");
let inpDesc = document.getElementById("character-desc");
let inpImage = document.getElementById("character-image");
let inpWeapon = document.getElementById("character-Weapon");
let inpRegion = document.getElementById("character-region");
let inpBirthday = document.getElementById("character-birthday");
let inpCategory = document.getElementById("character-category");

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
        <button class="mb-2 btn btn-outline-danger btn-delete" id="${card.id}">
          Delete
        </button>
        <button class="btn btn-outline-warning btn-edit" id="${card.id}" data-bs-toggle="modal" data-bs-target="#exampleModal">
          Edit
        </button>
        <button class="btn mt-2 btn-light btnDesc" id="${card.id}" data-bs-toggle="modal" data-bs-target="#exampleModal2">
          Description
        </button>
        <button class="btn mt-2 btn-light btn-add-to-cart" data-bs-toggle="modal" data-bs-target="#exampleModal2">
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
async function getPagesCount() {
  let res = await fetch(CHARACTERS_API);
  let data = await res.json();
  let pagesCount = Math.ceil(data.length / 6);
  return pagesCount;
};

async function checkPages() {
  let maxPagesNum = await getPagesCount();
  if(currentPage === 1) {
      prevPage.setAttribute('style', 'display: none;');
      nextPage.setAttribute('style', 'display: block;');
  } else if(currentPage === maxPagesNum) {
      prevPage.setAttribute('style', 'display: block;');
      nextPage.setAttribute('style', 'display: none;');
  } else {
      prevPage.setAttribute('style', 'display: block;');
      nextPage.setAttribute('style', 'display: block;');
  };
};
checkPages();

prevPage.addEventListener('click', () => {
  currentPage--;
  pageDiv.innerText = currentPage;
  checkPages();
  render();
});

nextPage.addEventListener('click', () => {
  currentPage++;
  pageDiv.innerText = currentPage;
  checkPages();
  render();
});
