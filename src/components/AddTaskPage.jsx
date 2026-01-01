import { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card, InputGroup } from 'react-bootstrap';
import { TasksContext } from '../context/TasksContext';
import '../styles/AddTaskPage.css';

const AddTaskPage = () => {
  const { addTask, updateTask, editingTask, setEditingTask } = useContext(TasksContext);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('');
  const [stopTime, setStopTime] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDetail, setTaskDetail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (editingTask) {
      setDate(editingTask.date);
      setStartTime(editingTask.startTime || editingTask.time || '');
      setStopTime(editingTask.stopTime || '');
      setTaskTitle(editingTask.title);
      setTaskDetail(editingTask.taskDetail || editingTask.description || '');
    }
  }, [editingTask]);

  const handleAutomaticTime = (setter) => {
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    setter(timeString);
  };

  const handleSubmit = () => {
    if (!date || !startTime || !taskTitle.trim()) {
      alert('Please fill in all required fields (Date, Start Time, and Task Title)');
      return;
    }

    const taskData = {
      date,
      startTime,
      stopTime,
      title: taskTitle,
      taskDetail,
    };

    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setSuccessMessage('Task updated successfully!');
      setEditingTask(null);
      setTimeout(() => {
        setSuccessMessage('');
        resetForm();
      }, 2000);
    } else {
      addTask(taskData);
      setSuccessMessage('Task added successfully!');
      resetForm();
      setTimeout(() => setSuccessMessage(''), 2000);
    }
  };

  const resetForm = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setStartTime('');
    setStopTime('');
    setTaskTitle('');
    setTaskDetail('');
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
                  <Form.Label className="fw-bold">Start Time *</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                    <Button 
                      variant="outline-primary" 
                      onClick={() => handleAutomaticTime(setStartTime)}
                    >
                      Automatic
                    </Button>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Stop Task Time</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="time"
                      value={stopTime}
                      onChange={(e) => setStopTime(e.target.value)}
                    />
                    <Button 
                      variant="outline-primary" 
                      onClick={() => handleAutomaticTime(setStopTime)}
                    >
                      Automatic
                    </Button>
                  </InputGroup>
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
                  <Form.Label className="fw-bold">Task Detail</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Enter task detail (optional)"
                    value={taskDetail}
                    onChange={(e) => setTaskDetail(e.target.value)}
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button
                    variant={editingTask ? 'warning' : 'success'}
                    size="lg"
                    onClick={handleSubmit}
                    className="flex-grow-1"
                  >
                    {editingTask ? 'Update Task' : 'Submit'}
                  </Button>
                  {editingTask && (
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => {
                        setEditingTask(null);
                        resetForm();
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
