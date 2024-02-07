// import React from 'react';
// import { Form, Input, Button, Row, Col } from 'antd';
// import './sign.css';
//
// const SignupPage = () => {
//   const onFinish = (values) => {
//     console.log('Received values:', values);
//   };
//
//   return (
//     <div className="signup-container">
//       <Row justify="center" align="middle" style={{ height: '100vh' }}>
//         <Col span={8}>
//           <h1 className="signup-title">Sign Up</h1>
//           <Form
//             name="signup"
//             onFinish={onFinish}
//             layout="vertical"
//           >
//             <Form.Item
//               label="Username"
//               name="username"
//               rules={[{ required: true, message: 'Please input your username!' }]}
//             >
//               <Input />
//             </Form.Item>
//
//             <Form.Item
//               label="Email"
//               name="email"
//               rules={[
//                 { required: true, message: 'Please input your email!' },
//                 { type: 'email', message: 'Please enter a valid email address!' },
//               ]}
//             >
//               <Input />
//             </Form.Item>
//
//             <Form.Item
//               label="Phone Number"
//               name="phone"
//               rules={[
//                 { required: true, message: 'Please input your phone number!' },
//                 // Add additional phone number validation rules as needed
//               ]}
//             >
//               <Input />
//             </Form.Item>
//
//             <Form.Item
//               label="Password"
//               name="password"
//               rules={[{ required: true, message: 'Please input your password!' }]}
//             >
//               <Input.Password />
//             </Form.Item>
//
//             <Form.Item
//               label="Confirm Password"
//               name="confirmPassword"
//               dependencies={['password']}
//               rules={[
//                 { required: true, message: 'Please confirm your password!' },
//                 ({ getFieldValue }) => ({
//                   validator(_, value) {
//                     if (!value || getFieldValue('password') === value) {
//                       return Promise.resolve();
//                     }
//                     return Promise.reject(new Error('The two passwords do not match!'));
//                   },
//                 }),
//               ]}
//             >
//               <Input.Password />
//             </Form.Item>
//
//             <Form.Item>
//               <Button type="primary" htmlType="submit">
//                 Sign Up
//               </Button>
//             </Form.Item>
//           </Form>
//         </Col>
//       </Row>
//     </div>
//   );
// };
//
// export default SignupPage;
