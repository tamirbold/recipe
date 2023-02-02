import axios from "axios";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    const result = await axios(
      "https://forkify-api.herokuapp.com/api/get?rId=" + this.id
    );

    this.publisher = result.data.recipe.publisher;

    console.log(this.publisher);
  }
}
