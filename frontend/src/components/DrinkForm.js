import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const DrinkForm = ({ onAdd }) => {
  const history = useHistory();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();

    if (!name) {
      alert('Please enter a name for the drink');
      return;
    }

    if (!price) {
      alert('Please enter a price for the drink');
      return;
    }

    const newDrink = { name, price, description };
    onAdd(newDrink);
    setName('');
    setPrice('');
    setDescription('');
    history.push('/drinks');
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className='form-control'>
          <label htmlFor='name'>Name</label>
          <input
            type='text'
            id='name'
            placeholder='Enter drink name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className='form-control'>
          <label htmlFor='price'>Price</label>
          <input
            type='number'
            id='price'
            placeholder='Enter drink price'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className='form-control'>
          <label htmlFor='description'>Description</label>
          <textarea
            id='description'
            placeholder='Enter drink description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type='submit'>Save</button>
      </form>
    </div>
  );
};

export default DrinkForm;