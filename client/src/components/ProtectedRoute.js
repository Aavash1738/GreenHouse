import React, { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import axios from "axios";
import { setUser } from "../redux/features/userSlice";

export default function ProtectedRoutes({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      const getUser = async () => {
        try {
          dispatch(showLoading());
          const res = await axios.post(
            "/api/v1/user/getUserData",
            {
              token: localStorage.getItem("token"),
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          dispatch(hideLoading());
          if (res.data.success) {
            dispatch(setUser(res.data.data));
          } else {
            localStorage.clear();
            navigate("/login");
          }
        } catch (error) {
          localStorage.clear();
          dispatch(hideLoading());
          console.log(error);
        }
      };
      getUser();
    }
  }, [user, dispatch]);

  if (localStorage.getItem("token")) {
    if (isAdmin && location.pathname === "/") {
      return <Navigate to="/admin" />;
    } else if (!isAdmin && location.pathname === "/admin") {
      return <Navigate to="/" />;
    }
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}
