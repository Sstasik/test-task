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
      return books;
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        this.isLoading = false;
      });
      return [];
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
      return privateBooks;
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        this.isLoading = false;
      });
      return [];
    }
  }

  async addBook(book) {
    this.isLoading = true;
    this.error = null;

    try {
      let success;

      if (this.showPrivateBooks) {
        success = await this.booksService.addPrivateBook(book);

        if (success) {
          runInAction(() => {
            this.privateBooks.push(book);
            this.isLoading = false;
          });
          await this.loadBooks();
        } else {
          runInAction(() => {
            this.isLoading = false;
          });
        }
      } else {
        success = await this.booksService.addBook(book);

        if (success) {
          runInAction(() => {
            this.books.push(book);
            this.isLoading = false;
          });

          await this.loadPrivateBooks();
        } else {
          runInAction(() => {
            this.isLoading = false;
          });
        }
      }

      return success;
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        this.isLoading = false;
      });
      return false;
    }
  }

  setError(message) {
    this.error = message;
    return false;
  }

  getDisplayedBooks() {
    return this.showPrivateBooks ? this.privateBooks : this.books;
  }
}
