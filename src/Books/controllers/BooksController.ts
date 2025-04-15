import BooksStore from "../stores/BooksStore";
import Book from "../models/Book";

export default class BooksController {
  booksStore: BooksStore;

  constructor() {
    this.booksStore = new BooksStore();
  }

  async init(): Promise<void> {
    await Promise.all([this.loadBooks(), this.loadPrivateBooks()]);
  }

  async loadBooks(): Promise<Book[]> {
    return this.booksStore.loadBooks();
  }

  async loadPrivateBooks(): Promise<Book[]> {
    return this.booksStore.loadPrivateBooks();
  }

  getBooks(): Book[] {
    return this.booksStore.getDisplayedBooks();
  }

  getIsLoading(): boolean {
    return this.booksStore.isLoading;
  }

  getError(): string | null {
    return this.booksStore.error;
  }

  async addBook(name: string, author: string): Promise<boolean> {
    if (!name || !author) {
      this.booksStore.setError("Name and author are required");
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

  getShowPrivateBooks(): boolean {
    return this.booksStore.showPrivateBooks;
  }

  getPrivateBooksCount(): number {
    return this.booksStore.privateBooks.length;
  }
}