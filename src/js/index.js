require("@babel/polyfill");
import Search from "./model/Search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";
import Recipe from "./model/Recipe";
import {
  renderRecipe,
  clearRecipe,
  highlightSelector,
} from "./view/recipeView";
import List from "./model/List";
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
    renderRecipe(state.recipe);
  }
};

// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("load", controlRecipe);
["hashchange", "load"].forEach((e) =>
  window.addEventListener(e, controlRecipe)
);

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

elements.recipeDiv.addEventListener("click", (e) => {
  if (e.target.matches(".recipe__btn, .recipe__btn *")) {
    controlList();
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
