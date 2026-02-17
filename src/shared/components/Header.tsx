import React from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.scss";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          <Link to="/">בית</Link>
          <Link to="/catalogue">קטלוג</Link>
          <Link to="/adoption-form">טופס אימוץ</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
