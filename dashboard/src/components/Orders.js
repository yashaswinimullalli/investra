import React, { useState, useEffect } from "react";
import axios from "axios";

const getToken = () => localStorage.getItem("token");

const Orders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    axios
      .get("http://localhost:3002/allOrders")
      .then((res) => {
        setAllOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    const token = getToken();
    if (!token) {
      alert("Please login to delete orders.");
      return;
    }
    try {
      await axios.delete(`http://localhost:3002/order/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete order.");
    }
  };

  if (loading) {
    return (
      <div className="orders">
        <div className="no-orders"><p>Loading orders...</p></div>
      </div>
    );
  }

  if (allOrders.length === 0) {
    return (
      <div className="orders">
        <div className="no-orders">
          <p>You haven't placed any orders today</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <h3 className="title">Orders ({allOrders.length})</h3>
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Type</th>
              <th>Qty.</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.map((order) => (
              <tr key={order._id}>
                <td>{order.name}</td>
                <td className={order.mode === "BUY" ? "profit" : "loss"}>
                  {order.mode}
                </td>
                <td>{order.qty}</td>
                <td>
                  {order.price > 0
                    ? `₹${Number(order.price).toFixed(2)}`
                    : "Market"}
                </td>
                <td className="profit">Executed</td>
                <td>
                  <button
                    onClick={() => handleDelete(order._id)}
                    style={{
                      background: "#ff5722",
                      color: "#fff",
                      border: "none",
                      borderRadius: "3px",
                      padding: "3px 8px",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                    }}
                  >
                    ✕ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Orders;
