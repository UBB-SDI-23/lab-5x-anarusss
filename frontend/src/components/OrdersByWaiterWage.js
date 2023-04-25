import React, { useState, useEffect } from 'react';

const OrderListByWage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  const fetchOrders = async (url) => {
    try {
      setLoading(true);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data.results);
      setNextPage(data.next);
      setPrevPage(data.previous);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders('/api/orders/by-avg-price');
  }, []);

  const handleNextPage = () => {
    if (nextPage) {
      fetchOrders(nextPage);
    }
  };

  const handlePrevPage = () => {
    if (prevPage) {
      fetchOrders(prevPage);
    }
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Order List by Wage</h1>
      <ul>
        {orders.map(order => (
          <li key={order.id}>
            <strong>ID:</strong> {order.id}<br />
            <strong>Waiter:</strong> {order.waiter}<br />
            <strong>Table:</strong> {order.table}<br />
            <strong>Average Price:</strong> {order.average_price}
          </li>
        ))}
      </ul>
      <div>
        <button onClick={handlePrevPage} disabled={!prevPage}>Previous</button>
        <button onClick={handleNextPage} disabled={!nextPage}>Next</button>
      </div>
    </div>
  );
};

export default OrderListByWage;