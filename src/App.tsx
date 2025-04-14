import React, { useEffect } from "react";
import { observer } from "mobx-react";
import BooksController from "./Books/controllers/BooksController";
import Header from "./Books/views/Header";
import BooksList from "./Books/views/BooksList";
import BookForm from "./Books/views/BookForm";

const App: React.FC = observer(() => {
  const booksController = React.useRef(new BooksController()).current;

  useEffect(() => {
    booksController.init();
  }, [booksController]);

  return (
    <div className="App">
      <Header controller={booksController} />
      <h1>Books Library</h1>
      <BooksList controller={booksController} />
      <h2>Add New Book</h2>
      <BookForm controller={booksController} />
    </div>
  );
});

export default App;