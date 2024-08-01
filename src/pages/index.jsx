import React, { useState,useEffect,Suspense} from 'react'
import { Navigate, useNavigate, Route, Routes } from 'react-router-dom'


// routes config
import routes from './routes'

const AppContent = () => {
 
  return (    
      <Suspense>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={(<route.element/>)}
                />
              )
            )
          })}
          {/*<Route path="/" element={<Navigate to="Home" replace />} />*/}
        </Routes>
      </Suspense>
  )
}

export default React.memo(AppContent)