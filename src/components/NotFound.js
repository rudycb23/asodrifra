import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <h1 className="display-4 text-danger fw-bolder">404</h1>
      <p className="text-muted fw-bolder">La página que buscas no existe.</p>
      <Link to="/">
        <button className="btn btn-secondary">Volver al Inicio</button>
      </Link>
    </div>
  );
};

export default NotFound;
