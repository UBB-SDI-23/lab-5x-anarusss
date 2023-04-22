import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@material-ui/core';

function AddDrink() {
  const history = useHistory();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [price, setPrice] = useState('');
  const [calories, setCalories] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('/api/drinks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description, ingredients, price, calories }),
    });

    if (response.ok) {
      history.push('/');
    } else {
      console.error('Failed to add drink');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Add Drink
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Ingredients"
          value={ingredients}
          onChange={(event) => setIngredients(event.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          type="number"
          label="Price"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          type="number"
          label="Calories"
          value={calories}
          onChange={(event) => setCalories(event.target.value)}
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Add Drink
        </Button>
      </form>
      </Container>
  );
}

export default AddDrink;