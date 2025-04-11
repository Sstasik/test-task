import BooksStore from "../stores/BooksStore";
import Book from "../models/Book";

export default class BooksController {
  constructor() {
    this.booksStore = new BooksStore();
  }

  async init() {
    await Promise.all([this.loadBooks(), this.loadPrivateBooks()]);
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
    if (!name || !author) {
      this.booksStore.setError("Name and author are required");
      return false;
    }
    
    const book = new Book({ name, author });
    return this.booksStore.addBook(book);
  }

  togglePrivateBooks(showPrivate) {
    this.booksStore.showPrivateBooks = showPrivate;
  }

  getShowPrivateBooks() {
    return this.booksStore.showPrivateBooks;
  }

  getPrivateBooksCount() {
    return this.booksStore.privateBooks.length;
  }
}
