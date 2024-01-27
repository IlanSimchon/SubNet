import React from 'react';
import { Form, Button, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import './login.css'; 

const LoginPage = () => {
  const onFinish = (values) => {
    console.log('Received values:', values);
    // Add your login logic here
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Find Your Match!</h1>
      <Row justify="center" align="middle" style={{ height: '60vh' }}>
        <Col span={8}>
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item>
            <Link to="/login_subtenant">
                <Button type="default">
                  Loginn As A Subtenant
                </Button>
              </Link>
            </Form.Item>
            {/* <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password />
            </Form.Item> */}

            <Form.Item>
              {/* <Button type="primary" htmlType="submit">
                Login
              </Button> */}
                <Link to="/login_holder">
                <Button type="default">
                  Login As A House Holder
                </Button>
              </Link>
            </Form.Item>

            <Form.Item>
              <Link to="/signup">
                <Button type="default">
                  Sign Up
                </Button>
              </Link>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;
