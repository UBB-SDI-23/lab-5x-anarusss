
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

import OrdersByAverageDrinkPrice from './OrdersByAvgPrice';
import OrderListByWage from './OrderListByWage';
import TableNoOfPeople from './TablePeople'
import DrinkList from './drinks/DrinkList';
import WaiterList from './waiters/WaiterList';
import OrderList from './orders/OrderList'
import TableList from './tables/TableList'

import AddDrink from './drinks/AddDrink';
import AddWaiter from './waiters/AddWaiter';
import AddOrder from './orders/AddOrder';
import AddTable from './tables/AddTable';

import EditDrink from './drinks/EditDrink';
import EditWaiter from './waiters/EditWaiter';
import OrderDetail from './orders/OrderDetail'
import EditTable from './tables/EditTable'

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
            <Link to="/addDrink" style={{ margin: '8px 0', textDecoration: 'none', color: 'black' }}>
              <Button fullWidth>Add New Drink</Button>
            </Link>
            <Link to="/addWaiter" style={{ margin: '8px 0', textDecoration: 'none', color: 'black' }}>
              <Button fullWidth>Add New Waiter</Button>
            </Link>
            <Link to="/addOrder" style={{ margin: '8px 0', textDecoration: 'none', color: 'black' }}>
              <Button fullWidth>Add New Order</Button>
            </Link>
            <Link to="/addTable" style={{ margin: '8px 0', textDecoration: 'none', color: 'black' }}>
              <Button fullWidth>Add New Table</Button>
            </Link>

            <Link to="/waiters" style={{ margin: '8px 0', textDecoration: 'none', color: 'black' }}>
              <Button fullWidth>Waiters</Button>
            </Link>
            <Link to="/orders" style={{ margin: '8px 0', textDecoration: 'none', color: 'black' }}>
              <Button fullWidth>Orders</Button>
            </Link>
            <Link to="/tables" style={{ margin: '8px 0', textDecoration: 'none', color: 'black' }}>
              <Button fullWidth>Tables</Button>
            </Link>
            <h2 style={{color: 'blue'}}>Statistics:</h2>
            <Link to="/raport" style={{ margin: '8px 0', textDecoration: 'none', color: 'black' }}>
              <Button fullWidth>Orders By Average Drink Price</Button>
            </Link>
            <Link to="/ordersByWage" style={{ margin: '8px 0', textDecoration: 'none', color: 'black' }}>
              <Button fullWidth>Orders By Waiter wage</Button>
            </Link>
            <Link to="/tablepeople" style={{ margin: '8px 0', textDecoration: 'none', color: 'black' }}>
              <Button fullWidth>Filter tables by people capacity</Button>
            </Link>
        </div>

        <div style={{ flex: 1, padding: '16px' }}>
          <Switch>
            <Route exact path="/" component={DrinkList} />
            <Route path="/raport" component={OrdersByAverageDrinkPrice} />
            <Route path="/ordersByWage" component={OrderListByWage} />
            <Route path="/tablepeople" component={TableNoOfPeople} />

            <Route path="/addDrink" component={AddDrink} />
            <Route path="/addWaiter" component={AddWaiter} />
            <Route path="/addOrder" component={AddOrder} />
            <Route path="/addTable" component={AddTable} />

            <Route path="/drinks/:id" component={EditDrink} />
            <Route path="/waiters/:id" component={EditWaiter} />
            <Route path="/orders/:id" component={OrderDetail} />
            <Route path="/tables/:id" component={EditTable} />


            <Route path="/waiters" component={WaiterList} />
            <Route path="/orders" component={OrderList} />
            <Route path="/tables" component={TableList} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;