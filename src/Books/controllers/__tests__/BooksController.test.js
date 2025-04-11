import BooksController from "../BooksController";
import BooksStore from "../../stores/BooksStore";

jest.mock("../../stores/BooksStore", () => {
  return jest.fn().mockImplementation(() => ({
    loadBooks: jest.fn().mockResolvedValue([]),
    loadPrivateBooks: jest.fn().mockResolvedValue([]),
    getDisplayedBooks: jest.fn().mockReturnValue([]),
    isLoading: false,
    error: null,
    addBook: jest.fn().mockResolvedValue(true),
    showPrivateBooks: false,
    setError: jest.fn().mockReturnValue(false),
    privateBooks: [],
  }));
});

describe("BooksController", () => {
  let controller;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new BooksController();
  });

  test("init should load both regular and private books", async () => {
    await controller.init();

    expect(controller.booksStore.loadBooks).toHaveBeenCalledTimes(1);
    expect(controller.booksStore.loadPrivateBooks).toHaveBeenCalledTimes(1);
  });

  test("getBooks should return books from store", () => {
    const mockBooks = [{ id: 1, name: "Test Book", author: "Test Author" }];
    controller.booksStore.getDisplayedBooks.mockReturnValue(mockBooks);

    const result = controller.getBooks();

    expect(result).toEqual(mockBooks);
    expect(controller.booksStore.getDisplayedBooks).toHaveBeenCalledTimes(1);
  });

  test("getIsLoading should return loading state from store", () => {
    controller.booksStore.isLoading = true;

    expect(controller.getIsLoading()).toBe(true);

    controller.booksStore.isLoading = false;

    expect(controller.getIsLoading()).toBe(false);
  });

  test("getError should return error from store", () => {
    const mockError = "Test error";
    controller.booksStore.error = mockError;

    expect(controller.getError()).toBe(mockError);
  });

  test("addBook should validate inputs before creating a book", async () => {
    await controller.addBook("", "");
    expect(controller.booksStore.setError).toHaveBeenCalledWith("Name and author are required");
    expect(controller.booksStore.addBook).not.toHaveBeenCalled();

    const name = "New Book";
    const author = "New Author";

    await controller.addBook(name, author);

    expect(controller.booksStore.addBook).toHaveBeenCalledWith(
      expect.objectContaining({
        name,
        author,
      })
    );
  });

  test("togglePrivateBooks should update state in store", () => {
    controller.togglePrivateBooks(true);
    expect(controller.booksStore.showPrivateBooks).toBe(true);

    controller.togglePrivateBooks(false);
    expect(controller.booksStore.showPrivateBooks).toBe(false);
  });

  test("getPrivateBooksCount should return private books count", () => {
    controller.booksStore.privateBooks = [{}, {}, {}];
    expect(controller.getPrivateBooksCount()).toBe(3);
  });
});
