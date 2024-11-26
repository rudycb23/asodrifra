import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-light text-center py-3 shadow">
      <p className="mb-0">
        &copy; {currentYear} Asociación de Desarrollo Integral de San Francisco
        de Goicoechea
      </p>
    </footer>
  );
};

export default Footer;
