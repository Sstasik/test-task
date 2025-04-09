import React from "react";
import { observer } from "mobx-react";

const Header = observer(({ controller }) => {
  const privateBooksCount = controller.getPrivateBooksCount();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        background: "#f0f0f0",
        padding: "10px",
        borderBottom: "1px solid #ccc",
        zIndex: 100,
      }}
    >
      <div>Your books: {privateBooksCount}</div>
    </header>
  );
});

export default Header;
