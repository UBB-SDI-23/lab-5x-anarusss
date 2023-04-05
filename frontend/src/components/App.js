// import React, { Component } from "react";
// import { render } from "react-dom";
// import DrinkList from "./DrinkList";
// import HomePage from "./HomePage";

// export default class App extends Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     return (
//       <div>
//         <DrinkList />
//       </div>
//     );
//   }
// }

// const appDiv = document.getElementById("app");
// render(<App />, appDiv);


import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { pink } from '@mui/material/colors';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';


import OrdersByAverageDrinkPrice from './OrdersByAvgPrice';
import OrderListByWage from './OrdersByWaiterWage';
import DrinkList from './DrinkList';
import AddDrink from './AddDrink';
import EditDrink from './EditDrink';
import { colors } from '@material-ui/core';
import { GraphicEqSharp } from '@material-ui/icons';

const App = () => {
  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh' }}>
        <div
          style={{
            width: '200px',
            backgroundColor: 'pink',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: '16px',
          }}
        >
          <img src="../../static/logo2.png" alt="glass logo" width="100" height="150"/>
          <h1 style={{color: 'f50057'}}>Management</h1>
          <Link to="/" style={{ margin: '8px 0', textDecoration: 'none', color: 'black' }}>
              <Button fullWidth>Home</Button>
            </Link>
            <Link to="/add" style={{ margin: '8px 0', textDecoration: 'none', color: 'black' }}>
              <Button fullWidth>Add New Drink</Button>
            </Link>
            <Link to="/raport" style={{ margin: '8px 0', textDecoration: 'none', color: 'black' }}>
              <Button fullWidth>Raport</Button>
            </Link>
        </div>
        <div style={{ flex: 1, padding: '16px' }}>
          <Switch>
            <Route exact path="/" component={DrinkList} />
            <Route path="/add" component={AddDrink} />
            <Route path="/drinks/:id" component={EditDrink} />
            <Route path="/raport" component={OrdersByAverageDrinkPrice} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;