import { makeAutoObservable, runInAction } from "mobx";
import BooksStore from "../stores/BooksStore";
import Book from "../models/Book";
import BooksService from "../services/BooksService";

export default class BooksController {
  private booksStore: BooksStore;
  private booksService: BooksService;
  
  currentBook: Book | null = null;
  formError: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.booksService = new BooksService();
    this.booksStore = new BooksStore(this.booksService);
  }

  async init(): Promise<void> {
    await Promise.all([
      this.booksStore.loadBooks(),
      this.booksStore.loadPrivateBooks()
    ]);
  }

  async addBook(name: string, author: string): Promise<boolean> {
    this.formError = null;
    
    if (!name || !author) {
      runInAction(() => {
        this.formError = "Name and author are required";
      });
      return false;
    }
    
    const book = new Book({ name, author });
    return this.booksStore.addBook(book);
  }

  setDisplayMode(showPrivate: boolean): void {
    if (this.booksStore.showPrivateBooks !== showPrivate) {
      this.booksStore.setDisplayMode(showPrivate);
    }
  }

  clearErrors(): void {
    this.formError = null;
    this.booksStore.error = null;
  }

  get store(): BooksStore {
    return this.booksStore;
  }
}