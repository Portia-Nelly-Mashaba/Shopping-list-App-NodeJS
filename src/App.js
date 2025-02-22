import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, ListGroup, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaShoppingCart, FaSearch } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

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
    try {
      const response = await axios.get(API_URL);
      setItems(response.data);
    } catch (error) {
      toast.error('Failed to fetch items. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await axios.put(`${API_URL}/${editItem.id}`, { name, quantity });
        toast.success('Item updated successfully!');
      } else {
        await axios.post(API_URL, { name, quantity });
        toast.success('Item added successfully!');
      }
      setName('');
      setQuantity('');
      setEditItem(null);
      fetchItems();
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setName(item.name);
    setQuantity(item.quantity);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success('Item deleted successfully!');
      fetchItems();
    } catch (error) {
      toast.error('Failed to delete item. Please try again.');
    }
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleSearch = () => {
    const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    setItems(filteredItems);
    if (filteredItems.length === 0) {
      toast.info('No items found matching your search.');
    }
  };

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

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
      <Container className="mt-4" style={{ paddingBottom: '10px' }}>
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
                          try {
                            await axios.put(`${API_URL}/${item.id}`, { ...item, checked: !item.checked });
                            fetchItems();
                          } catch (error) {
                            toast.error('Failed to update item. Please try again.');
                          }
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