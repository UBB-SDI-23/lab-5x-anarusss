import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Container, Typography, TextField, Button } from '@material-ui/core';

const EditTable = () => {
  const history = useHistory();
  const { id } = useParams();
  const [table, setTable] = useState({});
  const [name, setName] = useState('');
  const [nopeople, SetNoPeople] = useState('');
  const [status, SetStatus] = useState('');

  useEffect(() => {
    // Fetch table details from Django API on component mount
    const fetchTable = async () => {
      try {
        const response = await fetch(`/api/tables/${id}/`);
        const data = await response.json();
        setTable(data);
        setName(data.name);
        SetNoPeople(data.nopeople);
        SetStatus(data.status);
      } catch (error) {
        console.error('Error fetching table details:', error);
      }
    };
    fetchTable();
  }, [id]);

  const handleUpdateTable = async () => {
    try {
      const response = await fetch(`/api/tables/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          nopeople,
          status,
        }),
      });
      if (response.ok) {
        console.log('Table updated successfully');
        history.push('/');
      } else {
        console.error('Failed to update table');
      }
    } catch (error) {
      console.error('Error updating table:', error);
    }
    //onClose();
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Edit Table
      </Typography>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Capacity"
        value={nopeople}
        onChange={(e) => SetNoPeople(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Status"
        value={status}
        onChange={(e) => SetStatus(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleUpdateTable}>
        Update
      </Button>
    </Container>
  );
};

export default EditTable;
