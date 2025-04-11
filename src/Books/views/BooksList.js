import React from "react";
import { observer } from "mobx-react";

const BooksList = observer(({ controller }) => {
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
          onClick={() => controller.togglePrivateBooks(false)}
          className={!showPrivateBooks ? "active" : ""}
        >
          All Books
        </button>
        <button
          onClick={() => controller.togglePrivateBooks(true)}
          className={showPrivateBooks ? "active" : ""}
        >
          Private Books
        </button>
      </div>

      {books.length === 0 ? (
        <div>No books available</div>
      ) : (
        <div className="books-list">
          {books.map((book, i) => (
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
