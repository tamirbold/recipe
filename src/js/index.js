require("@babel/polyfill");
import Search from "./model/Search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";

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
