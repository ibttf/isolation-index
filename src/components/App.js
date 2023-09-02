import React from 'react';
import {Routes, Route} from "react-router-dom"
import Home from '../pages/Home';
const App = () => {
    return (

        <Routes>
          <Route path="*" element={
            <div className="bg-black">
              <Home />
            </div>
          } />

        </Routes>
    );
}

export default App;
