import React from 'react'

// const Dashboard = React.lazy(() => import('./views/MainDash/MainDash'))
// const Orders = React.lazy(() => import('./views/Orders/Orders'))
const Home = React.lazy(()=>import('./Home/Home'))
const Login = React.lazy(()=>import('./login'))
const Ventes=React.lazy(()=>import('./Ventes/Ventes'))
const VenteDetail=React.lazy(()=>import('./Ventes/VenteDetails'))
const CreateFacture=React.lazy(()=>import('./Ventes/CreateFacture'))
const Clients=React.lazy(()=>import('./Clients/Clients'))

const routes = [

    { path: '/', name: 'Home', element: Home },
    {path:'/Login',name:'Login',element:Login},
    {path:'/Ventes',name:'Ventes',element:Ventes},
    {path:'/Ventes/:id',name:'VenteDetail',element:VenteDetail},
    {path:'/CreateVente',name:'CreateVente',element:CreateFacture},
    {path:'/Clients',name:'Clients',element:Clients},





    // {path:'/Fichier',name:'FichierComm', element:Fichier},
    // {path:'/Offre/:id/FichierForm',name:'FichierForm', element:FichierForm},

]

export default routes
