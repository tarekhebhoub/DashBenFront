import React,{useState,useEffect} from 'react'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import axios from 'axios'
const Home=()=>{


  const url = process.env.REACT_APP_API_URL;
  
  const [offers,setOffers]=useState([])
  const token=localStorage.getItem('token')
  console.log(token)
  const getOffers=()=>{
    const config = {
      headers: {
        'Authorization': `Token ${token}`,
      }
    }
    axios.get(url+'OffreEmp/',config)
      .then((res) => {
      const data = res.data
      console.log(data)
      setOffers(data)
    })
    .catch((e) => {
      console.log(url)
    });
  }
  useEffect(()=>{
    getOffers()
  },[])


  const searchOffre=(e)=>{
    const searchString = 'li'; // Replace this with the characters or substring you want to filter by.
    const filteredOffers = offers.filter(offer => offer.TitreOffre.toLowerCase().includes(searchString.toLowerCase()));
    // setData(filteredOffers)
  }
  const Offers=offers.map((offer,index)=>{
    return(
      <Grid key={index} item xs={4}>

      </Grid>
      )
    })

  return(
  
  <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
    
  </Grid>
  )
}
export default Home;