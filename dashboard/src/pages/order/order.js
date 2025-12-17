// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   Button,
//   Form,
//   Row,
//   Col,
//   Pagination,
//   Badge,
//   Spinner,
//   Modal,
// } from "react-bootstrap";
// import { FaEye, FaPrint } from "react-icons/fa";
// import jsPDF from "jspdf";
// import axios from "axios";
// import Header from "../header/header";

// const API_URL = "http://localhost:5000/api/admin/orders";

// const Order = () => {
//   const [orders, setOrders] = useState([]);
//   const [filters, setFilters] = useState({ status: "", limit: 10, page: 1 });
//   const [loading, setLoading] = useState(false);
//   const [show, setShow] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   const statusColors = {
//     Pending: "warning",
//     CHARGED: "success",
//     FAILED: "danger",
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [filters]);

//   // FETCH ORDERS
//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("adminToken");
//       if (!token) return setLoading(false);

//       const res = await axios.get(API_URL, {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { status: filters.status || undefined },
//       });

//       setOrders(res.data);
//     } catch (error) {
//       console.error("Failed to load orders", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // UPDATE ORDER STATUS
//   const handleStatusChange = async (orderId, newStatus) => {
//     try {
//       const token = localStorage.getItem("adminToken");
//       if (!token) return;

//       await axios.put(
//         `${API_URL}/${orderId}/status`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       fetchOrders();
//     } catch (error) {
//       console.error("Status update failed", error);
//     }
//   };

//   // GENERATE PDF INVOICE
//   const generateInvoice = (order) => {
//     const doc = new jsPDF();

//     doc.setFontSize(18);
//     doc.text("Sweet Indulgence - Invoice", 20, 20);

//     doc.setFontSize(12);
//     doc.text(`Order ID: ${order.customOrderId}`, 20, 40);
//     doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 20, 50);
//     doc.text(`Customer: ${order.address?.buildingName || "Guest"}`, 20, 60);
//     doc.text(
//       `Address: ${order.address?.houseNumber || ""}, ${order.address?.city || ""}, ${order.address?.pincode || ""}`,
//       20,
//       70
//     );

//     let y = 90;
//     doc.text("Items:", 20, y);
//     y += 10;

//     order.items.forEach((item, index) => {
//       const name = item.productId?.ProductName || item.name || "Chocolate";
//       doc.text(`${index + 1}. ${name} - Qty: ${item.quantity} - ₹${item.priceAtBuy}`, 20, y);
//       y += 10;
//     });

//     y += 10;
//     doc.text(`Subtotal: ₹${order.subtotal}`, 20, y);
//     doc.text(`CGST: ₹${order.cgst}`, 20, y + 10);
//     doc.text(`SGST: ₹${order.sgst}`, 20, y + 20);
//     doc.text(`TOTAL: ₹${order.totalAmount}`, 20, y + 30);
//     doc.text(`Status: ${order.status}`, 20, y + 40);

//     doc.save(`invoice_${order.customOrderId}.pdf`);
//   };

//   const handleShow = (order) => {
//     setSelectedOrder(order);
//     setShow(true);
//   };

//   const handleClose = () => {
//     setShow(false);
//     setSelectedOrder(null);
//   };

//   // PAGINATION
//   const startIndex = (filters.page - 1) * filters.limit;
//   const paginatedOrders = orders.slice(startIndex, startIndex + Number(filters.limit));
//   const totalPages = Math.ceil(orders.length / filters.limit);

//   return (
//     <div>
//       <Header />
//       <div className="container mt-4">
//         <h4>Orders (Live Backend)</h4>

//         {/* FILTERS */}
//         <Row className="mb-3">
//           <Col md={3}>
//             <Form.Select
//               value={filters.status}
//               onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
//             >
//               <option value="">All Status</option>
//               <option value="Pending">Pending</option>
//               <option value="CHARGED">Charged</option>
//               <option value="FAILED">Failed</option>
//             </Form.Select>
//           </Col>

//           <Col md={3}>
//             <Form.Select
//               value={filters.limit}
//               onChange={(e) => setFilters({ ...filters, limit: e.target.value, page: 1 })}
//             >
//               <option value="5">5</option>
//               <option value="10">10</option>
//               <option value="20">20</option>
//             </Form.Select>
//           </Col>
//         </Row>

//         <Table bordered hover responsive>
//           <thead>
//             <tr>
//               <th>Order ID</th>
//               <th>Time</th>
//               <th>Customer Name</th>
//               <th>City</th>
//               <th>Total</th>
//               <th>Status</th>
//               <th>Change</th>
//               <th>Invoice</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan="8" className="text-center">
//                   <Spinner animation="border" />
//                 </td>
//               </tr>
//             ) : paginatedOrders.length ? (
//               paginatedOrders.map((order) => (
//                 <tr key={order._id}>
//                   <td>{order.customOrderId}</td>
//                   <td>{new Date(order.createdAt).toLocaleString()}</td>
//                   <td>{order.address?.buildingName || "Guest"}</td>
//                   <td>{order.address?.city || "N/A"}</td>
//                   <td>₹{order.totalAmount}</td>
//                   <td>
//                     <Badge bg={statusColors[order.status] || "secondary"}>{order.status}</Badge>
//                   </td>
//                   <td>
//                     <Form.Select
//                       size="sm"
//                       value={order.status}
//                       onChange={(e) => handleStatusChange(order._id, e.target.value)}
//                     >
//                       <option value="Pending">Pending</option>
//                       <option value="CHARGED">Charged</option>
//                       <option value="FAILED">Failed</option>
//                     </Form.Select>
//                   </td>
//                   <td>
//                     <Button size="sm" variant="outline-primary" onClick={() => generateInvoice(order)}>
//                       <FaPrint />
//                     </Button>
//                     <Button size="sm" className="ms-2" variant="outline-secondary" onClick={() => handleShow(order)}>
//                       <FaEye />
//                     </Button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="8" className="text-center">
//                   No orders found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </Table>

//         <Pagination className="justify-content-end">
//           {[...Array(totalPages)].map((_, i) => (
//             <Pagination.Item
//               key={i + 1}
//               active={filters.page === i + 1}
//               onClick={() => setFilters({ ...filters, page: i + 1 })}
//             >
//               {i + 1}
//             </Pagination.Item>
//           ))}
//         </Pagination>
//       </div>

//       {/* VIEW ORDER MODAL */}
//       <Modal show={show} onHide={handleClose} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Order Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedOrder && (
//             <>
//               <p><b>Order ID:</b> {selectedOrder.customOrderId}</p>
//               <p><b>Customer:</b> {selectedOrder.address?.buildingName || "Guest"}</p>
//               <p>
//                 <b>Address:</b>{" "}
//                 {selectedOrder.address?.houseNumber || ""},{" "}
//                 {selectedOrder.address?.city || ""},{" "}
//                 {selectedOrder.address?.pincode || ""}
//               </p>
//               <p><b>Status:</b> {selectedOrder.status}</p>
//               <h5>Items</h5>
//               <ul>
//                 {selectedOrder.items.map((item, idx) => (
//                   <li key={idx}>
//                     {item.productId?.ProductName || item.name || "Chocolate"} - Qty {item.quantity} - ₹{item.priceAtBuy}
//                   </li>
//                 ))}
//               </ul>
//               <h4>Total: ₹{selectedOrder.totalAmount}</h4>
//             </>
//           )}
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default Order;



import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Form,
  Row,
  Col,
  Pagination,
  Badge,
  Spinner,
  Modal,
} from "react-bootstrap";
import { FaEye, FaPrint } from "react-icons/fa";
import axios from "axios";
import Header from "../header/header";

const API_URL = "http://localhost:5000/api/admin/orders";
const INVOICE_URL = "http://localhost:5000/invoice";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({ status: "", limit: 10, page: 1 });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statusColors = {
    Pending: "warning",
    CHARGED: "success",
    FAILED: "danger",
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  // =====================
  // FETCH ORDERS
  // =====================
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: { status: filters.status || undefined },
      });

      setOrders(res.data);
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // UPDATE STATUS
  // =====================
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      await axios.put(
        `${API_URL}/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchOrders();
    } catch (error) {
      console.error("Status update failed", error);
    }
  };

  // =====================
  // OPEN BACKEND INVOICE PDF
  // =====================
  const openInvoice = (customOrderId) => {
    window.open(`${INVOICE_URL}/${customOrderId}`, "_blank");
  };

  const handleShow = (order) => {
    setSelectedOrder(order);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedOrder(null);
  };

  // PAGINATION
  const startIndex = (filters.page - 1) * filters.limit;
  const paginatedOrders = orders.slice(
    startIndex,
    startIndex + Number(filters.limit)
  );
  const totalPages = Math.ceil(orders.length / filters.limit);

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <h4>Orders</h4>

        {/* FILTERS */}
        <Row className="mb-3">
          <Col md={3}>
            <Form.Select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value, page: 1 })
              }
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="CHARGED">Charged</option>
              <option value="FAILED">Failed</option>
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Select
              value={filters.limit}
              onChange={(e) =>
                setFilters({ ...filters, limit: e.target.value, page: 1 })
              }
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </Form.Select>
          </Col>
        </Row>

        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Time</th>
              <th>Customer</th>
              <th>City</th>
              <th>Total</th>
              <th>Status</th>
              <th>Change</th>
              <th>Invoice</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center">
                  <Spinner animation="border" />
                </td>
              </tr>
            ) : paginatedOrders.length ? (
              paginatedOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order.customOrderId}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>{order.address?.buildingName || "Guest"}</td>
                  <td>{order.address?.city || "N/A"}</td>
                  <td>₹{order.totalAmount}</td>

                  <td>
                    <Badge bg={statusColors[order.status] || "secondary"}>
                      {order.status}
                    </Badge>
                  </td>

                  <td>
                    <Form.Select
                      size="sm"
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="CHARGED">Charged</option>
                      <option value="FAILED">Failed</option>
                    </Form.Select>
                  </td>

                  <td>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => openInvoice(order.customOrderId)}
                    >
                      <FaPrint />
                    </Button>

                    <Button
                      size="sm"
                      className="ms-2"
                      variant="outline-secondary"
                      onClick={() => handleShow(order)}
                    >
                      <FaEye />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        <Pagination className="justify-content-end">
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item
              key={i + 1}
              active={filters.page === i + 1}
              onClick={() =>
                setFilters({ ...filters, page: i + 1 })
              }
            >
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>

      {/* VIEW ORDER MODAL */}
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <p><b>Order ID:</b> {selectedOrder.customOrderId}</p>
              <p><b>Customer:</b> {selectedOrder.address?.buildingName || "Guest"}</p>
              <p>
                <b>Address:</b>{" "}
                {selectedOrder.address?.houseNumber || ""},{" "}
                {selectedOrder.address?.city || ""},{" "}
                {selectedOrder.address?.pincode || ""}
              </p>

              <h5>Items</h5>
              <ul>
                {selectedOrder.items.map((item, idx) => (
                  <li key={idx}>
                    {item.productId?.ProductName} × {item.quantity} — ₹{item.priceAtBuy}
                  </li>
                ))}
              </ul>

              <h4>Total: ₹{selectedOrder.totalAmount}</h4>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Order;

