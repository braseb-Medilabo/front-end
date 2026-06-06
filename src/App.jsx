import './Style/App.css';
import Patient from './Patient/Patient';
import PatientList from './Patient/PatientList';
import NotePatientList from './Patient/NotePatientList';
import Login from './Login';
import AppBar from '@mui/material/AppBar';
import Button from "@mui/material/Button";
import {useState, useEffect} from 'react';
import { Toolbar } from '@mui/material';
import instanceAxios from './service/axios';
import { getAccessToken, clearTokens } from "./service/tokenService";


function App() {
  
  const [page, setPage] = useState({page : "home", datas : null});
  //const [authentificated, setAuthentificated] = useState({token : null, error : false, message : "", authentificated : null});
  
  const [authentificated, setAuthentificated] = useState({
                                                          token: getAccessToken(),
                                                          error: false,
                                                          message: "",
                                                          userInfos: null,
                                                          });
  
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAccessToken();

      if (!token) return;

      try {
        
        
        const response = await instanceAxios.get("/me");
        console.log("refresh user infos");
        console.log(response.data);

        setPage("accueil");

        setAuthentificated({
          token: token,
          refreshToken : null,
          error: false,
          message: "",
          userInfos: response?.data,
        });

        
      } catch (error) {
        console.log("error useffect /me");
        setPage("login");
        setAuthentificated({
          token: null,
          refreshToken : null,
          error: true,
          message: "Erreur d'authentification",
          userInfos: null,
        });
      }
    };

    checkAuth();
  }, []);


  function logout(e) {
    instanceAxios.post('/auth/logout')
                      .then((response) => {
                        console.info("logout");
                        setAuthentificated({...authentificated, token : null, error : false, message : "", userInfos : null});
                        //localStorage.removeItem("token");
                        clearTokens();
                        setPage({ ...page, page: "home", datas: null });
                      })
                      .catch((response) => { console.error(response); });
                  }

                  
  

  function menu(auth) {
    
    if (!auth.token) return null;
    
      return (
        <Toolbar >

          <Button color="inherit" onClick={() => setPage({ ...page, page: "accueil", datas: null })}>Accueil</Button>
          <Button color="inherit" onClick={() => setPage({ ...page, page: "patientList", datas: null })}>Patient liste</Button>
          {/*<Button color="inherit" onClick={logout}>Logout</Button>*/}
          <div className="authentificatedInfos" onClick={logout}>
               <span>{auth.userInfos?.username || "No login"}</span>
               {Array.isArray(auth.userInfos?.roles)
                          ? auth.userInfos.roles.join(",")
                          : "No role"}
          </div>
        </Toolbar>
      );
    
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