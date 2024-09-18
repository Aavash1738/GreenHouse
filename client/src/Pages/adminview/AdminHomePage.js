import React, { useEffect } from "react";
import axios from "axios";
import Layout from "./../../components/Layout";
import { useSelector } from "react-redux";

const AdminHomePage = () => {
  console.log("We are here");
  const { user } = useSelector((state) => state.user);
  //user data
  const getUserData = async () => {
    try {
      const res = await axios.post(
        "/api//v1/user/getUserData",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);

  return (
    <Layout>
      <h3>
        Hello <span id="username">{user?.name}</span>. Welcome to your GreenSync
        console.
      </h3>
      <h6>Manage and view users in your application.</h6>
    </Layout>
  );
};

export default AdminHomePage;
