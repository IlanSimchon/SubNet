// SubProfilePage.js

import React, { useState } from 'react';
import { Row, Col, Card, Avatar, Rate, Typography, Upload, message, Button } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons'; // Import icons
import './subProfilePage.css';

const { Title, Text } = Typography;

const SubProfilePage = () => {
  const [profilePhoto, setProfilePhoto] = useState(null);

  const handleUploadChange = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      // You can handle the uploaded file, e.g., save it to state or send it to the server
      setProfilePhoto(info.file.originFileObj);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <div className="profile-page">
      <Title level={2}>My Profile</Title>

      <Row gutter={[16, 16]}>
        {/* Profile Box */}
        <Col span={24}>
          <div className="profile-box">
            {/* Left: Profile Photo */}
            <Card>
              <Upload
                showUploadList={false}
                customRequest={({ file, onSuccess }) => {
                  setTimeout(() => {
                    onSuccess('ok');
                  }, 0);
                }}
                onChange={handleUploadChange}
              >
                <Avatar size={150} icon={profilePhoto ? null : <UserOutlined />} src={profilePhoto} />
                <div style={{ marginTop: 16 }}>
                  <Button icon={<UploadOutlined />}>Upload Photo</Button>
                </div>
              </Upload>
            </Card>

            {/* Right: Personal Details and Rating */}
            <Card>
              {/* Top Right: Personal Details */}
              <Title level={4}>Personal Details</Title>
              <Text>Name: John Doe</Text>
              <Text>Email: john@example.com</Text>
              <Text>Location: City, Country</Text>
              {/* Add more personal details as needed */}

              {/* Bottom Right: Rating */}
              <Title level={4}>Rating</Title>
              <Rate allowHalf defaultValue={4.5} />
              {/* Display additional information related to the rating */}
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default SubProfilePage;
