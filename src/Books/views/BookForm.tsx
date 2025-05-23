import React, { useState } from "react";
import { observer } from "mobx-react";
import BooksController from "../controllers/BooksController";

interface BookFormProps {
  controller: BooksController;
}

const BookForm: React.FC<BookFormProps> = observer(({ controller }) => {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const error = controller.formError || controller.store.error;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await controller.addBook(name, author);
    
    if (success) {
      setName("");
      setAuthor("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <div>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Author:
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </label>
      </div>
      <button type="submit">Add Book</button>
    </form>
  );
});

export default BookForm;