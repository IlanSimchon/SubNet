import React, { useState } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import '../src/login.css';

const LoginHolderPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Perform login logic here (e.g., send data to a server)
    console.log('Logging in with:', { username, password });
  };

  const handleForgotPassword = () => {
    // Implement forgot password logic (e.g., redirect to a password recovery page)
    console.log('Forgot Password clicked');
  };

  return (
    <Row justify="center" align="middle" style={{ height: '100vh' }}>
      <Col span={8}>
        <div className="login-container">
          <h1>Login</h1>
          <Form>
            <Form.Item label="Username">
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Password">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" onClick={handleLogin}>
                Login
              </Button>
            </Form.Item>

            <Form.Item>
              <Button type="link" onClick={handleForgotPassword}>
                Forgot Password
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default LoginHolderPage;
