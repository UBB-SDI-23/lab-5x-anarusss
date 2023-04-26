import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@material-ui/core';

function AddWaiter() {
  const history = useHistory();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [wage, setWage] = useState('');

  const [wageError, setWagerror] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Perform validation
    if (!wage || isNaN(wage) || wage < 0) {
      setWagerror('Wage must be a positive number');
      return;
    } else {
      setWagerror('');
    }

    const response = await fetch('/api/waiters/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName, phoneNumber, email, wage }),
    });

    if (response.ok) {
      history.push('/');
    } else {
      console.error('Failed to add waiter');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Add Waiter
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="First Name"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Last Name"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Phone Number"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          type="number"
          label="Wage"
          value={wage}
          onChange={(event) => setWage(event.target.value)}
          margin="normal"
          required
          error={!!wageError}
          helperText={wageError}
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Add Waiter
        </Button>
      </form>
    </Container>
  );
}

export default AddWaiter;
