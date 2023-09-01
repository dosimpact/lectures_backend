import React from "react";
import Nav from "./Nav";
import styles from "../styles/Home.module.css";

const Layout = ({ children }) => {
  return (
    <>
      <Nav />
      <div className={styles.container}>{children}</div>
    </>
  );
};

export default Layout;
