import BooksStore from "../stores/BooksStore";
import Book from "../models/Book";

export default class BooksController {
  constructor() {
    this.booksStore = new BooksStore();
  }

  async init() {
    await this.loadBooks();
    await this.loadPrivateBooks();
  }

  async loadBooks() {
    return this.booksStore.loadBooks();
  }

  async loadPrivateBooks() {
    return this.booksStore.loadPrivateBooks();
  }

  getBooks() {
    return this.booksStore.getDisplayedBooks();
  }

  getIsLoading() {
    return this.booksStore.isLoading;
  }

  getError() {
    return this.booksStore.error;
  }

  async addBook(name, author) {
    const book = new Book({ name, author });
    return this.booksStore.addBook(book);
  }

  getShowPrivateBooks() {
    return this.booksStore.showPrivateBooks;
  }

  setShowPrivateBooks(show) {
    this.booksStore.setShowPrivateBooks(show);
  }

  getPrivateBooksCount() {
    return this.booksStore.getPrivateBooksCount();
  }

  createNewBook() {
    return this.booksStore.createNewBook();
  }
}
