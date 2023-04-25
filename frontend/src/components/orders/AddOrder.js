import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@material-ui/core';

function AddOrder() {
  const history = useHistory();
  const [waiter, setWaiterId] = useState('');
  const [table, setTableId] = useState('');
  const [drinks, setDrinkIds] = useState([]);

  const [errorMessageTable, setErrorMessageTable] = useState(''); 
  const [errorMessageWaiter, setErrorMessageWaiter] = useState(''); 
  const [errorMessage, setErrorMessage] = useState(''); 


  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessageTable('');
    setErrorMessageWaiter('');
    setErrorMessage('');

    //Check if waiter exists
    const waiterExists = await checkIfWaiterExist(waiter);
    if(!waiterExists) {
      setErrorMessageWaiter('Waiter does not exist'); 
      //return; 
    }
    

    // Check if table is occupied
    const isTableOccupied = await checkTableOccupancy(table); 
    if (isTableOccupied) {
      console.log("occupied")
      setErrorMessageTable('Table is occupied');
    }

    const drinkIdsArray = drinks.split(',').map(id => id.trim());

    // Check if all drinkIds exist
    const drinksExist = await checkIfDrinksExist(drinkIdsArray); 
    if (!drinksExist) {
      console.log("some drinks do not exist")
      setErrorMessage('Some drinks do not exist'); 
    }
    const response = await fetch('/api/orders/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ waiter, table, drinks: drinkIdsArray }),
    });

    if (response.ok) {
      history.push('/');
    } else {
      console.error('Failed to add order');
    }
  };

  const checkTableOccupancy = async (table) => {
    const response = await fetch(`/api/tables/${table}/`);
    const data = await response.json();
    if(data.status !== "available"){
      return true;
    }
    return false;
  };

  const checkIfDrinksExist = async (drinkIdsArray) => {
    for (const drinkId of drinkIdsArray) {
      const response = await fetch(`/api/drinks/${drinkId}`);
      const data = await response.json();
      if (response.ok) {
        return true;
      }
    }
    return false;
  };

  const checkIfWaiterExist = async (waiter) => {
    const response = await fetch(`/api/waiters/${waiter}`);
    if (response.ok) {
      return true;
    }
    return false;
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Add Order
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Waiter ID"
          value={waiter}
          onChange={(event) => setWaiterId(event.target.value)}
          margin="normal"
          required
        />
        {errorMessageWaiter && ( 
          <Typography variant="body2" color="error">
            {errorMessageWaiter}
          </Typography>
        )}
        <TextField
          fullWidth
          label="Table ID"
          value={table}
          onChange={(event) => setTableId(event.target.value)}
          margin="normal"
          required
        />
        {errorMessageTable && ( 
          <Typography variant="body2" color="error">
            {errorMessageTable}
          </Typography>
        )}
        <TextField
          fullWidth
          label="Drink IDs (comma-separated)"
          value={drinks}
          onChange={(event) => setDrinkIds(event.target.value)}
          margin="normal"
          required
        />
        {errorMessage && ( 
          <Typography variant="body2" color="error">
            {errorMessage}
          </Typography>
        )}
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Add Order
        </Button>
      </form>
    </Container>
  );
}

export default AddOrder;
