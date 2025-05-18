// ==================== Toggle Side Nav ====================
let openCloseIcon = document.querySelector(".open-close-icon");
let sideNavMenu = document.querySelector(".side-nav-menu");
let navTab = document.querySelector(".nav-tab");

openCloseIcon.addEventListener("click", function () {
  if (sideNavMenu.classList.contains("menu-open")) {
    closeSideNav();
  } else {
    openSideNav();
  }
});

function openSideNav() {
  sideNavMenu.classList.add("menu-open");
  navTab.style.marginLeft = "0";
  openCloseIcon.classList.remove("fa-align-justify");
  openCloseIcon.classList.add("fa-xmark");
}

function closeSideNav() {
  sideNavMenu.classList.remove("menu-open");
  sideNavMenu.classList.add("menu-closing");

  setTimeout(() => {
    navTab.style.marginLeft = `-${navTab.offsetWidth}px`;
    openCloseIcon.classList.remove("fa-xmark");
    openCloseIcon.classList.add("fa-align-justify");
    sideNavMenu.classList.remove("menu-closing");
  }, 500);
}

document.addEventListener("DOMContentLoaded", () => {
  closeSideNav();
  getCategories(); 
});

// ==================== Contact Form ====================
function hideContactForm() {
  document.getElementById("contactSection").classList.add("d-none");
}

// ==================== Loading ====================
function showLoading() {
  document.querySelector(".inner-loading-screen").classList.add("d-flex");
}
function hideLoading() {
  document.querySelector(".inner-loading-screen").classList.remove("d-flex");
}

// ==================== Categories ====================
async function getCategories() {
  try {
    showLoading();
    hideContactForm();
    let response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
    let data = await response.json();
    displayCategories(data.categories);
    hideLoading();
  } catch (error) {
    console.error("Error fetching categories:", error);
    hideLoading();
  }
}

function displayCategories(categories) {
  hideContactForm();
  let box = ``;
  for (let cat of categories) {
    box += `
      <div class="col-md-3 mb-4">
        <div onclick="filterByCategory('${cat.strCategory}')" class="meal cursor-pointer">
          <img class="w-100" src="${cat.strCategoryThumb}" alt="${cat.strCategory}">
          <div class="meal-layer">
            <h3>${cat.strCategory}</h3>
            <p>${cat.strCategoryDescription.split(" ").slice(0, 15).join(" ")}...</p>
          </div>
        </div>
      </div>
    `;
  }
  document.getElementById("rowData").innerHTML = box;
  document.getElementById("searchContainer").innerHTML = "";
}

async function filterByCategory(category) {
  try {
    showLoading();
    hideContactForm();
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    let data = await response.json();
    displayMeals(data.meals || []);
    hideLoading();
  } catch (error) {
    console.error("Error fetching meals by category:", error);
    hideLoading();
  }
}

// ==================== Meals ====================
function displayMeals(meals) {
  hideContactForm();
  let box = ``;
  for (let meal of meals) {
    box += `
      <div class="col-md-3 mb-4">
        <div onclick="getMealDetails('${meal.idMeal}')" class="meal cursor-pointer">
          <img class="w-100" src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <div class="meal-layer">
            <h3>${meal.strMeal}</h3>
          </div>
        </div>
      </div>
    `;
  }
  document.getElementById("rowData").innerHTML = box;
  document.getElementById("searchContainer").innerHTML = "";
}

// ==================== Meal Details ====================
async function getMealDetails(id) {
  try {
    showLoading();
    hideContactForm();
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    let data = await res.json();
    if (data.meals && data.meals.length > 0) {
      displayMealDetails(data.meals[0]);
    }
    hideLoading();
  } catch (error) {
    console.error("Error loading meal details:", error);
    hideLoading();
  }
}

function displayMealDetails(meal) {
  hideContactForm();

  let recipes = "";
  for (let i = 1; i <= 20; i++) {
    let ingredient = meal[`strIngredient${i}`];
    let measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      recipes += `<span class="btn btn-warning m-1">${measure} ${ingredient}</span>`;
    }
  }

  let tagsHTML = meal.strTags
    ? meal.strTags.split(",").map(tag =>
        `<span class="badge bg-warning text-dark me-1">${tag}</span>`).join("")
    : "No tags";

  let box = `
    <div class="meal-details bg-dark p-4 text-white rounded shadow">
      <button onclick="closeMealDetails()" class="btn btn-danger mb-4">Close</button>
      <h2 class="text-center text-warning fw-bold mb-4">${meal.strMeal}</h2>
      <img class="w-50 rounded shadow d-block mx-auto" src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <h4 class="text-warning">Instructions</h4>
      <p>${meal.strInstructions}</p>
      <h4 class="text-warning">Area</h4>
      <p>${meal.strArea}</p>
      <h4 class="text-warning">Category</h4>
      <p>${meal.strCategory}</p>
      <h4 class="text-warning">Recipes</h4>
      <div class="mb-3">${recipes}</div>
      <h4 class="text-warning">Tags</h4>
      <div class="mb-3">${tagsHTML}</div>
      <h4 class="text-warning">Source</h4>
      <p>${meal.strSource 
        ? `<a href="${meal.strSource}" class="btn btn-warning" target="_blank">Meal Source</a>` 
        : "No source available"}</p>
      <h4 class="text-warning">YouTube</h4>
      ${meal.strYoutube
        ? `<a href="${meal.strYoutube}" class="btn btn-outline-light" target="_blank">🎬 Watch on YouTube</a>`
        : "No video available"}
    </div>
  `;

  document.getElementById("rowData").innerHTML = box;
  document.getElementById("searchContainer").innerHTML = "";
}

function closeMealDetails() {
  document.getElementById("rowData").innerHTML = "";
  getCategories();
}

// ==================== Ingredients ====================
async function getIngredients() {
  hideContactForm();
  showLoading();
  let res = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
  let data = await res.json();
  displayIngredients(data.meals.slice(0, 20));
  hideLoading();
}

function displayIngredients(ingredients) {
  hideContactForm();
  let box = ``;
  for (let ing of ingredients) {
    box += `
      <div class="col-md-3 mb-4">
        <div onclick="filterByIngredient('${ing.strIngredient}')" class="meal text-center cursor-pointer">
          <i class="fa-solid fa-drumstick-bite fa-3x"></i>
          <div class="meal-layer">
            <h3>${ing.strIngredient}</h3>
            <p>${ing.strDescription?.split(" ").slice(0, 15).join(" ")}...</p>
          </div>
        </div>
      </div>
    `;
  }
  document.getElementById("rowData").innerHTML = box;
  document.getElementById("searchContainer").innerHTML = "";
}

async function filterByIngredient(ingredient) {
  let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
  let data = await res.json();
  displayMeals(data.meals || []);
}

// =============================== Area ================================
async function getArea() {
  hideContactForm();
  let res = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
  let data = await res.json();
  displayAreas(data.meals);
}

function displayAreas(areas) {
  hideContactForm();
  let box = ``;
  for (let area of areas) {
    box += `
      <div class="col-md-3">
        <div onclick="filterByArea('${area.strArea}')" class="text-center rounded-2 cursor-pointer">
          <i class="fa-solid fa-house-laptop fa-3x"></i>
          <h3>${area.strArea}</h3>
        </div>
      </div>
    `;
  }
  document.getElementById("rowData").innerHTML = box;
  document.getElementById("searchContainer").innerHTML = "";
}

async function filterByArea(area) {
  let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
  let data = await res.json();
  displayMeals(data.meals || []);
}

// ==================== Contact Form ====================
function showContacts() {
  document.getElementById("rowData").innerHTML = "";
  document.getElementById("searchContainer").innerHTML = "";
  document.querySelector(".inner-loading-screen").classList.remove("d-flex");
  document.getElementById("contactSection").classList.remove("d-none");
  document.getElementById("contactSection").scrollIntoView({ behavior: "smooth" });
}

document.querySelector("#contactSection form").addEventListener("submit", function (e) {
  e.preventDefault();
  const pass = document.getElementById("userPassword").value;
  const repass = document.getElementById("userRePassword").value;
  if (pass !== repass) {
    alert("Passwords do not match!");
  } else {
    alert("Form submitted successfully!");
    this.reset();
  }
});
// ==================== Search ====================
function showSearchInputs() {
  document.getElementById("searchContainer").innerHTML = `
    <div class="row py-4">
      <div class="col-md-6">
        <input id="searchByName" onkeyup="searchMealsByName(this.value)" class="form-control bg-transparent text-white" placeholder="Search By Name">
      </div>
      <div class="col-md-6">
        <input id="searchByFirstLetter" maxlength="1" onkeyup="searchMealsByFirstLetter(this.value)" class="form-control bg-transparent text-white" placeholder="Search By First Letter">
      </div>
    </div>
  `;
  document.getElementById("rowData").innerHTML = "";
}

async function searchMealsByName(name) {
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
  let data = await response.json();
  displayMeals(data.meals || []);
}

async function searchMealsByFirstLetter(letter) {
  if (letter === "") letter = "a";
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
  let data = await response.json();
  displayMeals(data.meals || []);
}

// ==================== Meals ====================
function displayMeals(meals) {
  hideContactForm(); 

  let box = ``;
  for (let meal of meals) {
    box += `
      <div class="col-md-3 mb-4">
        <div onclick="getMealDetails('${meal.idMeal}')" class="meal cursor-pointer">
          <img class="w-100" src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <div class="meal-layer">
            <h3>${meal.strMeal}</h3>
          </div>
        </div>
      </div>
    `;
  }
  document.getElementById("rowData").innerHTML = box;
 }
