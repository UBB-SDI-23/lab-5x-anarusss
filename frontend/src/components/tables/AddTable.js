import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@material-ui/core';

function AddTable() {
  const history = useHistory();
  const [name, setName] = useState('');
  const [noPeople, setNoPeople] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    // Validate input
    if (!name || !noPeople) {
      setErrorMessage('Please enter all required fields');
      return;
    }

    // Convert noPeople to integer
    const noPeopleInt = parseInt(noPeople);

    // Create table
    const response = await fetch('/api/tables/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, nopeople: noPeopleInt, status: 'available' }),
    });

    if (response.ok) {
      history.push('/');
    } else {
      console.error('Failed to add table');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Add Table
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Table Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Number of People"
          type="number"
          value={noPeople}
          onChange={(event) => setNoPeople(event.target.value)}
          margin="normal"
          required
        />
        {errorMessage && (
          <Typography variant="body2" color="error">
            {errorMessage}
          </Typography>
        )}
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Add Table
        </Button>
      </form>
    </Container>
  );
}

export default AddTable;