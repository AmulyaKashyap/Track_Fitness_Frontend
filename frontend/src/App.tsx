import './index.css';
import Header from './components/Header';
import SideBarComponent from './components/SideBarComponent';
import AppRoutes from './routes/routes';
import { BrowserRouter } from "react-router-dom";
import { useLocation } from 'react-router-dom';

function MainLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  return (
    <>
      {!isLoginPage && <Header />}
      <SideBarComponent />
    </>
  );

}


function App() {

  return (
    <div className="bg-[#121620] text-gray-200 min-h-screen font-sans antialiased flex flex-col flex-1">
      <BrowserRouter>
        <MainLayout />
        <AppRoutes />
      </BrowserRouter>
    </div >
  )
}

export default App
