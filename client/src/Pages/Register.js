import React from "react";
import { Form, Input } from "antd";
import "../styles/RegisterStyles.css";
import { Link } from "react-router-dom";

const Register = () => {
  const onfinishHandler = (values) => {
    console.log(values);
  };

  return (
    <>
      <div className="form-container">
        <Form
          className="register-form"
          layout="vertical"
          onFinish={onfinishHandler}
        >
          <h3>Register Form</h3>
          <Form.Item label="Name" name="name">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input type="email" required />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type="password" required />
          </Form.Item>
          <div className="buttons">
            <button className="btn btn-primary" type="submit">
              Register
            </button>
            <Link to="/Login" className="ms-2">
              <button className="btn btn-secondary">Log In</button>
            </Link>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Register;
