import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { TasksContext } from '../context/TasksContext';

const AppNavbar = ({ currentPage, onNavigate, onLogout }) => {
  return (
    <Navbar bg="light" expand="md" className="mb-3 shadow-sm">
      <Container fluid>
        <Navbar.Brand href="#" onClick={() => onNavigate('manage')}>
          TaskReact
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto d-flex align-items-center gap-2">
            <Button 
              variant={currentPage === 'add' ? 'success' : 'outline-success'} 
              size="sm"
              onClick={() => onNavigate('add')}
            >
              Add Task
            </Button>

            <Button 
              variant={currentPage === 'all' ? 'primary' : 'outline-primary'} 
              size="sm"
              onClick={() => onNavigate('all')}
            >
              All Tasks
            </Button>

            <Button 
              variant={currentPage === 'manage' ? 'primary' : 'outline-primary'} 
              size="sm"
              onClick={() => onNavigate('manage')}
            >
              Manage Tasks
            </Button>

            <Button 
              variant="danger" 
              size="sm"
              onClick={onLogout}
            >
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
