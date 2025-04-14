export interface BookData {
  id?: string | number;
  name?: string;
  author?: string;
  ownerId?: string | number;
}

export default class Book {
  id?: string | number;
  name: string;
  author: string;
  ownerId?: string | number;

  constructor(data: BookData = {}) {
    this.id = data.id;
    this.name = data.name || "";
    this.author = data.author || "Unknown";
    this.ownerId = data.ownerId;
  }
}