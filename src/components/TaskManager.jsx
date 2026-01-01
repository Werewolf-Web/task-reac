import React, { useState, useEffect, useContext } from 'react';
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
  InputGroup,
} from 'react-bootstrap';
import '../styles/TaskManager.css';
import AllTasksPage from './AllTasksPage';
import { TasksContext } from '../context/TasksContext';
import { formatDate } from '../utils/exportUtils';

const TaskManager = ({ currentUser, onLogout }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('');
  const [stopTime, setStopTime] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDetail, setTaskDetail] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const {
    tasks,
    addTask,
    updateTask,
    removeTask,
    showModal,
    setShowModal,
    editingTask,
    openAddModal,
    openEditModal,
    showAllTasksPage,
    openAllTasksPage,
    closeAllTasksPage,
    searchTerm,
    setSearchTerm,
    filterDate,
    setFilterDate,
    filterStatus,
    setFilterStatus,
  } = useContext(TasksContext);


  // Sync local form with editingTask from context
  useEffect(() => {
    if (editingTask) {
      setEditingId(editingTask.id);
      setDate(editingTask.date || new Date().toISOString().split('T')[0]);
      setStartTime(editingTask.startTime || editingTask.time || '');
      setStopTime(editingTask.stopTime || '');
      setTaskTitle(editingTask.title || '');
      setTaskDetail(editingTask.taskDetail || editingTask.description || '');
    } else {
      setEditingId(null);
    }
  }, [editingTask]);

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  const handleAutomaticTime = (setter) => {
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    setter(timeString);
  };

  const saveTask = () => {
    if (!date || !startTime || !taskTitle.trim()) {
      alert('Please fill in required fields (Date, Start Time, and Task Title)');
      return;
    }

    const taskData = {
      date,
      startTime,
      stopTime,
      title: taskTitle,
      taskDetail,
    };

    if (editingId) {
      updateTask(editingId, taskData);
      showSuccessMessage('Task updated successfully!');
      setEditingId(null);
    } else {
      addTask(taskData);
      showSuccessMessage('Task added successfully!');
    }

    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setStartTime('');
    setStopTime('');
    setTaskTitle('');
    setTaskDetail('');
  };

  const deleteTask = (id) => {
    removeTask(id);
    showSuccessMessage('Task deleted successfully!');
  };

  const editTask = (task) => {
    openEditModal(task);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    resetForm();
  };

  // Filter and search tasks
  const filteredTasks = tasks.filter((task) => {
    const today = new Date().toISOString().split('T')[0];
    const matchesDate = !filterDate || task.date === filterDate;
    const matchesSearch =
      !searchTerm ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.taskDetail && task.taskDetail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Status filter logic
    let matchesStatus = true;
    if (filterStatus === 'today') {
      matchesStatus = task.date === today;
    } else if (filterStatus === 'upcoming') {
      matchesStatus = task.date > today;
    }
    
    return matchesDate && matchesSearch && matchesStatus;
  });

  // Sort tasks by date and time
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const timeA = a.startTime || a.time || '00:00';
    const timeB = b.startTime || b.time || '00:00';
    const dateA = new Date(`${a.date}T${timeA}`);
    const dateB = new Date(`${b.date}T${timeB}`);
    return dateB - dateA;
  });

  const todayTasks = sortedTasks.filter((task) => task.date === new Date().toISOString().split('T')[0]);

  // If AllTasksPage is shown, render it instead
  if (showAllTasksPage) {
    return <AllTasksPage onBack={() => closeAllTasksPage()} />;
  }

  return (
    <Container fluid className="task-manager-container py-4">
      {/* Header */}
      <Row className="mb-4 align-items-center g-3">
        <Col xs={12} md={8}>
          <div className="header-section">
            <h1 className="mb-2">Daily Task Manager</h1>
            <p className="text-muted mb-0">
              Welcome, <strong>{currentUser}</strong>! Manage your tasks efficiently.
            </p>
          </div>
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
            onClick={() => openAddModal()}
            className="w-100 btn-add-task"
          >
            Add New Task
          </Button>
        </Col>
        <Col xs={12} sm={6}>
          <Form.Control
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control-lg"
          />
        </Col>
      </Row>

      {/* Filter Section */}
      <Row className="mb-4 g-2">
        <Col xs={12}>
          <div className="filter-section">
              <h6 className="mb-3 fw-bold">Filter Tasks:</h6>
            <div className="filter-buttons mb-3">
              <Button
                variant={filterStatus === 'all' ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => openAllTasksPage()}
                className="me-2 mb-2"
              >
                All Tasks
              </Button>
              <Button
                variant={filterStatus === 'today' ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => setFilterStatus('today')}
                className="me-2 mb-2"
              >
                Today
              </Button>
              <Button
                variant={filterStatus === 'upcoming' ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => setFilterStatus('upcoming')}
                className="mb-2"
              >
                Upcoming
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Filter by Specific Date */}
      <Row className="mb-4">
        <Col xs={12}>
          <Form.Group>
            <Form.Label className="fw-bold">Filter by Specific Date:</Form.Label>
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
                Clear Date Filter
              </Button>
            )}
          </Form.Group>
        </Col>
      </Row>

      {/* Tasks List */}
      <Row>
        <Col xs={12}>
          <h3 className="mb-3">
            {filterStatus === 'all' && '📋 All Tasks'}
            {filterStatus === 'today' && '📅 Today\'s Tasks'}
            {filterStatus === 'upcoming' && '🚀 Upcoming Tasks'}
            {filterDate && ` - ${formatDate(filterDate)}`}
            <span className="text-muted ms-2 h6">({filteredTasks.length} tasks)</span>
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
                        {(task.taskDetail || task.description) && (
                          <p className="mb-3 text-muted task-description">
                            {task.taskDetail || task.description}
                          </p>
                        )}
                        <div className="task-meta">
                          <Badge bg="info" className="me-2">
                            📅 {formatDate(task.date)}
                          </Badge>
                          <Badge bg="warning" text="dark">
                            🕒 {task.startTime || task.time}
                            {task.stopTime && ` - ${task.stopTime}`}
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

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Task Detail</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter task detail (optional)"
                value={taskDetail}
                onChange={(e) => setTaskDetail(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveTask}>
            {editingId ? 'Update Task' : 'Add Task'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TaskManager;
