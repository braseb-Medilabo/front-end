import './Style/App.css';
import Patient from './Patient/Patient';
import PatientList from './Patient/PatientList';
import NotePatientList from './Patient/NotePatientList';
import Login from './Login';
import AppBar from '@mui/material/AppBar';
import Button from "@mui/material/Button";
import {useState, useEffect} from 'react';
import { Toolbar } from '@mui/material';
import instanceAxios from './service/AxiosService';
import { getAccessToken, clearTokens } from "./service/tokenService";
import { AuthProvider, useAuth } from './service/AuthContext';

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
      // requete garder pour supprimmer http cookie refreshToken(localStorage -> httpOnly)
      instanceAxios.post('/auth/logout')
        .then((response) => {
          console.info("logout");
          logout();
          
        })
        .catch((response) => { console.error(response); });
    }

    if (!authToken) return null;
    
      return (
        <Toolbar >
          <Button color="inherit" onClick={() => setPage({ ...page, page: "accueil", datas: null })}>Accueil</Button>
          <Button color="inherit" onClick={() => setPage({ ...page, page: "patientList", datas: null })}>Patient liste</Button>
          <div className="authentificatedInfos" onClick={handlerLogout}>
               <span>{userInfos?.username || "No login"}</span>
               {Array.isArray(userInfos?.roles)
                          ? userInfos.roles.join(",")
                          : "No role"}
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