import { Link } from "react-router";
import styles from "./Header.module.scss";

const Header = () => {
  return (
    <header className={styles.header}>
      <Link to="/">{`\u05D1\u05D9\u05EA`}</Link>
      <Link to="/catalogue">{`\u05E7\u05D8\u05DC\u05D5\u05D2`}</Link>
      <Link to="/adoption-form">{`\u05D8\u05D5\u05E4\u05E1 \u05D0\u05D9\u05DE\u05D5\u05E5`}</Link>
    </header>
  );
};

export default Header;
