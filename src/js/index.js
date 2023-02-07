require("@babel/polyfill");
import Search from "./model/Search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";
import * as likesView from "./view/likesView";
import Recipe from "./model/Recipe";
import {
  renderRecipe,
  clearRecipe,
  highlightSelector,
} from "./view/recipeView";
import List from "./model/List";
import Like from "./model/Like";
import * as listView from "./view/listView";

/* Web app state
 - Hailtiin query, ur dun
 - Tuhain uzuulj bgaa jor
 - Liked recipes
 - Zahialj bgaa joriin nairlaguud  
 */

const state = {};

const controlSearch = async () => {
  //1. Web-s hailtiin tulhuur ugiig gargaj avna
  const query = searchView.getInput();

  if (query) {
    //2. Shineer hailtiin object-g uusgej ugnu.
    state.search = new Search(query);

    //3. Hailt hiihed zoriulj delgetsiin UI belgene.
    searchView.clearSearchQuery();
    searchView.clearSearchResult();
    renderLoader(elements.searchResultDiv);

    //4. Hailtiig guitsetgene.
    await state.search.doSearch();

    //5. Hailtiin ur dung delgetsend uzuulne.
    clearLoader();
    if (state.search.result === undefined) alert("Not Found");
    else searchView.renderRecipes(state.search.result);
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});

elements.pageButtons.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");

  if (btn) {
    const gotoPageNumber = parseInt(btn.dataset.goto, 10);
    searchView.clearSearchResult();
    searchView.renderRecipes(state.search.result, gotoPageNumber);
  }
});

//Recipe controller
const controlRecipe = async () => {
  //1. URL-s ID-g salgaj
  const id = window.location.hash.replace("#", "");

  //URL deer id bgaa esehiig shalgana.
  if (id) {
    //2.Create recipe model
    state.recipe = new Recipe(id);

    //3. UI delsetsiig belgene.
    clearRecipe();
    renderLoader(elements.recipeDiv);
    highlightSelector(id);

    //4. Recipe tataj avna.
    await state.recipe.getRecipe();

    //5.Joriin guitsetgeh hugatsaa bolon ortsiig tootsoolno.
    clearLoader();
    state.recipe.calcTime();
    state.recipe.calcPerson();

    //6. Show recipe on screen
    renderRecipe(state.recipe, state.likes.isLiked(id));
  }
};

// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("load", controlRecipe);
["hashchange", "load"].forEach((e) =>
  window.addEventListener(e, controlRecipe)
);

window.addEventListener("load", (e) => {
  //Shineer like modeliig app achaalagdahad uusgene.
  if (!state.likes) state.likes = new Like();

  //Like menu-g gargah esehiig shiideh
  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());

  //Like-uud bval menu-d nemj haruulna.
  state.likes.likes.forEach((like) => likesView.renderLike(like));
});

//Nairlaggnii controller
const controlList = () => {
  //Nairlaganii modeliig uugene.
  state.list = new List();
  //Umnu ni haragdaj bsan nairlaguudiig delgetsees zailuulna.
  listView.clearItems();

  //Ug model ruu odoo haragdaj bgaa jornii buh nairlagiig avch hiine.
  state.recipe.ingredients.forEach((n) => {
    //Tuhain nairlagiig model ruu hiine.
    const item = state.list.addItem(n);

    //Tuhain nairlagiig delgetsend gargana
    listView.renderItem(item);
  });
};

//Like controller
const controlLike = () => {
  //1. Like-n modeliig uusgene.
  if (!state.likes) state.likes = new Like();

  //2. Odoo haragdaj bgaa joriin ID-g olj avah
  const currentRecipeId = state.recipe.id;

  //3. Ene joriig liked esehiig shalgana
  if (state.likes.isLiked(currentRecipeId)) {
    //Like darsan bol boliulah
    state.likes.deleteLike(currentRecipeId);
    //Like menu-s ustgana.
    likesView.deleteLikedRecipe(currentRecipeId);
    //Like button-ii liked tuluviig boliulah
    likesView.toggleLikeBtn(false);
  } else {
    //Like daraagui bol like darna.
    const newLike = state.likes.addLike(
      currentRecipeId,
      state.recipe.title,
      state.recipe.publisher,
      state.recipe.image_url
    );
    //Like menu-d oruulah
    likesView.renderLike(newLike);

    //Like button-ii liked tuluviig idevhijuuleh
    likesView.toggleLikeBtn(true);
  }

  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
};

elements.recipeDiv.addEventListener("click", (e) => {
  if (e.target.matches(".recipe__btn, .recipe__btn *")) {
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    controlLike();
  }
});

elements.shoppingList.addEventListener("click", (e) => {
  //click hiisen li elementiin data-itemid attribute-g shuuj gargaj avah
  const id = e.target.closest(".shopping__item").dataset.itemid;

  //Oldson ID-tai ortsiig model-s ustgana.
  state.list.deleteItem(id);

  //Delgetsees iim ID-tai ortsiig olj bas ustgana.
  listView.deleteItem(id);
});
