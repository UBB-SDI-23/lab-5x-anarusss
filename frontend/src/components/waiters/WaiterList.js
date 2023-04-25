import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
} from "@material-ui/core";

const WaiterList = () => {
  const [waiters, setWaiters] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);

  useEffect(() => {
    fetchData("/api/waiters/")
  }, []);

  const fetchData = (url) => {
    axios
      .get(url)
      .then(response => {
        setWaiters(response.data.results);
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
      const response = await fetch(`/api/waiters/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setWaiters(waiters.filter((waiter) => waiter.id !== id));
      } else {
        throw new Error("Failed to delete waiter");
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div>
      <Typography variant="h4">Waiters</Typography>
      <Grid container spacing={2}>
        {waiters.map((waiter) => (
          <Grid item xs={12} sm={6} md={4} key={waiter.id}>
            <Card>
              <CardContent>
                <Typography variant="h5">{waiter.name}</Typography>
                <Typography color="textSecondary">
                  {waiter.firstName}
                </Typography>
                <Typography color="textSecondary">
                  Name: {waiter.firstName}
                </Typography>
                <Typography color="textSecondary">
                  Email: {waiter.email}
                </Typography>
                <Typography color="textSecondary">
                  Phone: {waiter.phoneNumber}
                </Typography>
                <Typography color="textSecondary">
                  Wage: {waiter.wage}
                </Typography>
              </CardContent>
              <CardContent>
                <Button
                  component={Link}
                  to={`/waiters/${waiter.id}`}
                  variant="contained"
                  color="primary"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(waiter.id)}
                  variant="contained"
                  color="secondary"
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <button onClick={handlePrevPage} disabled={!prevPageUrl}>Previous</button>
      <button onClick={handleNextPage} disabled={!nextPageUrl}>Next</button>
    </div>
  );
};

export default WaiterList;