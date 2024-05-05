import { Box, Alert ,CircularProgress,Button} from '@mui/material'
import { DataGrid,GridColDef,gridClasses } from '@mui/x-data-grid'
import React, { useEffect, useMemo, useState } from 'react'
import { grey } from '@mui/material/colors';
import ZoneAction from './ZoneAction';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import {  Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, IconButton, Stack, TextField } from "@mui/material";
import FormControlContext from "@mui/material/FormControl/FormControlContext";
import CloseIcon from "@mui/icons-material/Close"
import { Input } from 'antd';
import TemporaryDrawer from './hostedZoneDrawer';
import { useNavigate } from "react-router-dom";
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
interface ApiResponse {
    success: boolean;
     response: {
      HostedZones: HostedZone[];
      IsTruncated: boolean;
      MaxItems: string;
  };
  }
  
export  interface HostedZone {
      Id: string;
      Name: string;
      CallerReference: string;
      Config: {
        Comment?: string;
        PrivateZone: boolean;
      };
      ResourceRecordSetCount: number;
      [key: string]: any; // Index signature to allow indexing by string keys
    }
    
  
    
    const Test = () => {    
        const [filteredRows, setFilteredRows] = React.useState<HostedZone[]>([]);
        const [done,setDone] =useState(null);
        const [doneCreate,setDoneCreate] =useState(null);
        const [rowId,setRowId] = useState(null);
        const [loading,SetLoading] = useState(false);
        const [open,openchange]=useState(false);
        const [textareaValue, setTextareaValue] = useState('');
        const [clickrow,setClickRow] =useState(null);
        const [count,setCount] =useState(0);
        const [errorMessage, setErrorMessage] = useState(null);
        const [successMessage, setSuccessMessage] = useState(null);
        const data = null;
        const navigate = useNavigate();
        const functionopenpopup=()=>{
            openchange(true);
        }
        const closepopup=()=>{
            openchange(false);
        }
      
      
        const handlePageSubmit =(params)=>{
          const id = params.id
          console.log(id)
          navigate('/recordset',{state:{ID:id}})
         }
        const columns =useMemo(()=>[
          { field: 'Id', headerName: 'ID', width: 300,renderCell: (params) => (
            <div className="text-blue-500 hover:text-blue-700 underline cursor-pointer" onClick={() => handlePageSubmit(params)}>
              
              {params.value}
              
            </div>
          ),},
          { field: 'Name', headerName: 'Name', flex: 1,editable:true },
          { field: 'CallerReference', headerName: 'Caller Reference', flex: 1 },
          { field: 'ResourceRecordSetCount', headerName: 'Record Set Count', width: 160 },
          {field: 'Action',headerName:'Action',width:100 , renderCell: (params) => (
            <ZoneAction {...{ params, rowId, setRowId,setDone,data,setSuccessMessage,setErrorMessage }} />
          ),},
          {
            field: 'delete',
            headerName: 'Delete',
            sortable: false,
            width: 100,
            renderCell: (params) => 
              <>
              { loading ? (
                <CircularProgress
                />
              ):(<DeleteIcon onClick={() => handleDelete(params.row.Id)}
              style={{ color: 'red' }}
              />)}
              </>
            
          }, {field: 'View',headerName:'View',flex:1 , renderCell: (params) => (
            <TemporaryDrawer {...{params,clickrow}} />
          ),},
        ],[rowId]) ;
      

        useEffect(()=>{
          if(!localStorage.getItem('dns')){
            navigate('/login')
          }
                fetch('http://localhost:5000/allhostedzones')
                .then(response => response.json())
                .then((data: ApiResponse) => {
                if (data.success) {
                    setFilteredRows(data.response.HostedZones);
                    console.log(data.response.HostedZones);
                } else {
                    console.error('Error fetching hosted zones:', data);
                }
                })
        .catch(error => {
          console.error('Error fetching hosted zones:', error);
        });
    }, [done,doneCreate,count]); // Fetch data only once when component mounts
    const handleTextareaChange = (event) => {
      setTextareaValue(event.target.value);
    };
    const handleDelete =async (id) => {
      SetLoading(true);
      try {
        const parts = id.split('/');
        const result = await  axios.post('http://localhost:5000/deletehostedzone',
        {hostedzone:parts[parts.length - 1]});
        if(result.status===200){
          SetLoading(false);
          setFilteredRows((prevRows) => prevRows.filter((row) => row.Id !== id));
          setSuccessMessage("Deleted Successfully");
         }
      } catch (error) {
        SetLoading(false);
        console.log(error.response.data.error);
        setErrorMessage(error.response.data.error);
      }
    };
    const handleCreate = async()=>{
      console.log('Textarea value:', textareaValue);
      try {
        
        const result= await axios.post('http://localhost:5000/bulkCreateHostedZones',
        {domainNames:textareaValue});
       //  '/bulkCreateHostedZones'
       
       if(result.status ===200){
         setTextareaValue('');
         closepopup();
         setSuccessMessage('Successfully Created!!!');
       setCount(prev=>prev+1)
       }
      } catch (error) {
          closepopup();
          console.log(error.response.data.error);
          setErrorMessage(error.response.data.error);
      }
      // Close the dialog
    }
    const handlePowerOff= ()=>{
      localStorage.clear();
      navigate('/login')
    }
  return (
    <>
      <div className='p-10'>
      {errorMessage && (
        <Alert severity="error" onClose={()=>setErrorMessage(null)}>
          {errorMessage}
        </Alert>)}
        {successMessage && (
        <Alert severity="success" onClose={()=>setSuccessMessage(null)}>
          {successMessage}
        </Alert>)}
    <div className='flex justify-between mb-10'>
      <div className='text-3xl'>Manage Hosted Zones - Total {filteredRows.length-1}
         </div>
      <div className='flex gap-7'>
      <IconButton onClick={handlePowerOff} aria-label="power off">
      <PowerSettingsNewIcon />
    </IconButton>
      <Button onClick={functionopenpopup} variant="contained" color="primary">
          Create Bulk / Single Zone
        </Button>
      </div>
    </div>
    <Dialog 
            // fullScreen 
            open={open} onClose={closepopup} fullWidth maxWidth="sm">
                <DialogTitle> Create Bulk / Single Zone  <IconButton onClick={closepopup} style={{float:'right'}}><CloseIcon color="primary"></CloseIcon></IconButton>  </DialogTitle>
                <DialogContent>
                    {/* <DialogContentText>Do you want remove this user?</DialogContentText> */}
                    <Stack spacing={2} margin={2}>
                    <Input.TextArea 
                    value={textareaValue}
                    onChange={handleTextareaChange}
                    placeholder='To upload bulk domain Name split it by comma' autoSize={{ minRows: 4, maxRows: 40 }} />
                    </Stack>
                </DialogContent>
                <DialogActions>
                      <Button onClick={handleCreate} color="primary" variant="contained">Submit</Button>
        
                    <Button onClick={closepopup} color="error" variant="contained">Close</Button>
                </DialogActions>
            </Dialog>
    <Box
    sx={{
        height:500,
        width:'100%'
    }}
    >
    {/* <Typography
    variant='h3'
    component='h3'
    sx={{textAlign:'center',mt:3,mb:3}}
    >
        Manage Hosted Zones
        
    </Typography> */}
    <DataGrid
    rows={filteredRows}
    columns={columns}
    getRowId={(row)=> row.Id}
    getRowSpacing={(params) => ({
        top: params.isFirstVisible ? 0 : 5,
        bottom: params.isLastVisible ? 0 : 5,
      })}
      onRowClick={(params)=> setClickRow(params.id)}
      onCellEditCommit={(params) => setRowId(params.id)}
    />
    </Box>
    </div>
    </>
  )
}

export default Test