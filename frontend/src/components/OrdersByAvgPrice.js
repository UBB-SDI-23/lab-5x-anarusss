import React, { useState, useEffect } from "react";

function OrdersByAverageDrinkPrice() {
  const [orders, setOrders] = useState([]);
  const [waiterId, setWaiterId] = useState("");

  useEffect(() => {
    fetch(`/api/orders/by-avg-price?waiter_id=${waiterId}`)
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error(error));
  }, [waiterId]);

  return (
    <div>
      <h1>Orders By Average Drink Price</h1>
      <label htmlFor="waiterId">Filter by Waiter:</label>
      <input
        type="text"
        id="waiterId"
        name="waiterId"
        value={waiterId}
        onChange={(e) => setWaiterId(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Waiter</th>
            <th>Table</th>
            <th>Average Price</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.waiter}</td>
              <td>{order.table}</td>
              <td>{order.average_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrdersByAverageDrinkPrice;