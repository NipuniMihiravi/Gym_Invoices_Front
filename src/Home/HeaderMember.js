import React from "react";
import { useNavigate } from "react-router-dom";
import "./AppHome.css"; // optional, for header styling

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="logo-wrapper">
        <div className="logo-circle">LFP</div>
        <span className="logo-text">LIFE FITNESS PARTNER</span>

      </div>


    </header>
  );
};

export default Header;
