import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CloseIcon from "@mui/icons-material/Close"
import IconButton from '@mui/material/IconButton';
import { useNavigate } from "react-router-dom";

export default function TemporaryDrawer({params, clickrow}) {
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const [data,setData] = React.useState(null);
  const toggleDrawer =  (newOpen)   => () => {
    setOpen(newOpen);
    console.log(params.row.Id);
    const men = {
      hostedZone: params.row.Id
    }
    fetch('https://dns-manager-tan.vercel.app/gethostedzone',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body:JSON.stringify(men)}
    )
    .then(response => response.json())
    .then((data) => {
    if (data.success) {
        setData(data.hostedZone);
        console.log(data.hostedZone);
        const {HostedZone,DelegationSet,VPCs} = data.hostedZone;
        console.log(HostedZone);
        console.log(DelegationSet)
        console.log(VPCs)
    } else {
        console.error('Error fetching hosted zones:', data);
    }
    })
.catch(error => {
console.error('Error fetching hosted zones:', error);
});
   };
   const handlePageSubmit =()=>{
    const id = data?.HostedZone?.Id;
    console.log(id)
    navigate('/recordset',{state:{ID:id}})
   }
  const DrawerList = (
    <>
   
    <Box sx={{ 
      width: 550,
      textAlign:'center'
     }} role="presentation" >
    <IconButton onClick={toggleDrawer(false)} style={{float:'right'}}>
      <CloseIcon color="primary"></CloseIcon></IconButton>
    <h1 style={{ fontSize: '30px', margin: '10px', padding: '10px' }}>Hosted zone details</h1> 
    <Divider />
<h1 style={{ fontSize: '20px', margin: '10px' }}>Hosted zone name</h1>
{data?.HostedZone.Name}
<Divider />

      <h1 style={{ fontSize: '20px', margin: '10px' }}>Hosted zone ID</h1>
    {data?.HostedZone?.Id}
      <Divider />
      <h1 style={{ fontSize: '20px', margin: '10px' }}>Type</h1>
      {data?.HostedZone?.Config?.PrivateZone ? 'Private Hosted Zone' : 'Public hosted zone'}
      <Divider />
      <h1 style={{ fontSize: '20px', margin: '10px' }}>Record count</h1>
      {data?.HostedZone?.ResourceRecordSetCount}
      <Divider />
      <h1 style={{ fontSize: '20px', margin: '10px' }}>Name servers</h1>
      {data?.DelegationSet?.NameServers?.map((item,index)=>(
        <li key={index}>{item}</li>
      ))}
       
     <Button style={{margin: '30px' }} onClick={handlePageSubmit} variant="contained" color="primary">Manage Record Sets</Button>
    </Box>
     
     
    </>
  );

  return (
    <div>
      <Button variant='contained' onClick={toggleDrawer(true)}>Open/View</Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
