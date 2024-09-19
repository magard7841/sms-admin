import React from 'react';
import Dashboard from './components/Dashboard';
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <div className="App">
      <Dashboard />
      <ToastContainer />
    </div>
  );
}

export default App;