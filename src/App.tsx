import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Test  from './components/test2'

import RecordSet from './pages/RecordSet';
import EditableDataGrid from './components/test';
import { Login } from './pages/Login';

function App() {
  return (
    
    <Router>
  <Routes>
        <Route path="/login"  element={<Login/>} />
       <Route path="/recordset"  element={<RecordSet/>} />
       <Route path='/dashboard' element={<Test/>}/>
       <Route path='/test' element={<EditableDataGrid/>}/>
       
  </Routes>
 </Router>
  );
}

export default App;
