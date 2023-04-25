import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Container, Typography, TextField, Button } from '@material-ui/core';

const OrderDetail = () => {
  const history = useHistory();
  const { id } = useParams();
  const [order, setOrder] = useState({});
  const [waiter, setWaiter] = useState('');
  const [table, setTable] = useState('');
  const [drinks, setDrinks] = useState([]);

  useEffect(() => {
    // Fetch order details from Django API on component mount
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`);
        const data = await response.json();
        setOrder(data);
        setWaiter(data.waiter);
        setTable(data.table);
        setDrinks(data.drinks);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };
    fetchOrder();
  }, [id]);

  const handleUpdateOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          waiter,
          table,
          drinks,
        }),
      });
      if (response.ok) {
        console.log('Order updated successfully');
        history.push('/');
      } else {
        console.error('Failed to update order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
    onClose();
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Order Detail
      </Typography>
      <TextField
        label="Waiter"
        value={waiter}
        onChange={(e) => setWaiter(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Table"
        value={table}
        onChange={(e) => setTable(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Drinks"
        value={drinks}
        onChange={(e) => setDrinks(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleUpdateOrder}>
        Update
      </Button>
    </Container>
  );
};

export default OrderDetail;
