import axios from 'axios';
import React, { useEffect,useState,useMemo } from 'react'
import { Link, useLocation ,useNavigate} from 'react-router-dom';
import { Box, Alert ,CircularProgress,Button} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { v4 as uuidv4 } from 'uuid';
import DeleteIcon from '@mui/icons-material/Delete';
import ZoneAction from '../components/ZoneAction';
import { TextField,MenuItem } from '@mui/material';
import {  Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, IconButton, Stack } from "@mui/material";
import FormControlContext from "@mui/material/FormControl/FormControlContext";
import CloseIcon from "@mui/icons-material/Close";
import { Input } from 'antd';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

interface ResourceRecord {
    Value: string;
}

interface DataGridRow {
    Name: string;
    TTL: number;
    Type: string;
    id:number;
    ResourceRecords: ResourceRecord[];
}
const RecordSet = () => {
  const navigate = useNavigate();
  const [Data,setData] = useState<DataGridRow[]>([]);
   const [rowId,setRowId] = useState(null);
  const [done,setDone] =useState(null);
  const [doneCreate,setDoneCreate] =useState(null);
  const [loading,SetLoading] = useState(false);
  const [open,openchange]=useState(false);
  const [openD,openDchange]=useState(false);
  const [textareaValue, setTextareaValue] = useState('');
   const [clickrow,setClickRow] =useState(null);
   const[placeholder,setPlaceHolder] =useState('ResourceRecords');
   const [errorMessage, setErrorMessage] = useState(null);
   const [successMessage, setSuccessMessage] = useState(null);
  const [count,setCount] =useState(0);
  const location = useLocation();
  const data = location.state?.ID;
  useEffect(()=>{
    if(!localStorage.getItem('dns')){
      navigate('/login')
    }
    const men = {
      hostedZone: data
    }
    fetch('http://localhost:5000/getrecordset',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(men)}
      )
      .then(response => response.json())
      .then((data) => {
      if (data.success) {
          setData(data?.response);
          const final = data.response
          
          console.log(data.response);
         
      } else {
          console.error('Error fetching hosted zones:', data);
      }
      })
  .catch(error => {
  console.error('Error fetching hosted zones:', error);
  });
  },[done,doneCreate,count]);
  const columns = [
    { field: 'Name', headerName: 'Name', flex: 1,
    editable: true },
    {
      field: 'Type',
      headerName: 'Type',
      flex: 1,
      type: 'singleSelect',
      editable: true,
      valueOptions: ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'PTR', 'SRV', 'SPF', 'NAPTR', 'CAA', 'DS'],
    },
    { field: 'TTL', headerName: 'TTL', flex: 1,  editable: true
    },
    {
      field: 'ResourceRecords',
      headerName: 'Resource Records',
      width: 300, 
      editable: true,
      renderCell: (params) => (
        <div className='flex flex-col' >
          {
          Array.isArray(params.row?.ResourceRecords) ?
            params.row?.ResourceRecords?.map((record, index) => (
              
            <div className='' key={index}>{record.Value}</div>
          )) : 
         params.row?.ResourceRecords
          }
        </div>
      )
    
    }
    ,  {field: 'Action',headerName:'Action',width:100 , renderCell: (params) => (
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
        ):(<DeleteIcon onClick={() => handleDelete(params.row)}
        style={{ color: 'red' }}
        />)}
        </>
      
    }
  ];
  const handleDelete =async (dataD) => {
    SetLoading(true);
    console.log(data)
    
    const parts = data.split('/');
    const hostedZone = parts[parts.length-1];
     
    try {
      
      const final =  JSON.stringify({hostedZone,dataD});
      let result = await  axios.post('http://localhost:5000/deleterecordset',
      {final});
     if(result.status === 200){
      //setSuccessMessage()
       SetLoading(false);
         setData((prevRows) => prevRows.filter((row) => row.id !== dataD.id));
        setSuccessMessage('Deleted !!')
       console.log(result);

     }
    
  } catch (error) {
    console.log(error);
    SetLoading(false);
     setErrorMessage(error.response.data.error.message);
    }
  };
  const functionopenpopup=()=>{
    openchange(true);
}
const closepopup=()=>{
    openchange(false);
}
const functionopendpopup=()=>{
  openDchange(true);
}
const closepopdup=()=>{
  openDchange(false);
}
const handleTextareaChange = (event) => {
  setTextareaValue(event.target.value);
};
const handleCreate = async()=>{
      try {
        
        const hostedZone = {val:data};
          const result= await axios.post('http://localhost:5000/creatednsrecord',
         {formData,...hostedZone});
        //  '/bulkCreateHostedZones'
       // var count = 0 ;
        if(result.status ===200){
          setFormData({
            Name: '',
            Type: '',
            TTL:'',
            ResourceRecords:'',
          });
          closepopup();
          setCount(prev=> prev+1);
          setSuccessMessage('Successfully Created!!!')
        }
      } catch (error) {
        console.log(error);
        setErrorMessage(error.response.data.message);
      }
  // Close the dialog

}
const [formData, setFormData] = useState({
  Name: '',
  Type: '',
  TTL:'',
  ResourceRecords:'',
});

const handleChange = (e) => {
  const { name, value } = e.target;
  if(name==="Type"){
    if(value === "CNAME"){
      setPlaceHolder("www.example.com");
    }else if(value ==="A"){
      setPlaceHolder("127.0.0.1");
    }else if(value ==="AAAA"){
      setPlaceHolder("2001:0db8:85a3::8a2e:0370:7334");
    }else if(value ==="MX"){
      setPlaceHolder("10 mail.example.com.");
    }else if(value ==="TXT"){
      setPlaceHolder("sample text");
    }else if(value ==="PTR"){
      setPlaceHolder("www.example.com");
    }else if(value ==="SRV"){
      setPlaceHolder("10 5 5060 michealajit.in.");
    }else if(value ==="SPF"){
      setPlaceHolder("v=spf1 ip4:192.168.0.1/16-all");
    }else if(value ==="NAPTR"){
      setPlaceHolder('10 100 "S" "SIP+D2U" "" foo.example.com.');
    }else if(value ==="CAA"){
      setPlaceHolder('0 issue "ca.example.com"');
    }else if(value ==="DS"){
      setPlaceHolder("12345 3 1 123456789abcdef67890123456789abcdef67890");
    }

  }
  setFormData(prevData => ({
    ...prevData,
    [name]: value
  }));
  //console.log(formData)
};

const handleBulkCreate =async () => {
 
  try {
    const result= await axios.post('http://localhost:5000/createBulkRecordSets',
    {textareaValue,data});

       //count = 0;
      if(result.status===200){

        setTextareaValue('');
        closepopdup();
        setCount(prev=> prev+1);
        setSuccessMessage('Successfully Created Bulk Data');
      }
  } catch (error) {
    console.log(error);
    setErrorMessage(error.response.data.error);
    closepopdup();

  }

 
 // console.log(Data); // Handle form submission here
};
const handleCloseAlert = () => {
  setErrorMessage(null);
};
  return (

    <div className='p-10' style={{ height: 400, width: '100%' }}>
       {errorMessage && (
        <Alert severity="error" onClose={handleCloseAlert}>
          {errorMessage}
        </Alert>)}
        {successMessage && (
        <Alert severity="success" onClose={()=>setSuccessMessage(null)}>
          {successMessage}
        </Alert>)}
       <div className='flex justify-between mb-10'>
        <div className='flex gap-5'>
       <Link to='/dashboard'> 
        <KeyboardArrowLeftIcon />
         </Link>
        <div className='text-3xl'> Manage Record Sets - Total {Data.length}
         </div> </div>
         <div className='flex gap-7'>
      <div className=''>
      <Button onClick={functionopendpopup} variant="contained" color="primary">
          Create Bulk 
        </Button>
        </div> <div>
        <Button onClick={functionopenpopup} variant="contained" color="primary">
          Create  Single Record List.
        </Button>
      </div></div>
    </div>
    <Dialog 
            // fullScreen 
            open={openD} onClose={closepopdup} fullWidth maxWidth="sm">
                <DialogTitle> Create Bulk Record Set  <IconButton onClick={closepopup} style={{float:'right'}}><CloseIcon color="primary"></CloseIcon></IconButton>  </DialogTitle>
                <DialogContent>
                    {/* <DialogContentText>Do you want remove this user?</DialogContentText> */}
                    <Stack spacing={2} margin={2}>
                    <Input.TextArea 
                    value={textareaValue}
                    onChange={handleTextareaChange}
                    placeholder='In Array important [{
                      "Name": "bulkdatra.data",
                      "Type": "A",
                      "TTL": 300,
                      "ResourceRecords": [
                        {
                          "Value": "192.168.1.1"
                        }
                      ]
                    }]' autoSize={{ minRows: 4, maxRows: 40 }} />
                    </Stack>
                </DialogContent>
                <DialogActions>
                      <Button onClick={handleBulkCreate} color="primary" variant="contained">Submit</Button>
        
                    <Button onClick={closepopdup} color="error" variant="contained">Close</Button>
                </DialogActions>
            </Dialog>
    <Dialog 
            // fullScreen 
            open={open} onClose={closepopup} fullWidth maxWidth="md">
                <DialogTitle> Create Bulk / Single Zone  <IconButton onClick={closepopup} style={{float:'right'}}><CloseIcon color="primary"></CloseIcon></IconButton>  </DialogTitle>
                <DialogContent>
                
 
                    <Stack spacing={5} margin={5}>
                   
          <TextField
            label="Name"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            select
            label="Type"
            name="Type"
            value={formData.Type}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            {['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'PTR', 'SRV', 'SPF', 'NAPTR', 'CAA', 'DS'].map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
          <TextField
            type="number"
            label="TTL"
            name="TTL"
            value={formData.TTL}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            multiline
            rows={4}
            placeholder={placeholder}
            label={placeholder}
            name="ResourceRecords"
            value={formData.ResourceRecords}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        
       
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
    

     
    <DataGrid
    rows={Data}
    columns={columns}
     
 
    getRowId={(params) => params.id}
    getRowSpacing={(params) => ({
      top: params.isFirstVisible ? 0 : 5,
      bottom: params.isLastVisible ? 0 : 5,
    })}
   getRowHeight={() => 'auto'}
   onRowClick={(params)=> setClickRow(params.id)}
    onCellEditCommit={(params) => setRowId(params.id)}
    />
    </Box>
    </div>
  )
}

export default RecordSet