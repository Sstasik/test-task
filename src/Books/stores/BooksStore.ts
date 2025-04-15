import { makeAutoObservable, runInAction } from "mobx";
import BooksService from "../services/BooksService";
import Book from "../models/Book";

export default class BooksStore {
  books: Book[] = [];
  privateBooks: Book[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  showPrivateBooks: boolean = false;

  constructor(private booksService: BooksService) {
    makeAutoObservable(this);
  }

  async loadBooks(): Promise<Book[]> {
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
        this.error = error instanceof Error ? error.message : String(error);
        this.isLoading = false;
      });
      return [];
    }
  }

  async loadPrivateBooks(): Promise<Book[]> {
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
        this.error = error instanceof Error ? error.message : String(error);
        this.isLoading = false;
      });
      return [];
    }
  }

  async addBook(book: Book): Promise<boolean> {
    this.isLoading = true;
    this.error = null;

    try {
      let success: boolean;

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
        this.error = error instanceof Error ? error.message : String(error);
        this.isLoading = false;
      });
      return false;
    }
  }

  setError(message: string): boolean {
    this.error = message;
    return false;
  }

  setDisplayMode(showPrivate: boolean): void {
    runInAction(() => {
      this.showPrivateBooks = showPrivate;
    });
  }

  get displayedBooks(): Book[] {
    return this.showPrivateBooks ? this.privateBooks : this.books;
  }
}