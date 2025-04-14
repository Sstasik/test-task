import React from "react";
import { observer } from "mobx-react";
import BooksController from "../controllers/BooksController";

interface HeaderProps {
  controller: BooksController;
}

const Header: React.FC<HeaderProps> = observer(({ controller }) => {
  const privateBooksCount = controller.getPrivateBooksCount();

  return (
    <header
      style={{
        position: "sticky" as const,
        top: 0,
        background: "pink",
        padding: "10px",
        borderBottom: "1px solid #ccc",
        zIndex: 100,
      }}
    >
      <div style={{color: "black"}}>Your books: {privateBooksCount}</div>
    </header>
  );
});

export default Header;