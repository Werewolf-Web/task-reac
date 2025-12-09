import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Badge,
  Alert,
} from 'react-bootstrap';
import '../styles/AllTasksPage.css';

const AllTasksPage = ({ onBack }) => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, title
  const [successMessage, setSuccessMessage] = useState('');

  // Load tasks from localStorage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem('dailyTasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem('dailyTasks', JSON.stringify(updatedTasks));
    showSuccessMessage('Task deleted successfully!');
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

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'date-asc':
        return new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`);
      case 'date-desc':
        return new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`);
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const getTaskStatus = (taskDate) => {
    const today = new Date().toISOString().split('T')[0];
    if (taskDate < today) return 'overdue';
    if (taskDate === today) return 'today';
    return 'upcoming';
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'overdue':
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
      case 'overdue':
        return '⚠️ Overdue';
      case 'today':
        return '📅 Today';
      case 'upcoming':
        return '🚀 Upcoming';
      default:
        return 'Unknown';
    }
  };

  return (
    <Container fluid className="all-tasks-container py-4">
      {/* Header with Back Button */}
      <Row className="mb-4 align-items-center g-3">
        <Col xs={12} md={8}>
          <div className="header-section">
            <div className="d-flex align-items-center gap-3">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={onBack}
                className="back-button"
              >
                ← Back to Dashboard
              </Button>
              <h1 className="mb-0">📋 All Tasks Overview</h1>
            </div>
            <p className="text-muted mt-2 mb-0">
              View and manage all your tasks in one place
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

      {/* Search and Filter Section */}
      <Row className="mb-4 g-2">
        <Col xs={12} lg={6}>
          <Form.Control
            type="text"
            placeholder="🔍 Search tasks by title or description..."
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
            <option value="date-desc">📅 Newest First</option>
            <option value="date-asc">📅 Oldest First</option>
            <option value="title">🔤 Sort by Title</option>
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
                  <Card key={task.id} className="task-card">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title mb-0">{task.title}</h5>
                        <Badge bg={statusColor}>{statusLabel}</Badge>
                      </div>

                      {task.description && (
                        <p className="card-text text-muted mb-3">{task.description}</p>
                      )}

                      <div className="task-meta mb-3">
                        <div className="meta-item">
                          <span className="meta-label">📅 Date:</span>
                          <span className="meta-value">
                            {new Date(task.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">🕒 Time:</span>
                          <span className="meta-value">{task.time}</span>
                        </div>
                      </div>

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                        className="w-100"
                      >
                        🗑️ Delete Task
                      </Button>
                    </Card.Body>
                  </Card>
                );
              })}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AllTasksPage;
