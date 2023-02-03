import uniqid from "uniqid";

export default class List {
  constructor() {
    this.items = [];
  }

  deleteItem(id) {
    //id gedeg ID-tai ortsiig array-s haij olno
    const index = this.items.findIndex((el) => el.id === id);
    //Ug index deerh elementiig array-s ustgana.
    this.items.splice(index, 1);
  }

  addItem(item) {
    let newItem = {
      id: uniqid(),
      item,
    };
    this.items.push(newItem);

    return newItem;
  }
}
