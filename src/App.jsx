import { Route, Routes } from 'react-router-dom';
import AdminDashboardPage from './pages/AdminDashboardPage/AdminDashboardPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage/OwnerDashboardPage';
import { BrowserRouter} from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';

function App(){
  return( 
  
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
        <Route path="/owner-dashboard" element={<OwnerDashboardPage />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
