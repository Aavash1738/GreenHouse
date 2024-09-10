import React from "react";
import { Form, Input, message } from "antd";
import "../styles/LoginStyles.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const onfinishHandler = async (values) => {
    try {
      const res = await axios.post("/api/v1/user/login", values);
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        message.success("Login Successfuly");
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error("Something went wrong");
    }
  };

  return (
    <>
      <div className="form-container">
        <Form
          className="login-form"
          layout="vertical"
          onFinish={onfinishHandler}
        >
          <h3>Login Form</h3>
          <Form.Item label="Email" name="email">
            <Input type="email" required />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type="password" required />
          </Form.Item>
          <div className="buttons">
            <button className="btn btn-primary" type="submit">
              Login
            </button>
            <Link to="/Register" className="ms-2">
              <button className="btn btn-secondary">Register</button>
            </Link>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Login;
