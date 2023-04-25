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

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);

  useEffect(() => {
    fetchData("/api/orders");
  }, []);

  const fetchData = (url) => {
    axios
      .get(url)
      .then(response => {
        setOrders(response.data.results);
        setNextPageUrl(response.data.next);
        setPrevPageUrl(response.data.previous);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setOrders(orders.filter((order) => order.id !== id));
      } else {
        throw new Error("Failed to delete order");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrevPage= () =>{
    if (prevPageUrl){
      fetchData(prevPageUrl);
    }
  };

  const handleNextPage = () => {
    if(nextPageUrl){
      fetchData(nextPageUrl);
    }
  };

  return (
    <div>
      <Typography variant="h4">Orders</Typography>
      <Grid container spacing={2}>
        {orders.map((order) => (
          <Grid item xs={12} sm={6} md={4} key={order.id}>
            <Card>
              <CardContent>
                <Typography variant="h5">{order.name}</Typography>
                <Typography color="textSecondary">
                  {order.orderNumber}
                </Typography>
                <Typography color="textSecondary">
                  Waiter: {order.waiter}
                </Typography>
                <Typography color="textSecondary">
                  Table: {order.table}
                </Typography>
                <Typography color="textSecondary">
                  Drinks: {order.drinks}
                </Typography>
              </CardContent>
              <CardContent>
                <Button
                  component={Link}
                  to={`/orders/${order.id}`}
                  variant="contained"
                  color="primary"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(order.id)}
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

export default OrderList;
