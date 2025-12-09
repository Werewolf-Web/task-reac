import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { TasksContext } from '../context/TasksContext';
import '../styles/AddTaskPage.css';

const AddTaskPage = () => {
  const { addTask } = useContext(TasksContext);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddTask = () => {
    if (!date || !time || !taskTitle.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    addTask({ date, time, title: taskTitle, description: taskDescription });

    // Reset form
    setDate(new Date().toISOString().split('T')[0]);
    setTime('');
    setTaskTitle('');
    setTaskDescription('');
    setSuccessMessage('Task added successfully!');
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h2 className="mb-4">Add New Task</h2>

              {successMessage && (
                <Alert variant="success" className="mb-3">
                  {successMessage}
                </Alert>
              )}

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Date *</Form.Label>
                  <Form.Control
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Time *</Form.Label>
                  <Form.Control
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Task Title *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter task title"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Enter task description (optional)"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                  />
                </Form.Group>

                <Button
                  variant="success"
                  size="lg"
                  onClick={handleAddTask}
                  className="w-100"
                >
                  Add Task
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddTaskPage;
