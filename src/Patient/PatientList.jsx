import React, {useState, useEffect} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import '../Style/PatientList.css';
import instanceAxios from '../service/axios';
import { red } from '@mui/material/colors';



function ListPatient({page, setPage}){
    
   const [patientList, setPatientList] = useState([]);
   const [selectedPatient, setSelectedPatient] = useState(null);
   const [errorObject, setErrorObject] = useState({isError : false, errors : {}});

   function errorManagement(error) {
        console.log(error);
        console.log(error.response);
        if (error.response) {
           setErrorObject({...errorObject,isError : true, errors : {status : error.response.status, message : error.response.statusText}});
        }
       
        else if (error.request) {
            console.error("request error");
            console.log(error.request.status);
            if (error.request.status === 0){
                setErrorObject({...errorObject,isError : true, errors : {status : 500, message : "Network error, please try again"}});
            }
            else{
                setErrorObject({...errorObject,isError : true, errors : {status : error.request.status, message : error.request.statusText}});
            }
            
        }
        else{
            console.error("Something went wrong");
            setErrorObject({...errorObject,isError : true, errors : {status : 500, message : "Something went wrong"}});
        }
    }

   function fetchPatients() {
        instanceAxios.get("/patient/list")
            .then((response) => {
                console.log('liste:', response.data, "tout est parfais");
                setPatientList(response.data);
                setErrorObject({...errorObject,isError : false, errors : {}});
            })
            .catch((error) => { errorManagement(error) });
    }

   useEffect(() => {

        fetchPatients();

    },[])

    //table event
    function onClickPatient(e, patient) {
        console.log(e);
        setAnchorEl(null);
        setPage({ ...page, page: "patient", datas: patient });
    }

    function onClickNotePatient(e, patient) {
        console.log(e);
        setAnchorEl(null);
        setPage({ ...page, page: "note_patient", datas: patient });
    }

    async function onDeletePatient(e, patient) {
        console.log("delete patient");
        if (!selectedPatient) return;
        console.info(patient);
        try {
            await instanceAxios.delete("/patient/note/" + patient.id);
            const response = await instanceAxios.delete("/patient/" + patient.id);
            console.log(response.data);
            fetchPatients();

        } catch (error) {
            errorManagement(error);
        } finally {
            setAnchorEl(null);
        }



    }

    //popup menu event
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClickContextMenu = (event, patient) => {
        event.preventDefault();
        console.log(event);
        console.info(event.currentTarget);  
        //setAnchorEl(event.currentTarget);
        setAnchorEl({left : event.clientX, top : event.clientY})
        setSelectedPatient(patient);
    };
  const handleCloseMenu = () => {
        setAnchorEl(null);
  };
    
    return(
            <div className='patientListContainer'>
                {errorObject.isError && (
                <div className='errorMessage'> {errorObject.errors.message}</div>
                )}  
                <div className='buttons'>
                    <Button type="button" variant="contained" onClick={(e) => onClickPatient(e, null)}>Create new Patient</Button>
                </div>
                <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} >
                    <TableHead>
                    <TableRow>
                        <TableCell align='center' hidden>Id</TableCell>
                        <TableCell align='center'>Lastname</TableCell>
                        <TableCell align="center">Firstname</TableCell>
                        <TableCell align="center">Date&nbsp;of&nbsp;Bith</TableCell>
                        <TableCell align="center">Gender</TableCell>
                        <TableCell align="center">Address</TableCell>
                        <TableCell align="center">Phone&nbsp;number</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {patientList.map((p) => (
                        <TableRow key={p.id} 
                                    onClick={(e) => onClickPatient(e, p)} 
                                    onContextMenu={(e) => handleClickContextMenu(e,p)}
                                    sx={{cursor : "pointer"}} 
                                    hover>
                        <TableCell component="th" scope="row">
                            {p.id}
                        </TableCell>
                        <TableCell align="center">{p.lastName}</TableCell>
                        <TableCell align="center">{p.firstName}</TableCell>
                        <TableCell align="center">{p.dateOfBirth}</TableCell>
                        <TableCell align="center">{p.gender}</TableCell>
                        <TableCell align="center">{p.address}</TableCell>
                        <TableCell align="center">{p.phoneNumber}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
                <Menu
                    id="popup-menu"
                    //anchorEl={anchorEl}
                    anchorReference="anchorPosition"
                    anchorPosition= {anchorEl}
                    open={open}
                    onClose={handleCloseMenu}
                    slotProps={{
                    list: {
                        'aria-labelledby': 'basic-button',
                    },
                    }}
                >
                    <MenuItem onClick={(e, patient)=>onClickNotePatient(e, selectedPatient)}>View notes</MenuItem>
                    <MenuItem onClick={(e, patient)=>onClickPatient(e, selectedPatient)}>Edit</MenuItem>
                    <MenuItem 
                            onClick={(e, patient)=>onDeletePatient(e, selectedPatient)} 
                            sx={{color: "red"}}>Delete</MenuItem>
                </Menu>
                
            </div>
    );
}


export default ListPatient;


