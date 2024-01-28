import React from 'react';
import { Form, Button, Row, Col, Input, Typography } from 'antd';
import { Link } from 'react-router-dom';
import './homePage.css';

const { Text } = Typography;

const HomePage = () => {
  const onFinishSubtenant = (values) => {
    console.log('Logging in as a Subtenant with:', values);
    // Add logic to handle login as a Subtenant based on values (username, password)
  };

  const onFinishHouseHolder = (values) => {
    console.log('Logging in as a House Holder with:', values);
    // Add logic to handle login as a House Holder based on values (username, password)
  };

  return (
    <div className="homePage-container">
      <h1 className="homePage-title">Find Your Match!</h1>
      <Row justify="center" align="middle" style={{ height: '60vh' }}>
        <Col span={8}>
          <Form name="login" layout="vertical">
            <Form.Item
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
            </Form.Item>

            <Form.Item>
              <Link to="/login_holder">
                <Button type="primary" onClick={() => onFinishHouseHolder()}>
                  Login As A House Holder
                </Button>
              </Link>
            </Form.Item>

            <Form.Item>
              <Link to="/login_subtenant">
                <Button type="primary" onClick={() => onFinishSubtenant()}>
                  Login As A Subtenant
                </Button>
              </Link>
            </Form.Item>

            <Form.Item>
              <Text>
                <Link to="/signup">Sign Up</Link> or <Link to="/forgot-password">Forgot Password</Link>
              </Text>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
