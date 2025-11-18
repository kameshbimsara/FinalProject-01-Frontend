import { Route, Routes } from 'react-router-dom';
import './App.css'
import AdminLoginPage from './pages/AdminLoginPage/AdminLoginPage';
import HomePage from './pages/HomePage/HomePage';

function App(){
  return( 
  
    <Routes>
      <Route path="/" element={<AdminLoginPage />} />
      <Route path="/home" element={<HomePage />} />
    </Routes>

    

  );
}

export default App;
