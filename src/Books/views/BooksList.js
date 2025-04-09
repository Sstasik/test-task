import React from "react";
import { observer } from "mobx-react";

const BooksList = observer(({ controller }) => {
  const books = controller.getBooks();
  const isLoading = controller.getIsLoading();
  const error = controller.getError();
  const showPrivateBooks = controller.getShowPrivateBooks();

  const handleToggleView = (isPrivate) => {
    controller.setShowPrivateBooks(isPrivate);
  };

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
          onClick={() => handleToggleView(false)}
          className={!showPrivateBooks ? "active" : ""}
        >
          All Books
        </button>
        <button
          onClick={() => handleToggleView(true)}
          className={showPrivateBooks ? "active" : ""}
        >
          Private Books
        </button>
      </div>

      {books.length === 0 ? (
        <div>No books available</div>
      ) : (
        books.map((book, i) => (
          <div key={i}>
            {book.author}: {book.name}
          </div>
        ))
      )}
    </div>
  );
});

export default BooksList;
