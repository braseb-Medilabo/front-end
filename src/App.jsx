import './Style/App.css';
import Patient from './Patient/Patient';
import PatientList from './Patient/PatientList';
import Login from './Login';
import AppBar from '@mui/material/AppBar';
import Button from "@mui/material/Button";
import {useState} from 'react';
import { Toolbar } from '@mui/material';
import instanceAxios from './service/axios';






function App() {
  
  const [page, setPage] = useState({page : "home", datas : null});
  const [authentificated, setAuthentificated] = useState(false);

  const logout = (e) => {
      instanceAxios.post('/logout')
      .then((response) => {
          console.info("logout");
          setAuthentificated(false);
          setPage({...page, page : "home", datas : null})
        })
      .catch((response) => {console.error(response);})
  }
  

  const menu = (auth) => {
    if (auth) {
      return (
        <Toolbar className='menu-contener'>
          
          <Button color="inherit" onClick={()=>setPage({...page, page : "accueil", datas : null})}>Accueil</Button>
          <Button color="inherit" onClick={()=>setPage({...page, page : "patientList", datas : null})}>Patient liste</Button>
          <Button color="inherit" onClick={logout}>Logout</Button>
        </Toolbar>
      )
    }
    else {
        <Toolbar className='menu-contener'>

        </Toolbar>
    }
  }
  
  const renderPage = (page, setPage, authentificated, setAuthentificated) => {
    if (page.page === "home"){
      return <Login page={page} setPage={setPage} setAuthentificated={setAuthentificated}/> 
    }
    else if (page.page === "patient") return <Patient page={page} setPage={setPage}/>;
    else if (page.page === "patientList") return <PatientList page={page} setPage={setPage}/>;
    return <div>Accueil</div>;
  };



  
  return (
    <><AppBar position="static">
      {menu(authentificated)}
      
    </AppBar>
        {renderPage(page, setPage, authentificated, setAuthentificated)}
      </>
  );  
}


export default App;