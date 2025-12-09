import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  ListGroup,
  Badge,
  Modal,
  Alert,
} from 'react-bootstrap';
import '../styles/TaskManager.css';

const TaskManager = ({ currentUser, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Load tasks from localStorage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem('dailyTasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('dailyTasks', JSON.stringify(tasks));
  }, [tasks]);

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  const addTask = () => {
    if (!date || !time || !taskTitle.trim()) {
      alert('Please fill in all fields');
      return;
    }

    if (editingId) {
      // Edit existing task
      setTasks(
        tasks.map((task) =>
          task.id === editingId
            ? {
                ...task,
                date,
                time,
                title: taskTitle,
                description: taskDescription,
              }
            : task
        )
      );
      showSuccessMessage('Task updated successfully!');
      setEditingId(null);
    } else {
      // Add new task
      const newTask = {
        id: Date.now(),
        date,
        time,
        title: taskTitle,
        description: taskDescription,
      };
      setTasks([...tasks, newTask]);
      showSuccessMessage('Task added successfully!');
    }

    // Reset form
    setDate(new Date().toISOString().split('T')[0]);
    setTime('');
    setTaskTitle('');
    setTaskDescription('');
    setShowModal(false);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    showSuccessMessage('Task deleted successfully!');
  };

  const editTask = (task) => {
    setEditingId(task.id);
    setDate(task.date);
    setTime(task.time);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setShowModal(true);
  };



  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setDate(new Date().toISOString().split('T')[0]);
    setTime('');
    setTaskTitle('');
    setTaskDescription('');
  };

  // Filter and search tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesDate = !filterDate || task.date === filterDate;
    const matchesSearch =
      !searchTerm ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDate && matchesSearch;
  });

  // Sort tasks by date and time
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateB - dateA;
  });

  const todayTasks = sortedTasks.filter((task) => task.date === new Date().toISOString().split('T')[0]);

  return (
    <Container fluid className="task-manager-container py-4">
      {/* Header */}
      <Row className="mb-4 align-items-center g-3">
        <Col xs={12} md={8}>
          <div className="header-section">
            <h1 className="mb-2">📋 Daily Task Manager</h1>
            <p className="text-muted mb-0">
              Welcome, <strong>{currentUser}</strong>! Manage your tasks efficiently.
            </p>
          </div>
        </Col>
        <Col xs={12} md={4} className="d-grid d-md-flex justify-content-md-end">
          <Button variant="danger" onClick={onLogout} className="btn-lg">
            Logout
          </Button>
        </Col>
      </Row>

      {/* Success Message */}
      {successMessage && (
        <Alert variant="success" className="alert-dismissible fade show">
          ✓ {successMessage}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Row className="mb-4 g-2">
        <Col xs={12} md={6}>
          <Card className="stat-card bg-primary text-white">
            <Card.Body>
              <h5 className="mb-0">Total Tasks</h5>
              <h2 className="mb-0">{tasks.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="stat-card bg-success text-white">
            <Card.Body>
              <h5 className="mb-0">Today's Tasks</h5>
              <h2 className="mb-0">{todayTasks.length}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Task Button & Search Section */}
      <Row className="mb-4 g-2">
        <Col xs={12} sm={6}>
          <Button
            variant="success"
            size="lg"
            onClick={() => setShowModal(true)}
            className="w-100 btn-add-task"
          >
            ➕ Add New Task
          </Button>
        </Col>
        <Col xs={12} sm={6}>
          <Form.Control
            type="text"
            placeholder="🔍 Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control-lg"
          />
        </Col>
      </Row>

      {/* Filter by Date */}
      <Row className="mb-4">
        <Col xs={12}>
          <Form.Group>
            <Form.Label className="fw-bold">Filter by Date:</Form.Label>
            <Form.Control
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
            {filterDate && (
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setFilterDate('')}
                className="mt-2"
              >
                Clear Filter
              </Button>
            )}
          </Form.Group>
        </Col>
      </Row>

      {/* Tasks List */}
      <Row>
        <Col xs={12}>
          <h3 className="mb-3">
            Tasks {filterDate && `- ${new Date(filterDate).toLocaleDateString()}`}
          </h3>
          {sortedTasks.length === 0 ? (
            <Alert variant="info" className="text-center">
              <h5>No tasks yet!</h5>
              <p>Click "Add New Task" to create your first task.</p>
            </Alert>
          ) : (
            <ListGroup className="tasks-list">
              {sortedTasks.map((task) => (
                <ListGroup.Item key={task.id} className="task-item mb-3">
                  <Row className="align-items-start g-2">
                    <Col xs={12} md={8}>
                      <div>
                        <h5 className="mb-2">{task.title}</h5>
                        {task.description && (
                          <p className="mb-3 text-muted task-description">{task.description}</p>
                        )}
                        <div className="task-meta">
                          <Badge bg="info" className="me-2">
                            📅 {new Date(task.date).toLocaleDateString()}
                          </Badge>
                          <Badge bg="warning" text="dark">
                            🕒 {task.time}
                          </Badge>
                        </div>
                      </div>
                    </Col>
                    <Col xs={12} md={4} className="task-actions">
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => editTask(task)}
                        className="me-2 mb-2 mb-md-0"
                      >
                        ✏️ Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                        className="mb-2 mb-md-0"
                      >
                        🗑️ Delete
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>

      {/* Add/Edit Task Modal */}
      <Modal show={showModal} onHide={closeModal} centered size="lg" fullscreen="sm-down">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingId ? '✏️ Edit Task' : '➕ Add New Task'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-3 p-md-4">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Date</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Time</Form.Label>
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

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter task description (optional)"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={addTask}>
            {editingId ? 'Update Task' : 'Add Task'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TaskManager;
