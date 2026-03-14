import React, {useState, useEffect} from 'react';
import instanceAxios from '../service/axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import '../Style/PatientList.css';


function ListPatient({page, setPage}){
    
   const [patientList, setPatientList] = useState([]);

   useEffect(() => {

        instanceAxios.get("/patient/list")
        .then((response)=> {console.log('liste:', response.data, "tout est parfais");
                            setPatientList(response.data);
                            })
        .catch((error) => {console.log('Error : ', error)})

    },[])

    const onClickPatient = (e, patient) => {
        console.log(e);
        setPage({...page, page : "patient", datas : patient});
    }
    
    return(
            <div className='patientListContainer'>
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
                        <TableRow key={p.id} onClick={(e) => onClickPatient(e, p)} sx={{cursor : "pointer"}} hover>
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
                
            </div>
    );
}


export default ListPatient;


