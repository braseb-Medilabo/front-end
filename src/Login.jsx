import './Style/Login.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import React, {useState} from 'react';
import instanceAxios from './service/axios';


function Login({page, setPage, authentificated, setAuthentificated}){
    
    const [loginInfos, setLoginInfo] = useState({ident : "", pass : ""});

    const handleSubmit = (e) => {
        e.preventDefault();
        //const data = new URLSearchParams();
        //data.append("username", loginInfos.ident);
        //data.append("password", loginInfos.pass); 
        instanceAxios.post("/login", 
                            loginInfos
                            //{headers: {
                            //    "Content-Type": "application/x-www-form-urlencoded"
                            //    }
                            //}
                        )
        .then((response) => {
            console.info(response.status);
            console.info(response.data);
            setPage("accueil");
            setAuthentificated({...authentificated, status : true, error : false, message : ""});
            
        })
        .catch((error) => {
            console.error(error);
            console.error(error.request)
            if (error.response){
                console.error(error.status)
                if (error.status === 401){
                    setAuthentificated({...authentificated, status : false, error : true, message : "Invalid credentials"});
                }
                else{
                     setAuthentificated({...authentificated, status : false, error : true, message : "Something went wrong"});
                }
            }
            else if (error.request) {
                setAuthentificated({...authentificated, status : false, error : true, message : "Network error, please try again"});
            }
            else{
                setAuthentificated({...authentificated, status : false, error : true, message : "Something went wrong"});
            }
           
        })
        
    }
    
    return(
    <div className='loginContainer'>
        <form className="form-container" onSubmit={handleSubmit}>
            <TextField label="Login" 
                        variant="outlined" 
                        value={loginInfos.ident}
                        onChange={(e)=>setLoginInfo({...loginInfos, ident : e.target.value})}/>
            <TextField label="Password" 
                    variant="outlined" 
                    value={loginInfos.pass}
                    onChange={(e)=>setLoginInfo({...loginInfos, pass : e.target.value})}/>
            {authentificated.error && (
                <div className='errorMessage'> {authentificated.message}</div>
            )}
            <Button type="submit" 
                    variant="contained">Login</Button>
        </form>    
    </div>
    );
}

export default Login;

