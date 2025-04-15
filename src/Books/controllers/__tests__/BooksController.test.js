import BooksController from "../BooksController";
import BooksStore from "../../stores/BooksStore";
import Book from "../../models/Book";

const mockLoadBooks = jest.fn().mockResolvedValue([]);
const mockLoadPrivateBooks = jest.fn().mockResolvedValue([]);
const mockAddBook = jest.fn().mockResolvedValue(true);
const mockSetDisplayMode = jest.fn();

jest.mock("../../stores/BooksStore", () => {
  return jest.fn().mockImplementation(() => ({

    displayedBooks: [],
    isLoading: false,
    error: null,
    showPrivateBooks: false,
    privateBooks: [],
    
    loadBooks: mockLoadBooks,
    loadPrivateBooks: mockLoadPrivateBooks,
    addBook: mockAddBook,
    setDisplayMode: mockSetDisplayMode,
    
    set error(val) {
      this._error = val;
    },
    get error() {
      return this._error;
    }
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

    expect(mockLoadBooks).toHaveBeenCalledTimes(1);
    expect(mockLoadPrivateBooks).toHaveBeenCalledTimes(1);
  });

  test("addBook should validate inputs before creating a book", async () => {
    const result1 = await controller.addBook("", "");
    expect(result1).toBe(false);
    expect(controller.formError).toBe("Name and author are required");
    expect(mockAddBook).not.toHaveBeenCalled();

    controller.clearErrors();

    const result2 = await controller.addBook("Test Book", "");
    expect(result2).toBe(false);
    expect(controller.formError).toBe("Name and author are required");
    expect(mockAddBook).not.toHaveBeenCalled();

    controller.clearErrors();

    const result3 = await controller.addBook("", "Test Author");
    expect(result3).toBe(false);
    expect(controller.formError).toBe("Name and author are required");
    expect(mockAddBook).not.toHaveBeenCalled();

    controller.clearErrors();

    const name = "New Book";
    const author = "New Author";
    mockAddBook.mockResolvedValueOnce(true);
    const result4 = await controller.addBook(name, author);

    expect(mockAddBook).toHaveBeenCalledWith(
      expect.objectContaining({
        name,
        author,
      })
    );
    expect(result4).toBe(true);
  });

  test("setDisplayMode should update display mode only when changed", () => {
    controller.setDisplayMode(false);
    expect(mockSetDisplayMode).not.toHaveBeenCalled();
    
    controller.setDisplayMode(true);
    expect(mockSetDisplayMode).toHaveBeenCalledWith(true);
    mockSetDisplayMode.mockClear();
    
    controller.booksStore.showPrivateBooks = true;
    
    controller.setDisplayMode(true);
    expect(mockSetDisplayMode).not.toHaveBeenCalled();
    
    controller.setDisplayMode(false);
    expect(mockSetDisplayMode).toHaveBeenCalledWith(false);
  });

  test("clearErrors should reset form and store errors", () => {
    controller.formError = "Test form error";
    controller.booksStore.error = "Test store error";
     controller.clearErrors();
    
    expect(controller.formError).toBeNull();
    expect(controller.booksStore.error).toBeNull();
  });

  test("store getter should return the books store", () => {
    expect(controller.store).toBe(controller.booksStore);
  });
});
