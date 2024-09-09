import React from "react";
import { Form, Input } from "antd";
import "../styles/LoginStyles.css";
import { Link } from "react-router-dom";

const Login = () => {
  const onfinishHandler = (values) => {
    console.log(values);
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
