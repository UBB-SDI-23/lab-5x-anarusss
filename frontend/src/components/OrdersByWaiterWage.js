import React, { useState, useEffect } from 'react';

function OrderListByWage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('/api/order-list-by-wage/')
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h2>Order List by Waiter Wage</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <p>Waiter: {order.waiter.firstName} {order.waiter.lastName}</p>
            <p>Table: {order.table.name}</p>
            <p>Drinks:</p>
            <ul>
              {order.drinks.map((drink) => (
                <li key={drink.id}>{drink.name}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrderListByWage;