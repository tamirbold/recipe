import { elements } from "./base";

//private function
const renderRecipe = (recipe) => {
  const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="Test">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${recipe.title}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
  `;

  //ul ruu nemne.
  elements.searchResultList.insertAdjacentHTML("beforeend", markup);
};

export const clearSearchResult = () => {
  elements.searchResultList.innerHTML = "";
  elements.pageButtons.innerHTML = "";
};
export const clearSearchQuery = () => {
  elements.searchInput.value = "";
};
export const getInput = () => elements.searchInput.value;
export const renderRecipes = (recipes, currentPage = 1, resPerPage = 10) => {
  //Hailtiin ur dung huudaslaj uzuuleh.
  const start = (currentPage - 1) * resPerPage;
  const end = currentPage * resPerPage;

  recipes.slice(start, end).forEach(renderRecipe);
  //Huudaslaltiin tovchnuudiig gargaj uzuuleh.
  const totalPages = Math.ceil(recipes.length / resPerPage);
  renderButtons(currentPage, totalPages);
};

//type = 'prev', 'next'
const createButton = (page, type, direction) => `
  <button class="btn-inline results__btn--${type}" data-goto=${page}>
  <span>Page ${page}</span>
    <svg class="search__icon">
      <use href="img/icons.svg#icon-triangle-${direction}"></use>
    </svg>
  </button>
`;

const renderButtons = (currentPage, totalPages) => {
  let buttonHtml;

  if (currentPage === 1 && totalPages > 1) {
    //1-r huudsan deer bna, 2-r huudas gedeg tovchluuriig garga.
    buttonHtml = createButton(2, "next", "right");
  } else if (currentPage < totalPages) {
    //Umnuh bolon daraachiin huudas ruu shiljih tovchluuruudiig uzuul
    buttonHtml = createButton(currentPage - 1, "prev", "left");
    buttonHtml += createButton(currentPage + 1, "next", "right");
  } else if (currentPage === totalPages) {
    //Hamgiin suuliin huudas deer bna, umnuh huudas ruu shiljih tovchluuriig uzuul
    buttonHtml = createButton(currentPage - 1, "prev", "left");
  }

  elements.pageButtons.insertAdjacentHTML("afterbegin", buttonHtml);
};
