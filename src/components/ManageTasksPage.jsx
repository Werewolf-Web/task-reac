import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Card, ListGroup, Badge, Alert, Modal, ButtonGroup } from 'react-bootstrap';
import { TasksContext } from '../context/TasksContext';
import { exportTasksToExcel, exportTasksToPDF, formatDate } from '../utils/exportUtils';
import '../styles/ManageTasksPage.css';

const ManageTasksPage = ({ currentUser, onNavigate }) => {
  const { tasks, removeTask, openEditModal } = useContext(TasksContext);
  const [filterStatus, setFilterStatus] = useState('all'); // all, today, upcoming
  const [filterDate, setFilterDate] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  const deleteTask = (id) => {
    removeTask(id);
    showSuccessMessage('Task deleted successfully!');
  };

  // Filter tasks based on status and date
  const filteredTasks = tasks.filter((task) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Date filter
    if (filterDate && task.date !== filterDate) {
      return false;
    }
    
    // Status filter
    if (filterStatus === 'today') {
      return task.date === today;
    } else if (filterStatus === 'upcoming') {
      return task.date > today;
    }
    return true; // all
  });

  // Sort tasks by date and time
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const timeA = a.startTime || a.time || '00:00';
    const timeB = b.startTime || b.time || '00:00';
    const dateA = new Date(`${a.date}T${timeA}`);
    const dateB = new Date(`${b.date}T${timeB}`);
    return dateB - dateA;
  });

  const todayTasks = tasks.filter((task) => task.date === new Date().toISOString().split('T')[0]);

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4 align-items-center">
        <Col xs={12} md={8}>
          <div className="header-section">
            <h1 className="mb-2">Manage Tasks</h1>
            <p className="text-muted mb-0">
              Welcome, <strong>{currentUser}</strong>!
            </p>
          </div>
        </Col>
        <Col xs={12} md={4} className="text-md-end">
          <ButtonGroup className="w-100 w-md-auto gap-2" vertical={true} style={{ gap: '0.5rem !important' }}>
            <Button
              variant="success"
              size="sm"
              onClick={() => exportTasksToExcel(tasks)}
              disabled={tasks.length === 0}
              className="d-flex align-items-center justify-content-center gap-2"
            >
              📊 Export Excel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => exportTasksToPDF(tasks)}
              disabled={tasks.length === 0}
              className="d-flex align-items-center justify-content-center gap-2"
            >
              📄 Export PDF
            </Button>
          </ButtonGroup>
        </Col>
      </Row>

      {/* Success Message */}
      {successMessage && (
        <Alert variant="success" className="alert-dismissible fade show mb-4">
          {successMessage}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Row className="mb-4 g-2">
        <Col xs={12} md={6}>
          <Card className="stat-card">
            <Card.Body>
              <h5 className="mb-0">Total Tasks</h5>
              <h2 className="mb-0">{tasks.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="stat-card">
            <Card.Body>
              <h5 className="mb-0">Today's Tasks</h5>
              <h2 className="mb-0">{todayTasks.length}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filter Section */}
      <Row className="mb-4 g-2">
        <Col xs={12} md={8}>
          <div className="filter-buttons">
            <Button
              variant={filterStatus === 'all' ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => setFilterStatus('all')}
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
        </Col>
        <Col xs={12} md={4}>
          <Form.Control
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            placeholder="Filter by date"
            className="form-control-sm"
          />
        </Col>
      </Row>
      
      {filterDate && (
        <Row className="mb-3">
          <Col xs={12}>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setFilterDate('')}
            >
              Clear Date Filter
            </Button>
          </Col>
        </Row>
      )}

      {/* Tasks List */}
      <Row>
        <Col xs={12}>
          <h3 className="mb-3">
            {filterStatus === 'all' && 'All Tasks'}
            {filterStatus === 'today' && 'Today\'s Tasks'}
            {filterStatus === 'upcoming' && 'Upcoming Tasks'}
            {filterDate && ` - ${formatDate(filterDate)}`}
            <span className="text-muted ms-2 h6">({sortedTasks.length})</span>
          </h3>
          {sortedTasks.length === 0 ? (
            <Alert variant="info" className="text-center">
              <h5>No tasks found!</h5>
              <p>Create a new task from the "Add Task" page.</p>
            </Alert>
          ) : (
            <ListGroup className="tasks-list">
              {sortedTasks.map((task) => (
                <ListGroup.Item
                  key={task.id}
                  className="task-item mb-3"
                  style={{ cursor: 'pointer', overflow: 'hidden' }}
                  onClick={() => {
                    setSelectedTask(task);
                    setShowDetailModal(true);
                  }}
                >
                  <Row className="align-items-start g-2 w-100">
                    <Col xs={12} lg={8} className="task-content">
                      <div className="task-info">
                        <h5 className="task-title mb-2">{task.title}</h5>
                        {(task.taskDetail || task.description) && (
                          <p className="task-description mb-2 text-muted">
                            {task.taskDetail || task.description}
                          </p>
                        )}
                        <div className="task-meta">
                          <Badge bg="info" className="me-2">
                            {formatDate(task.date)}
                          </Badge>
                          <Badge bg="warning" text="dark">
                            {task.startTime || task.time}
                            {task.stopTime && ` - ${task.stopTime}`}
                          </Badge>
                        </div>
                      </div>
                    </Col>
                    <Col xs={12} lg={4} className="task-actions mt-3 mt-lg-0">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(task);
                          onNavigate('add');
                        }}
                        className="w-100 mb-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTask(task.id);
                        }}
                        className="w-100"
                      >
                        Delete
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>

      {/* Task Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title-responsive">Task Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTask && (
            <div>
              <div className="mb-4">
                <h4 className="task-modal-title">{selectedTask.title}</h4>
                {(selectedTask.taskDetail || selectedTask.description) && (
                  <p className="text-muted task-modal-description">
                    {selectedTask.taskDetail || selectedTask.description}
                  </p>
                )}
              </div>

              <div className="detail-row mb-3">
                <strong>Date:</strong>
                <span>{formatDate(selectedTask.date)}</span>
              </div>

              <div className="detail-row mb-3">
                <strong>Start Time:</strong>
                <span>{selectedTask.startTime || selectedTask.time}</span>
              </div>

              {selectedTask.stopTime && (
                <div className="detail-row mb-3">
                  <strong>Stop Time:</strong>
                  <span>{selectedTask.stopTime}</span>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="modal-footer-responsive">
          <Button
            variant="primary"
            onClick={() => {
              if (selectedTask) {
                openEditModal(selectedTask);
                setShowDetailModal(false);
                onNavigate('add');
              }
            }}
            className="w-100 w-lg-auto"
          >
            Edit Task
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (selectedTask) {
                deleteTask(selectedTask.id);
                setShowDetailModal(false);
              }
            }}
            className="w-100 w-lg-auto"
          >
            Delete Task
          </Button>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)} className="w-100 w-lg-auto">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageTasksPage;
