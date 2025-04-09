import React, { useState } from "react";
import { observer } from "mobx-react";

const BookForm = observer(({ controller }) => {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name && author) {
      await controller.addBook(name, author);
      setName("");
      setAuthor("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
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
            required
          />
        </label>
      </div>
      <button type="submit">Add Book</button>
    </form>
  );
});

export default BookForm;
