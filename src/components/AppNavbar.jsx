import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { TasksContext } from '../context/TasksContext';
import '../styles/AppNavbar.css';

const AppNavbar = ({ currentPage, onNavigate, onLogout }) => {
  return (
    <Navbar bg="light" expand="md" className="shadow-sm mobile-bottom-nav">
      <Container fluid>
        <Navbar.Brand href="#" onClick={() => onNavigate('manage')} className="d-md-block">
          TaskReact
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto d-flex flex-row flex-md-row align-items-center gap-2 justify-content-around justify-content-md-end w-100 w-md-auto">
            <Button 
              variant={currentPage === 'add' ? 'success' : 'outline-success'} 
              size="sm"
              onClick={() => onNavigate('add')}
              className="flex-grow-1 flex-md-grow-0"
            >
              <span>➕</span>
              <span>Add Task</span>
            </Button>

            <Button 
              variant={currentPage === 'all' ? 'primary' : 'outline-primary'} 
              size="sm"
              onClick={() => onNavigate('all')}
              className="flex-grow-1 flex-md-grow-0"
            >
              <span>📋</span>
              <span>All Tasks</span>
            </Button>

            <Button 
              variant={currentPage === 'manage' ? 'primary' : 'outline-primary'} 
              size="sm"
              onClick={() => onNavigate('manage')}
              className="flex-grow-1 flex-md-grow-0"
            >
              <span>⚙️</span>
              <span>Manage</span>
            </Button>

            <Button 
              variant="danger" 
              size="sm"
              onClick={onLogout}
              className="flex-grow-1 flex-md-grow-0"
            >
              <span>🚪</span>
              <span>Logout</span>
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
