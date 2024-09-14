import React, { useEffect } from "react";
import axios from "axios";
import Layout from "./../components/Layout";
import { useSelector } from "react-redux";

const HomePage = () => {
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
        Hello <span id="username">{user?.name}</span>. Welcome to GreenSync
        console.
      </h3>
      <ul>
        <li>
          Visit Monitor to get a view of the current greenhouse parameters.
        </li>
        <li>View Controllers to see which actuators are currently running.</li>
        <li>Visit Profiles to change account details or credentials.</li>
      </ul>
    </Layout>
  );
};

export default HomePage;
