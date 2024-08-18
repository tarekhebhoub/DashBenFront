import React, {Suspense,useEffect } from 'react'
import { HashRouter, Route, Routes,Navigate } from 'react-router-dom'
import axios from 'axios'
// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const Login = React.lazy(()=>import('./pages/login'))



const App=()=> {
    const url = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem('token');
    console.log(token)
    let isAuthenticated=true;
     if(token==null || token=='null' ){
        isAuthenticated=false;
     }

    const testToken=()=>{
      const config = {
        headers: {
          'Authorization': `Token ${token}`,
        }
      }
      axios.get(url+'tryToken/',config)
      ?.then((res)=>{
      })
      .catch((e)=>{
        console.log(e.data)
        isAuthenticated=false;
        localStorage.removeItem('token')
        window.location.reload()
      })
    }
    if(isAuthenticated==true){
        testToken();
    }


    return (
      <HashRouter>
        <Suspense >
          <Routes>
            <Route path="*" name="Home" element={isAuthenticated?<DefaultLayout />:<Navigate to="/login" />} />
            <Route exact path='/login' name="Login" element={!isAuthenticated?<Login />:<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </HashRouter>
    )
  
}

export default App;
