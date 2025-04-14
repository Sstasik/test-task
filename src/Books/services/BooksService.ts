import Book, { BookData } from "../models/Book";
import ApiGateway, { ApiResponse } from "../../Shared/ApiGateway";

export default class BooksService {
  private httpGateway: ApiGateway;

  constructor() {
    this.httpGateway = new ApiGateway();
  }

  async getBooks(): Promise<Book[]> {
    const booksDto = await this.httpGateway.get<BookData[]>("/");
    return booksDto.map((bookDto) => new Book(bookDto));
  }

  async getPrivateBooks(): Promise<Book[]> {
    const booksDto = await this.httpGateway.get<BookData[]>("/private");
    return booksDto.map((bookDto) => new Book(bookDto));
  }

  async addBook(book: Book): Promise<boolean> {
    const payload = {
      name: book.name,
      author: book.author,
    };

    const response = await this.httpGateway.post<ApiResponse>("", payload);
    return response !== null && response.status === "ok";
  }

  async addPrivateBook(book: Book): Promise<boolean> {
    const payload = {
      name: book.name,
      author: book.author,
    };

    const response = await this.httpGateway.post<ApiResponse>("/", payload);
    return response !== null && response.status === "ok";
  }
}