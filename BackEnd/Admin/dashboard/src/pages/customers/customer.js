import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Modal, Button } from "react-bootstrap";
import Header from "../header/header";

const API_URL = "http://localhost:7000/admin/customers";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(res.data);
    } catch (err) {
      console.error("Error fetching customers:", err.response?.data || err.message);
    }
  };

  const openDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  return (
    <div>
      <Header />
      <div className="container py-4">
        <h4 className="fw-bold mb-3">Customer Information</h4>

        <div className="table-responsive">
          <Table bordered hover className="align-middle shadow-sm">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                customers.map((customer, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <Button
                        variant="link"
                        className="p-0 text-decoration-none fw-semibold"
                        onClick={() => openDetails(customer)}
                      >
                        {customer.name}
                      </Button>
                    </td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.address}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-3">
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Customer Details Modal */}
        {selectedCustomer && (
          <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Customer Details — {selectedCustomer.name}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p><strong>Email:</strong> {selectedCustomer.email}</p>
              <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
              <p><strong>Address:</strong> {selectedCustomer.address}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Customers;
