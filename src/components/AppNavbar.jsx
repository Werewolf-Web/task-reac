import React, { useContext } from 'react';
import { Navbar, Nav, Container, Form, Button, NavDropdown, InputGroup } from 'react-bootstrap';
import { TasksContext } from '../context/TasksContext';

const AppNavbar = ({ onLogout }) => {
  const {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    openAddModal,
    openAllTasksPage,
    closeAllTasksPage,
    showAllTasksPage,
  } = useContext(TasksContext);

  return (
    <Navbar bg="light" expand="md" className="mb-3 shadow-sm">
      <Container fluid>
        <Navbar.Brand href="#" onClick={() => closeAllTasksPage()}>
          TaskReact
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link href="#" onClick={() => closeAllTasksPage()} active={!showAllTasksPage}>
              Dashboard
            </Nav.Link>
            <Nav.Link href="#" onClick={() => openAllTasksPage()} active={showAllTasksPage}>
              All Tasks
            </Nav.Link>
          </Nav>

          <Form className="d-flex align-items-center me-2" onSubmit={(e) => e.preventDefault()}>
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search tasks"
              />
            </InputGroup>
          </Form>

          <Form.Select
            className="me-2"
            aria-label="Status filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="all">All</option>
            <option value="today">Today</option>
            <option value="upcoming">Upcoming</option>
          </Form.Select>

          <Button variant="success" className="me-2" onClick={() => openAddModal()}>
            Add Task
          </Button>

          <Nav>
            <NavDropdown title="Account" align="end">
              <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
