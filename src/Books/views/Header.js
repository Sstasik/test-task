import React from "react";
import { observer } from "mobx-react";

const Header = observer(({ controller }) => {
  const privateBooksCount = controller.getPrivateBooksCount();

  return (
    <header
      style={{
        position: "sticky",
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
