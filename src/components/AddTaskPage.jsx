import { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { TasksContext } from '../context/TasksContext';
import '../styles/AddTaskPage.css';

const AddTaskPage = () => {
  const { addTask, updateTask, editingTask, setEditingTask } = useContext(TasksContext);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (editingTask) {
      setDate(editingTask.date);
      setTime(editingTask.time);
      setTaskTitle(editingTask.title);
      setTaskDescription(editingTask.description || '');
    }
  }, [editingTask]);

  const handleSubmit = () => {
    if (!date || !time || !taskTitle.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingTask) {
      updateTask(editingTask.id, { date, time, title: taskTitle, description: taskDescription });
      setSuccessMessage('Task updated successfully!');
      setEditingTask(null);
      setTimeout(() => {
        setSuccessMessage('');
        setDate(new Date().toISOString().split('T')[0]);
        setTime('');
        setTaskTitle('');
        setTaskDescription('');
      }, 2000);
    } else {
      addTask({ date, time, title: taskTitle, description: taskDescription });
      setSuccessMessage('Task added successfully!');
      // Reset form for adding new tasks
      setDate(new Date().toISOString().split('T')[0]);
      setTime('');
      setTaskTitle('');
      setTaskDescription('');
      setTimeout(() => setSuccessMessage(''), 2000);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h2 className="mb-4">{editingTask ? 'Edit Task' : 'Add New Task'}</h2>

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

                <div className="d-flex gap-2">
                  <Button
                    variant={editingTask ? 'warning' : 'success'}
                    size="lg"
                    onClick={handleSubmit}
                    className="flex-grow-1"
                  >
                    {editingTask ? 'Update Task' : 'Add Task'}
                  </Button>
                  {editingTask && (
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => {
                        setEditingTask(null);
                        setDate(new Date().toISOString().split('T')[0]);
                        setTime('');
                        setTaskTitle('');
                        setTaskDescription('');
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddTaskPage;
