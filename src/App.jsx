import './style/App.css';
import Patient from './patient/Patient';
import PatientList from './patient/PatientList';
import NotePatientList from './patient/NotePatientList';
import Login from './Login';
import AppBar from '@mui/material/AppBar';
import Button from "@mui/material/Button";
import {useState, useEffect} from 'react';
import { Toolbar } from '@mui/material';
import instanceAxios from './service/axiosService';
import { getAccessToken, clearTokens } from "./service/tokenService";
import { AuthProvider, useAuth } from './service/AuthContext';

const config = window.__APP_CONFIG__;

function RenderPage( {page, setPage}) {
    const {authToken} = useAuth();

    if (!authToken){
      return <Login />;
    }
    
    else if (page.page === "patient") return <Patient page={page} setPage={setPage} />;
    else if (page.page === "patientList") return <PatientList page={page} setPage={setPage} />;
    else if (page.page === "note_patient") return <NotePatientList page={page} setPage={setPage} />;
    return <div>Accueil</div>;
}

function Menu( {page, setPage}) {
  const { authToken, logout, userInfos} = useAuth();

  function handlerLogout(e) {
    e.preventDefault();
    // requete garder pour supprimer http cookie refreshToken(localStorage -> httpOnly)
    /*instanceAxios.post('/auth/logout')
      .then((response) => {
        console.info("logout");
        logout();
        
      })
      .catch((response) => { console.error(response); });*/
      logout();
  }

  if (!authToken) return null;
  
  return (
    <Toolbar >
      <Button color="inherit" onClick={() => setPage({ ...page, page: "accueil", datas: null })}>Accueil</Button>
      <Button color="inherit" onClick={() => setPage({ ...page, page: "patientList", datas: null })}>Patient liste</Button>
      <div className='infos'>
        <div className="versionInfos">
          <span>{"Build " + config?.deploymentVersion || "Undefined"}</span>
        </div>
        <div className="authentificatedInfos" onClick={handlerLogout}>
          <span>{userInfos?.username || "No login"}</span>
          <span>  {Array.isArray(userInfos?.roles)
                      ? userInfos.roles.join(",")
                      : "No role"}</span>
        </div>
      </div>
      
    </Toolbar>
  );
}

function App() {
  
  const [page, setPage] = useState({page : "home", datas : null});
  
  return (
    <AuthProvider>
      <AppBar position="static">
        <Menu page={page} setPage={setPage}/>
      </AppBar>
      <RenderPage page={page} setPage={setPage}/>
      
    </AuthProvider>
  );  
}


export default App;