import './Style/Login.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import React, {useState} from 'react';
import instanceAxios from './service/axios';


function Login({page, setPage, setAuthentificated}){
    
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
            setAuthentificated(true);

        })
        .catch((response) => {console.error(response);})
        
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
            <Button type="submit" 
                    variant="contained">Login</Button>
        </form>    
    </div>
    );
}

export default Login;

