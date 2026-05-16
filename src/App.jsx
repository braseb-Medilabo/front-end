import './Style/App.css';
import Patient from './Patient/Patient';
import PatientList from './Patient/PatientList';
import NotePatientList from './Patient/NotePatientList';
import Login from './Login';
import AppBar from '@mui/material/AppBar';
import Button from "@mui/material/Button";
import {useState} from 'react';
import { Toolbar } from '@mui/material';
import instanceAxios from './service/axios';






function App() {
  
  const apiPrefix = "/api/v1";
  
  const [page, setPage] = useState({page : "home", datas : null});
  const [authentificated, setAuthentificated] = useState({status : false, error : false, message : ""});
  

  function logout(e) {
    instanceAxios.post(apiPrefix + '/logout')
                      .then((response) => {
                        console.info("logout");
                        setAuthentificated({...authentificated, status : false, error : false, message : ""});
                        setPage({ ...page, page: "home", datas: null });
                      })
                      .catch((response) => { console.error(response); });
                  }
  

  function menu(auth) {
    if (auth.status) {
      return (
        <Toolbar className='menu-contener'>

          <Button color="inherit" onClick={() => setPage({ ...page, page: "accueil", datas: null })}>Accueil</Button>
          <Button color="inherit" onClick={() => setPage({ ...page, page: "patientList", datas: null })}>Patient liste</Button>
          <Button color="inherit" onClick={logout}>Logout</Button>
        </Toolbar>
      );
    }
    else {
      <Toolbar className='menu-contener'>

      </Toolbar>;
    }
  }
  
  function renderPage(page, setPage, authentificated, setAuthentificated) {
    if (page.page === "home") {
      return <Login page={page} setPage={setPage} authentificated={authentificated} setAuthentificated={setAuthentificated} />;
    }
    else if (page.page === "patient") return <Patient page={page} setPage={setPage} />;
    else if (page.page === "patientList") return <PatientList page={page} setPage={setPage} />;
    else if (page.page === "note_patient") return <NotePatientList page={page} setPage={setPage} />;
    return <div>Accueil</div>;
  }



  
  return (
    <><AppBar position="static">
      {menu(authentificated)}
      
    </AppBar>
        {renderPage(page, setPage, authentificated, setAuthentificated)}
      </>
  );  
}


export default App;