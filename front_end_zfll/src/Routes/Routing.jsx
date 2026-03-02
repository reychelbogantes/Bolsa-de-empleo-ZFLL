import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import EmpresaPage from '../Pages/Empresa/empresaPage'
import Homepage from '../Pages/Homepage/Homepage'
import Admin_regist from '../Pages/Admin_Regist/Admin_regist'


function Routing() {


  return (
    <Router>    
      <Routes>    
        
        <Route path="/" element={<Homepage />} />
        <Route path="Empresa" element={<EmpresaPage />} />
        <Route path="/login" element={<Admin_regist />} />

      </Routes>    
    </Router>
  )
}

export default Routing