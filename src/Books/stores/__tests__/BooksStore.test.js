import { when } from "mobx";
import BooksStore from "../BooksStore";
import BooksService from "../../services/BooksService";
import Book from "../../models/Book";

jest.mock("../../services/BooksService", () => {
  return jest.fn().mockImplementation(() => ({
    getBooks: jest.fn(),
    getPrivateBooks: jest.fn(),
    addBook: jest.fn(),
    addPrivateBook: jest.fn(),
  }));
});

describe("BooksStore", () => {
  let store;
  let mockBooksService;

  beforeEach(() => {
    jest.clearAllMocks();
    store = new BooksStore();
    mockBooksService = store.booksService;
  });

  test("should initialize with default values", () => {
    expect(store.books).toEqual([]);
    expect(store.privateBooks).toEqual([]);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
    expect(store.showPrivateBooks).toBe(false);
  });

  test("loadBooks should fetch books and update state", async () => {
    const mockBooks = [
      { id: 1, name: "Book 1", author: "Author 1" },
      { id: 2, name: "Book 2", author: "Author 2" },
    ];

    mockBooksService.getBooks.mockResolvedValue(
      mockBooks.map((book) => new Book(book))
    );

    await store.loadBooks();

    expect(mockBooksService.getBooks).toHaveBeenCalledTimes(1);
    expect(store.books.length).toBe(2);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
  });

  test("loadBooks should handle errors", async () => {
    const errorMessage = "Failed to load books";
    mockBooksService.getBooks.mockRejectedValue(new Error(errorMessage));

    await store.loadBooks();

    expect(mockBooksService.getBooks).toHaveBeenCalledTimes(1);
    expect(store.books).toEqual([]);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBe(errorMessage);
  });

  test("loadPrivateBooks should fetch private books and update state", async () => {
    const mockPrivateBooks = [
      { id: 3, name: "Private Book 1", author: "Author 3" },
      { id: 4, name: "Private Book 2", author: "Author 4" },
    ];

    mockBooksService.getPrivateBooks.mockResolvedValue(
      mockPrivateBooks.map((book) => new Book(book))
    );

    await store.loadPrivateBooks();

    expect(mockBooksService.getPrivateBooks).toHaveBeenCalledTimes(1);
    expect(store.privateBooks.length).toBe(2);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
  });

  test("addBook should add to public books when showPrivateBooks is false", async () => {
    const newBook = new Book({ name: "New Book", author: "New Author" });
    mockBooksService.addBook.mockResolvedValue(true);
    store.showPrivateBooks = false;

    const result = await store.addBook(newBook);

    expect(result).toBe(true);
    expect(mockBooksService.addBook).toHaveBeenCalledWith(newBook);
    expect(store.books).toContain(newBook);
    expect(store.isLoading).toBe(false);
  });

  test("addBook should add to private books when showPrivateBooks is true", async () => {
    const newBook = new Book({
      name: "New Private Book",
      author: "Private Author",
    });
    mockBooksService.addPrivateBook.mockResolvedValue(true);
    store.showPrivateBooks = true;

    const result = await store.addBook(newBook);

    expect(result).toBe(true);
    expect(mockBooksService.addPrivateBook).toHaveBeenCalledWith(newBook);
    expect(store.privateBooks).toContain(newBook);
    expect(store.isLoading).toBe(false);
  });

  test("addBook should handle failure", async () => {
    const newBook = new Book({ name: "Failed Book", author: "Failed Author" });
    mockBooksService.addBook.mockResolvedValue(false);
    store.showPrivateBooks = false;

    const result = await store.addBook(newBook);

    expect(result).toBe(false);
    expect(mockBooksService.addBook).toHaveBeenCalledWith(newBook);
    expect(store.books).not.toContain(newBook);
  });

  test("addBook should handle errors", async () => {
    const newBook = new Book({ name: "Error Book", author: "Error Author" });
    const errorMessage = "Failed to add book";
    mockBooksService.addBook.mockRejectedValue(new Error(errorMessage));
    store.showPrivateBooks = false;

    const result = await store.addBook(newBook);

    expect(result).toBe(false);
    expect(mockBooksService.addBook).toHaveBeenCalledWith(newBook);
    expect(store.error).toBe(errorMessage);
    expect(store.books).not.toContain(newBook);
  });

  test("setShowPrivateBooks should toggle between public and private books", () => {
    expect(store.showPrivateBooks).toBe(false);

    store.setShowPrivateBooks(true);
    expect(store.showPrivateBooks).toBe(true);

    store.setShowPrivateBooks(false);
    expect(store.showPrivateBooks).toBe(false);
  });

  test("getDisplayedBooks should return correct books based on showPrivateBooks", () => {
    store.books = [
      new Book({ id: 1, name: "Public Book", author: "Public Author" }),
    ];
    store.privateBooks = [
      new Book({ id: 2, name: "Private Book", author: "Private Author" }),
    ];

    store.showPrivateBooks = false;
    expect(store.getDisplayedBooks()).toEqual(store.books);

    store.showPrivateBooks = true;
    expect(store.getDisplayedBooks()).toEqual(store.privateBooks);
  });

  test("getPrivateBooksCount should return the number of private books", () => {
    store.privateBooks = [
      new Book({ id: 1, name: "Private Book 1", author: "Author 1" }),
      new Book({ id: 2, name: "Private Book 2", author: "Author 2" }),
    ];

    expect(store.getPrivateBooksCount()).toBe(2);

    store.privateBooks.push(
      new Book({ id: 3, name: "Private Book 3", author: "Author 3" })
    );
    expect(store.getPrivateBooksCount()).toBe(3);
  });

  test("createNewBook should return a new Book instance", () => {
    const book = store.createNewBook();

    expect(book).toBeInstanceOf(Book);
    expect(book.name).toBe("");
    expect(book.author).toBe("Unknown");
  });
});
