export default class Book {
  id;
  name;
  author;
  ownerId;

  constructor(data = {}) {
    this.id = data.id;
    this.name = data.name || "";
    this.author = data.author || "Unknown";
    this.ownerId = data.ownerId;
  }
}
