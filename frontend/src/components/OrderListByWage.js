import React, { useState, useEffect } from 'react';
import { Typography, List, ListItem, ListItemText, Button, CircularProgress } from '@material-ui/core';

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
    fetchOrders('/api/orders/by-waiter-wage/');
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
    return <CircularProgress />;
  }

  if (error) {
    return <Typography variant="h6">Error: {error}</Typography>;
  }

  return (
    <div>
      <Typography variant="h4">Order List by Wage</Typography>
      <List>
        {orders.map(order => (
          <ListItem key={order.id}>
            <ListItemText
              primary={`ID: ${order.id}`}
              secondary={
                <React.Fragment>
                  <Typography component="span" variant="body1" color="textPrimary">
                    Waiter: {order.waiter}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body1" color="textPrimary">
                    Table: {order.table}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body1" color="textPrimary">
                    Waiter wage: {order.waiter_wage}
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
        ))}
      </List>
      <div>
        <Button variant="contained" color="primary" onClick={handlePrevPage} disabled={!prevPage}>
          Previous
        </Button>
        <Button variant="contained" color="primary" onClick={handleNextPage} disabled={!nextPage}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default OrderListByWage;
