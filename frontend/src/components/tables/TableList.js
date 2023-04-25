import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { Card, CardContent, Typography, Grid, Button } from "@material-ui/core";

const TableList = () => {
  const [tables, setTables] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);

  useEffect(() => {
    // Fetch initial page of tables
    fetchData('/api/tables/');
  }, []);

  const fetchData = (url) => {
    axios
      .get(url)
      .then(response => {
        setTables(response.data.results);
        setNextPageUrl(response.data.next);
        setPrevPageUrl(response.data.previous);
      })
      .catch(error => {
        console.error('Error fetching tables:', error);
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
      const response = await fetch(`/api/tables/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setTables(tables.filter((table) => table.id !== id));
      } else {
        throw new Error("Failed to delete table");
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Tables</Typography>
      </Grid>
      {tables.map((table) => (
        <Grid item xs={12} sm={6} md={4} key={table.id}>
          <Card>
            <CardContent>
              <Typography variant="h5">{table.name}</Typography>
              <Typography color="textSecondary">
                No. of People: {table.nopeople}
              </Typography>
              <Typography color="textSecondary">
                Status: {table.status}
              </Typography>
            </CardContent>
            <CardContent>
              <Button
                component={Link}
                to={`/tables/${table.id}`}
                variant="contained"
                color="primary"
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(table.id)}
                variant="contained"
                color="secondary"
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
      <Button onClick={handlePrevPage} disabled={!prevPageUrl}>Previous</Button>
      <Button onClick={handleNextPage} disabled={!nextPageUrl}>Next</Button>

    </Grid>
    
  );
};

export default TableList;