import React from "react";
import "../styles/LayoutStyles.css";
import { adminMenu, userMenu } from "../Data/data";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { message } from "antd";

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    message.success("Logged out successfully");
    navigate("/login");
  };
  //user or admin
  const SidebarMenu = user?.isAdmin ? adminMenu : userMenu;
  return (
    <>
      <div className="main">
        <div className="layout">
          <div className="sidebar">
            <div className="logo">
              <img src={require("./../logo.png")} alt="GreenSync Logo" />
              <h4>GreenSync</h4>
              <hr></hr>
            </div>
            <div className="menu">
              {SidebarMenu.map((menu) => {
                const isActive = location.pathname === menu.path;
                return (
                  <>
                    <div className={`menu-item ${isActive && "active"}`}>
                      <Link to={menu.path}>
                        <i className={`${menu.icon} pin`}></i>
                        {menu.name}
                      </Link>
                    </div>
                  </>
                );
              })}
              <div className={`menu-item`} onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket pin"></i>
                <Link to="/login">Logout</Link>
              </div>
            </div>
          </div>
          <div className="content">
            <div className="header">
              <div className="header-content">
                <div className="left">
                  <i class="fa-solid fa-wheat-awn pin"></i>
                  <Link to="/settings">{user?.plant}</Link>
                </div>
                <div className="right">
                  <i className="fa-solid fa-bell pin"></i>
                  <Link to="/profile">{user?.name}</Link>
                </div>
              </div>
            </div>
            <div className="body">
              <div className="bodyfill">{children}</div>
              <div className="footer">
                <Link to="https://github.com/Aavash1738/GreenHouse">
                  <i class="fa-brands fa-github"></i>
                  View code
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
