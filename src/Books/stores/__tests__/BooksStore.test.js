import BooksStore from "../BooksStore";
import BooksService from "../../services/BooksService";
import Book from "../../models/Book";

jest.mock("../../services/BooksService", () => {
  const getBooksMock = jest.fn();
  const getPrivateBooksMock = jest.fn();
  const addBookMock = jest.fn();
  const addPrivateBookMock = jest.fn();
  
  return jest.fn().mockImplementation(() => ({
    getBooks: getBooksMock,
    getPrivateBooks: getPrivateBooksMock,
    addBook: addBookMock,
    addPrivateBook: addPrivateBookMock,
  }));
});

describe("BooksStore", () => {
  let store;
  let mockBooksService;

  beforeEach(() => {
    jest.clearAllMocks();
    
    BooksService.mockClear();
    
    store = new BooksStore();
    mockBooksService = BooksService.mock.results[0].value;
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

    const result = await store.loadBooks();

    expect(mockBooksService.getBooks).toHaveBeenCalledTimes(1);
    expect(store.books.length).toBe(2);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
    expect(result).toHaveLength(2);
  });

  test("loadBooks should handle errors", async () => {
    const errorMessage = "Failed to load books";
    mockBooksService.getBooks.mockRejectedValue(new Error(errorMessage));

    const result = await store.loadBooks();

    expect(mockBooksService.getBooks).toHaveBeenCalledTimes(1);
    expect(store.books).toEqual([]);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBe(errorMessage);
    expect(result).toEqual([]);
  });

  test("loadPrivateBooks should fetch private books and update state", async () => {
    const mockPrivateBooks = [
      { id: 3, name: "Private Book 1", author: "Author 3" },
      { id: 4, name: "Private Book 2", author: "Author 4" },
    ];

    mockBooksService.getPrivateBooks.mockResolvedValue(
      mockPrivateBooks.map((book) => new Book(book))
    );

    const result = await store.loadPrivateBooks();

    expect(mockBooksService.getPrivateBooks).toHaveBeenCalledTimes(1);
    expect(store.privateBooks.length).toBe(2);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
    expect(result).toHaveLength(2);
  });

  test("addBook should add to public books and reload private books when showPrivateBooks is false", async () => {
    const newBook = new Book({ name: "New Book", author: "New Author" });
    mockBooksService.addBook.mockResolvedValue(true);
    mockBooksService.getPrivateBooks.mockResolvedValue([]);
    
    store.showPrivateBooks = false;

    const result = await store.addBook(newBook);

    expect(result).toBe(true);
    expect(mockBooksService.addBook).toHaveBeenCalledWith(newBook);
    expect(mockBooksService.getPrivateBooks).toHaveBeenCalledTimes(1);
    expect(store.books).toContain(newBook);
    expect(store.isLoading).toBe(false);
  });

  test("addBook should add to private books and reload public books when showPrivateBooks is true", async () => {
    const newBook = new Book({
      name: "New Private Book",
      author: "Private Author",
    });
    mockBooksService.addPrivateBook.mockResolvedValue(true);
    mockBooksService.getBooks.mockResolvedValue([]);
    
    store.showPrivateBooks = true;

    const result = await store.addBook(newBook);

    expect(result).toBe(true);
    expect(mockBooksService.addPrivateBook).toHaveBeenCalledWith(newBook);
    expect(mockBooksService.getBooks).toHaveBeenCalledTimes(1);
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
    expect(mockBooksService.getPrivateBooks).not.toHaveBeenCalled();
  });

  test("setDisplayMode should update showPrivateBooks state", () => {
    expect(store.showPrivateBooks).toBe(false);
    
    store.setDisplayMode(true);
    expect(store.showPrivateBooks).toBe(true);
    
    store.setDisplayMode(false);
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

  test("setError should set error message and return false", () => {
    const errorMsg = "Test error";
    const result = store.setError(errorMsg);
    
    expect(store.error).toBe(errorMsg);
    expect(result).toBe(false);
  });
});