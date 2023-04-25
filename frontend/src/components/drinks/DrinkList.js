import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { Card, CardContent, Typography, Grid, Button } from "@material-ui/core";

const DrinkList = () => {
  const [drinks, setDrinks] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);

  useEffect(() => {
    // Fetch initial page of drinks
    fetchData('/api/drinks/');
  }, []);

  const fetchData = (url) => {
    axios
      .get(url)
      .then(response => {
        setDrinks(response.data.results);
        setNextPageUrl(response.data.next);
        setPrevPageUrl(response.data.previous);
      })
      .catch(error => {
        console.error('Error fetching drinks:', error);
      });
  };

  const handleNextPage = () => {
    if (nextPageUrl) {
      fetchData(nextPageUrl);
    }
  };

  const handlePrevPage = () => {
    if (prevPageUrl) {
      fetchData(prevPageUrl);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/drinks/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setDrinks(drinks.filter((drink) => drink.id !== id));
      } else {
        throw new Error("Failed to delete drink");
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Drinks</Typography>
      </Grid>
      {drinks.map((drink) => (
        <Grid item xs={12} sm={6} md={4} key={drink.id}>
          <Card>
            <CardContent>
              <Typography variant="h5">{drink.name}</Typography>
              <Typography color="textSecondary">
                {drink.description}
              </Typography>
              <Typography color="textSecondary">
                Ingredients: {drink.ingredients}
              </Typography>
              <Typography color="textSecondary">
                Price: {drink.price}
              </Typography>
              <Typography color="textSecondary">
                Calories: {drink.calories}
              </Typography>
            </CardContent>
            <CardContent>
              <Button
                component={Link}
                to={`/drinks/${drink.id}`}
                variant="contained"
                color="primary"
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(drink.id)}
                variant="contained"
                color="secondary"
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
      <button onClick={handlePrevPage} disabled={!prevPageUrl}>Previous</button>
      <button onClick={handleNextPage} disabled={!nextPageUrl}>Next</button>

    </Grid>
    
  );


};

export default DrinkList;
