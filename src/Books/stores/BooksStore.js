import { makeAutoObservable, runInAction } from "mobx";
import BooksService from "../services/BooksService";
import Book from "../models/Book";

export default class BooksStore {
  books = [];
  privateBooks = [];
  isLoading = false;
  error = null;
  showPrivateBooks = false;

  constructor() {
    makeAutoObservable(this);
    this.booksService = new BooksService();
  }

  async loadBooks() {
    this.isLoading = true;
    this.error = null;

    try {
      const books = await this.booksService.getBooks();
      runInAction(() => {
        this.books = books;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        this.isLoading = false;
      });
    }
  }

  async loadPrivateBooks() {
    this.isLoading = true;
    this.error = null;

    try {
      const privateBooks = await this.booksService.getPrivateBooks();
      runInAction(() => {
        this.privateBooks = privateBooks;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        this.isLoading = false;
      });
    }
  }

  async addBook(book) {
    this.isLoading = true;
    this.error = null;

    try {
      const success = this.showPrivateBooks
        ? await this.booksService.addPrivateBook(book)
        : await this.booksService.addBook(book);

      runInAction(() => {
        if (success) {
          if (this.showPrivateBooks) {
            this.privateBooks.push(book);
          } else {
            this.books.push(book);
          }
        }
        this.isLoading = false;
      });
      return success;
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        this.isLoading = false;
      });
      return false;
    }
  }

  setShowPrivateBooks(show) {
    this.showPrivateBooks = show;
  }

  getDisplayedBooks() {
    return this.showPrivateBooks ? this.privateBooks : this.books;
  }

  getPrivateBooksCount() {
    return this.privateBooks.length;
  }

  createNewBook() {
    return new Book();
  }
}
