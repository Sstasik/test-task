import BooksService from "../../services/BooksService";
import ApiGateway from "../../../Shared/ApiGateway";
import Book from "../../models/Book";

jest.mock("../../../Shared/ApiGateway", () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    post: jest.fn(),
  }));
});

describe("BooksService", () => {
  let service;
  let mockApiGateway;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new BooksService();
    mockApiGateway = service.httpGateway;
  });

  test("getBooks should fetch books from API and convert to Book models", async () => {
    const mockBooksDto = [
      { id: 1, name: "Book 1", author: "Author 1" },
      { id: 2, name: "Book 2", author: "Author 2" },
    ];

    mockApiGateway.get.mockResolvedValue(mockBooksDto);

    const result = await service.getBooks();

    expect(mockApiGateway.get).toHaveBeenCalledWith("/");
    expect(result.length).toBe(2);
    expect(result[0]).toBeInstanceOf(Book);
    expect(result[0].id).toBe(1);
    expect(result[0].name).toBe("Book 1");
    expect(result[0].author).toBe("Author 1");
  });

  test("getPrivateBooks should fetch private books from API", async () => {
    const mockPrivateBooksDto = [
      { id: 3, name: "Private Book 1", author: "Author 3" },
      { id: 4, name: "Private Book 2", author: "Author 4" },
    ];

    mockApiGateway.get.mockResolvedValue(mockPrivateBooksDto);

    const result = await service.getPrivateBooks();

    expect(mockApiGateway.get).toHaveBeenCalledWith("/private");
    expect(result.length).toBe(2);
    expect(result[0]).toBeInstanceOf(Book);
    expect(result[0].id).toBe(3);
    expect(result[0].name).toBe("Private Book 1");
  });

  test("addBook should post book to API", async () => {
    const book = new Book({ name: "New Book", author: "New Author" });
    mockApiGateway.post.mockResolvedValue({ status: "ok" });

    const result = await service.addBook(book);

    expect(mockApiGateway.post).toHaveBeenCalledWith("", {
      name: "New Book",
      author: "New Author",
    });
    expect(result).toBe(true);
  });

  test("addBook should handle API failure", async () => {
    const book = new Book({ name: "Failed Book", author: "Failed Author" });
    mockApiGateway.post.mockResolvedValue({ status: "error" });

    const result = await service.addBook(book);

    expect(mockApiGateway.post).toHaveBeenCalledWith("", {
      name: "Failed Book",
      author: "Failed Author",
    });
    expect(result).toBe(false);
  });

  test("addPrivateBook should post private book to API", async () => {
    const book = new Book({
      name: "New Private Book",
      author: "Private Author",
    });
    mockApiGateway.post.mockResolvedValue({ status: "ok" });

    const result = await service.addPrivateBook(book);

    expect(mockApiGateway.post).toHaveBeenCalledWith("/", {
      name: "New Private Book",
      author: "Private Author",
    });
    expect(result).toBe(true);
  });

  test("addPrivateBook should handle API failure", async () => {
    const book = new Book({
      name: "Failed Private Book",
      author: "Failed Private Author",
    });
    mockApiGateway.post.mockResolvedValue(null);
  
    const result = await service.addPrivateBook(book);
  
    expect(mockApiGateway.post).toHaveBeenCalledWith("/", {
      name: "Failed Private Book",
      author: "Failed Private Author",
    });
    expect(result).toBeFalsy();  
  });
});
