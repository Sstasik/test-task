import Book from "../models/Book";
import ApiGateway from "../../Shared/ApiGateway";

export default class BooksService {
  constructor() {
    this.httpGateway = new ApiGateway();
  }

  async getBooks() {
    const booksDto = await this.httpGateway.get("/");
    return booksDto.map((bookDto) => new Book(bookDto));
  }

  async getPrivateBooks() {
    const booksDto = await this.httpGateway.get("/private");
    return booksDto.map((bookDto) => new Book(bookDto));
  }

  async addBook(book) {
    const payload = {
      name: book.name,
      author: book.author,
    };

    const response = await this.httpGateway.post("", payload);
    return response && response.status === "ok";
  }

  async addPrivateBook(book) {
    const payload = {
      name: book.name,
      author: book.author,
    };

    // Since Swagger doesn't have a separate endpoint for POST /private,
    // this method uses the same endpoint as addBook
    const response = await this.httpGateway.post("/", payload);
    return response && response.status === "ok";
  }
}
