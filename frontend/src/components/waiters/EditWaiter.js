import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Container, Typography, TextField, Button } from '@material-ui/core';

const EditWaiter = () => {
  const history = useHistory();
  const { id } = useParams();
  const [waiter, setWaiter] = useState({});
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [wage, setWage] = useState('');

  useEffect(() => {
    console.log('drinkId prop:', id);
    // Fetch waiter details from Django API on component mount
    const fetchWaiter = async () => {
      try {
        const response = await fetch(`/api/waiters/${id}`);
        const data = await response.json();
        setWaiter(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setPhoneNumber(data.phoneNumber);
        setEmail(data.email);
        setWage(data.wage);
      } catch (error) {
        console.error('Error fetching waiter details:', error);
      }
    };
    fetchWaiter();
  }, [id]);

  const handleUpdateWaiter = async () => {
    try {
      const response = await fetch(`/api/waiters/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          phoneNumber,
          email,
          wage,
        }),
      });
      if (response.ok) {
        console.log('Waiter updated successfully');
        history.push('/');
      } else {
        console.error('Failed to update waiter');
      }
    } catch (error) {
      console.error('Error updating waiter:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Edit Waiter
      </Typography>
      <TextField
        label="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Wage"
        value={wage}
        onChange={(e) => setWage(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleUpdateWaiter}>
        Update
      </Button>
    </Container>
  );
};

export default EditWaiter;
