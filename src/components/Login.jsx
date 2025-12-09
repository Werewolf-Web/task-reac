import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import '../styles/Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const correctUsername = 'netsujal';
  const correctPassword = 'net@123';

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    if (username === correctUsername && password === correctPassword) {
      onLogin(username);
      setUsername('');
      setPassword('');
    } else {
      setError('Invalid username or password');
      setPassword('');
    }
  };

  return (
    <Container className="login-container">
      <div className="login-wrapper">
        <Card className="login-card shadow-lg">
          <Card.Body className="p-5">
            <h1 className="text-center mb-2 login-title">✨ Daily Task Master</h1>
            <p className="text-center text-muted mb-4">Organize your day, achieve your goals</p>

            {error && <Alert variant="danger" className="mb-3">⚠️ {error}</Alert>}

            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control-lg"
                />
               
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control-lg"
                />
                
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100 btn-lg fw-bold login-btn"
              >
                 Login to Dashboard
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default Login;
