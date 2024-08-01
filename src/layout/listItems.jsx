import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ArchiveIcon from '@mui/icons-material/Archive';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useNavigate } from 'react-router-dom';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import GroupsIcon from '@mui/icons-material/Groups';

const MainListItems =()=> {

  const is_superuser=localStorage.getItem('is_superuser')
  const is_departement=localStorage.getItem('is_departement')
  const is_stricture=localStorage.getItem('is_stricture')
  const is_commission=localStorage.getItem('is_commission')

  const navigate = useNavigate();
  const handleClick=(name)=>{
    switch (name) {
      case 'Home':
        navigate('/');
        break;
      default:
        navigate('/'+name);
    }
  }

  const defaultTheme = createTheme({

  });

  return(
    <ThemeProvider theme={defaultTheme}>

    <React.Fragment>
    {

        
        <>
          <ListItemButton onClick={()=>handleClick('Home')}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
          </ListItemButton>
          <ListItemButton onClick={()=>handleClick('Ventes')}>
            <ListItemIcon>
              <ArchiveIcon />
            </ListItemIcon>
            <ListItemText primary="Ventes" />
          </ListItemButton>
          <ListItemButton onClick={()=>handleClick('Clients')}>
            <ListItemIcon>
              <GroupsIcon />
            </ListItemIcon>
            <ListItemText primary="Clients" />
          </ListItemButton>
        </>
      
    }
    </React.Fragment>
    </ThemeProvider>

  )
}


export default MainListItems