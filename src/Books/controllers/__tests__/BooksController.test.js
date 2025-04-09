import BooksController from "../BooksController";
import BooksStore from "../../stores/BooksStore";

jest.mock("../../stores/BooksStore", () => {
  return jest.fn().mockImplementation(() => ({
    loadBooks: jest.fn().mockResolvedValue(true),
    loadPrivateBooks: jest.fn().mockResolvedValue(true),
    getDisplayedBooks: jest.fn().mockReturnValue([]),
    isLoading: false,
    error: null,
    addBook: jest.fn().mockResolvedValue(true),
    showPrivateBooks: false,
    setShowPrivateBooks: jest.fn(),
    getPrivateBooksCount: jest.fn().mockReturnValue(0),
    createNewBook: jest.fn().mockReturnValue({}),
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

  test("addBook should create a book and add it to store", async () => {
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

  test("getShowPrivateBooks should return showPrivateBooks state from store", () => {
    controller.booksStore.showPrivateBooks = true;

    expect(controller.getShowPrivateBooks()).toBe(true);

    controller.booksStore.showPrivateBooks = false;

    expect(controller.getShowPrivateBooks()).toBe(false);
  });

  test("setShowPrivateBooks should update state in store", () => {
    controller.setShowPrivateBooks(true);

    expect(controller.booksStore.setShowPrivateBooks).toHaveBeenCalledWith(
      true
    );

    controller.setShowPrivateBooks(false);

    expect(controller.booksStore.setShowPrivateBooks).toHaveBeenCalledWith(
      false
    );
  });

  test("getPrivateBooksCount should return private books count from store", () => {
    const mockCount = 5;
    controller.booksStore.getPrivateBooksCount.mockReturnValue(mockCount);

    expect(controller.getPrivateBooksCount()).toBe(mockCount);
    expect(controller.booksStore.getPrivateBooksCount).toHaveBeenCalledTimes(1);
  });

  test("createNewBook should delegate to store", () => {
    const mockBook = { id: "new", name: "", author: "Unknown" };
    controller.booksStore.createNewBook.mockReturnValue(mockBook);

    const result = controller.createNewBook();

    expect(result).toEqual(mockBook);
    expect(controller.booksStore.createNewBook).toHaveBeenCalledTimes(1);
  });
});
