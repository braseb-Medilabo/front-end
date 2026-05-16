import './Style/Login.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import React, {useState} from 'react';
import instanceAxios from './service/axios';


function Login({page, setPage, authentificated, setAuthentificated}){
    
    const apiPrefix = "/api/v1";
    
    const [loginInfos, setLoginInfo] = useState({ident : "", pass : ""});

    const handleSubmit = (e) => {
        e.preventDefault();
        //const data = new URLSearchParams();
        //data.append("username", loginInfos.ident);
        //data.append("password", loginInfos.pass); 
        instanceAxios.post(apiPrefix + "/login", 
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
            setAuthentificated({...authentificated, status : false, error : true, message : error.message})
           
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

