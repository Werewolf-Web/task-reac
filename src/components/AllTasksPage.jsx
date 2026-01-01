import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Badge,
  Alert,
  Modal,
} from 'react-bootstrap';
import '../styles/AllTasksPage.css';
import { TasksContext } from '../context/TasksContext';
import { formatDate } from '../utils/exportUtils';

const AllTasksPage = () => {
  const { tasks } = useContext(TasksContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, today, upcoming
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, title
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

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

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const timeA = a.startTime || a.time || '00:00';
    const timeB = b.startTime || b.time || '00:00';
    switch (sortBy) {
      case 'date-asc':
        return new Date(`${a.date}T${timeA}`) - new Date(`${b.date}T${timeB}`);
      case 'date-desc':
        return new Date(`${b.date}T${timeB}`) - new Date(`${a.date}T${timeA}`);
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const getTaskStatus = (taskDate) => {
    const today = new Date().toISOString().split('T')[0];
    if (taskDate < today) return 'over';
    if (taskDate === today) return 'today';
    return 'upcoming';
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'over':
        return 'danger';
      case 'today':
        return 'warning';
      case 'upcoming':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'over':
        return 'Over';
      case 'today':
        return 'Today';
      case 'upcoming':
        return 'Upcoming';
      default:
        return 'over';
    }
  };

  return (
    <Container fluid className="all-tasks-container py-4">
      {/* Header */}
      <Row className="mb-4 align-items-center g-3">
        <Col xs={12}>
          <div className="header-section">
            <h1 className="mb-0">All Tasks</h1>
            <p className="text-muted mt-2 mb-0">
              View and manage all your tasks in one place
            </p>
          </div>
        </Col>
      </Row>

      {/* Statistics */}
      <Row className="mb-4 g-2">
        <Col xs={12} sm={6} md={6}>
          <Card className="stat-card stat-total">
            <Card.Body>
              <h6 className="mb-2">Total Tasks</h6>
              <h3 className="mb-0">{tasks.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={6}>
          <Card className="stat-card stat-upcoming">
            <Card.Body>
              <h6 className="mb-2">Upcoming</h6>
              <h3 className="mb-0">
                {tasks.filter((t) => getTaskStatus(t.date) === 'upcoming').length}
              </h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Status Filter Buttons */}
      <Row className="mb-4 g-2">
        <Col xs={12}>
          <div className="filter-buttons mb-3">
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
      </Row>

      {/* Search and Filter Section */}
      <Row className="mb-4 g-2">
        <Col xs={12} lg={6}>
          <Form.Control
            type="text"
            placeholder="Search tasks by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control-lg"
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Form.Control
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="form-control-lg"
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Form.Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-control-lg"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="title">Sort by Title</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Clear Filters Button */}
      {(searchTerm || filterDate) && (
        <Row className="mb-3">
          <Col xs={12}>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setFilterDate('');
              }}
            >
              Clear All Filters
            </Button>
          </Col>
        </Row>
      )}

      {/* Tasks Grid */}
      <Row>
        <Col xs={12}>
          <h4 className="mb-3">
            Tasks Found: <span className="badge bg-primary">{sortedTasks.length}</span>
          </h4>
          {sortedTasks.length === 0 ? (
            <Alert variant="info" className="text-center">
              <h5>No tasks found!</h5>
              <p>
                {searchTerm || filterDate
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Create your first task from the dashboard.'}
              </p>
            </Alert>
          ) : (
            <div className="tasks-grid">
              {sortedTasks.map((task) => {
                const status = getTaskStatus(task.date);
                const statusColor = getStatusBadgeColor(status);
                const statusLabel = getStatusLabel(status);

                return (
                  <Card
                    key={task.id}
                    className="task-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedTask(task);
                      setShowDetailModal(true);
                    }}
                  >
                    <Card.Body>
                      <div className="task-meta mb-2">
                        <div className="meta-item">
                          <span className="meta-label">Date:</span>
                          <span className="meta-value">
                            {formatDate(task.date)}
                          </span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">Time:</span>
                          <span className="meta-value">
                            {task.startTime || task.time}
                            {task.stopTime && ` - ${task.stopTime}`}
                          </span>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title mb-0">{task.title}</h5>
                        <Badge bg={statusColor}>{statusLabel}</Badge>
                      </div>

                      {(task.taskDetail || task.description) && (
                        <p className="card-text text-muted mb-0">
                          {task.taskDetail || task.description}
                        </p>
                      )}
                    </Card.Body>
                  </Card>
                );
              })}
            </div>
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

              <div className="detail-row mb-3">
                <strong>Status:</strong>
                <Badge bg={getStatusBadgeColor(getTaskStatus(selectedTask.date))}>
                  {getStatusLabel(getTaskStatus(selectedTask.date))}
                </Badge>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="modal-footer-responsive">
          <Button variant="secondary" onClick={() => setShowDetailModal(false)} className="w-100">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AllTasksPage;
