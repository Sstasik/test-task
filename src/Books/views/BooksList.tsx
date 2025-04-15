import React from "react";
import { observer } from "mobx-react";
import BooksController from "../controllers/BooksController";
import Book from "../models/Book";

interface BooksListProps {
  controller: BooksController;
}

const BooksList: React.FC<BooksListProps> = observer(({ controller }) => {
  const books = controller.getBooks();
  const isLoading = controller.getIsLoading();
  const error = controller.getError();
  const showPrivateBooks = controller.getShowPrivateBooks();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="books-toggle">
        <button
          onClick={() => controller.setDisplayMode(false)}
          className={!showPrivateBooks ? "active" : ""}
        >
          All Books
        </button>
        <button
          onClick={() => controller.setDisplayMode(true)}
          className={showPrivateBooks ? "active" : ""}
        >
          Private Books
        </button>
      </div>

      {books.length === 0 ? (
        <div>No books available</div>
      ) : (
        <div className="books-list">
          {books.map((book: Book, i: number) => (
            <div key={book.id || i} className="book-item">
              <strong>{book.name}</strong>: {book.author}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default BooksList;