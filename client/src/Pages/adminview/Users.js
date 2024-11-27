import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import { Table } from "antd";
import "./../../styles/UserView.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const getUsers = async () => {
    try {
      const res = await axios.get("/api/v1/admin/getAllUsers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);

  const deleteUser = async (id, name) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${name}? This action is not-reversible.`
      )
    ) {
      const res = await axios.post(
        "/api/v1/admin/deleteUser",
        { userId: id }, // Make sure userId is being sent correctly
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.success) {
        setUsers(res.data.data);
        alert("User deleted successfully");
      }
      window.location.reload();
    } else {
      return;
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "User Id",
      dataIndex: "_id",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          <button
            className="btn btn-danger"
            onClick={() => {
              deleteUser(record._id, record.name);
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];
  return (
    <Layout>
      <h1 className="text-center">Users List</h1>
      <Table columns={columns} dataSource={users} />
    </Layout>
  );
};

export default Users;
