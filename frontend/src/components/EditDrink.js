import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, TextField, Button } from '@material-ui/core';

const EditDrink = () => {
  const { id } = useParams();
  const [drink, setDrink] = useState({});
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [price, setPrice] = useState('');
  const [calories, setCalories] = useState('');

  useEffect(() => {
    // Fetch drink details from Django API on component mount
    const fetchDrink = async () => {
      try {
        const response = await fetch(`/api/drinks/${id}`);
        const data = await response.json();
        setDrink(data);
        setName(data.name);
        setDescription(data.description);
        setIngredients(data.ingredients);
        setPrice(data.price);
        setCalories(data.calories);
      } catch (error) {
        console.error('Error fetching drink details:', error);
      }
    };
    fetchDrink();
  }, [id]);

  const handleUpdateDrink = async () => {
    try {
      const response = await fetch(`/api/drinks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          ingredients,
          price,
          calories,
        }),
      });
      if (response.ok) {
        console.log('Drink updated successfully');
        // Optionally, you can redirect or show a success message here
      } else {
        console.error('Failed to update drink');
      }
    } catch (error) {
      console.error('Error updating drink:', error);
    }
    onClose();
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Edit Drink
      </Typography>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Ingredients"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Calories"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleUpdateDrink}>
        Update
      </Button>
    </Container>
  );
};

export default EditDrink;