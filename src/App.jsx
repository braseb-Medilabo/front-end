import './Style/App.css';
import Patient from './Patient/Patient';
import PatientList from './Patient/PatientList';
import Login from './Login';
import AppBar from '@mui/material/AppBar';
import Button from "@mui/material/Button";
import React, {useState} from 'react';
import { Toolbar } from '@mui/material';






function App() {
  
  const [page, setPage] = useState({page : "home", datas : null});
  

  const renderPage = (page, setPage, loginInfos, setLoginInfo) => {
    if (page.page === "home"){
      return <Login page={page} setPage={setPage}/> 
    }
    else if (page.page === "patient") return <Patient page={page} setPage={setPage}/>;
    else if (page.page === "patientList") return <PatientList page={page} setPage={setPage}/>;
    return <div>Accueil</div>;
  };

  
  return (
    <><AppBar position="static">
      <Toolbar className='menu-contener'>
        <Button color="inherit" onClick={()=>setPage({page : "home", datas : null})}>Accueil</Button>
        <Button color="inherit" onClick={()=>setPage({page, page : "patientList", datas : null})}>Patient liste</Button>
      </Toolbar>
      
    </AppBar>
        {renderPage(page, setPage)}
      </>
  );  
}


export default App;