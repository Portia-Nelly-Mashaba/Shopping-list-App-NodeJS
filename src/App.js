import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, ListGroup, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaShoppingCart, FaSearch } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import Google Font
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const API_URL = 'http://localhost:5000/shopping-list';

const App = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await axios.get(API_URL);
    setItems(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editItem) {
      await axios.put(`${API_URL}/${editItem.id}`, { name, quantity });
    } else {
      await axios.post(API_URL, { name, quantity });
    }
    setName('');
    setQuantity('');
    setEditItem(null);
    fetchItems();
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setName(item.name);
    setQuantity(item.quantity);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchItems();
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleSearch = () => {
    const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    setItems(filteredItems);
  };

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header Section */}
      <header className="py-4" style={{ backgroundColor: '#d4edda', borderBottom: '3px solid darkgreen' }}>
        <Container>
          <Row className="align-items-center">
            <Col>
              <h1 className="mb-0" style={{ fontWeight: '600', fontSize: '2rem' }}>
                 MyKeeper
              </h1>
            </Col>
          </Row>
          <h5 className="text-center text-muted mt-2">
          <FaShoppingCart className="me-2" />Smart Shopping List
          </h5>
        </Container>
        
      </header>

      {/* Search Section */}
      <Container className="mt-4" style={{  paddingBottom: '10px' }}>
        <Row className="justify-content-center">
          <Col md={6} className="d-flex align-items-center">
            <Form.Control
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="me-2"
            />
            <Button variant="outline-success" onClick={handleSearch}>
              <FaSearch />
            </Button>
          </Col>
        </Row>
      </Container>


      <Container className="mt-4">
        <Row className="justify-content-between">
          {/* Left Container: Add New Item */}
          <Col md={4} className="p-4 border rounded bg-light">
            <h4 className="mb-3">Add New Item</h4>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  className="mb-3"
                  placeholder="Enter item name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </Form.Group>
              <Button type="submit" variant="success" className="w-100 mt-3">
                {editItem ? 'Update' : 'Add'} Item
              </Button>
            </Form>
          </Col>

          {/* Right Container: My Shopping List */}
          <Col md={7} className="p-4 border rounded">
            <h4 className="mb-3">My Shopping List</h4>
            {items.length === 0 ? (
              <p className="text-muted text-center">No items yet. Start adding some!</p>
            ) : (
              <ListGroup>
                {items.map((item) => (
                  <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <Form.Check
                        type="checkbox"
                        className="me-3"
                        checked={item.checked}
                        onChange={async () => {
                          await axios.put(`${API_URL}/${item.id}`, { ...item, checked: !item.checked });
                          fetchItems();
                        }}
                      />
                      <span className="fw-bold me-2">Qty: {item.quantity}</span>
                      <span>{item.name}</span>
                    </div>
                    <div>
                      <Button variant="info" size="sm" className="me-2" onClick={() => handleView(item)}>
                        <FaEye />
                      </Button>
                      <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(item)}>
                        <FaEdit />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>
                        <FaTrash />
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Col>
        </Row>
      </Container>

      {/* View Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Item Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <>
              <p><strong>Name:</strong> {selectedItem.name}</p>
              <p><strong>Quantity:</strong> {selectedItem.quantity}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default App;