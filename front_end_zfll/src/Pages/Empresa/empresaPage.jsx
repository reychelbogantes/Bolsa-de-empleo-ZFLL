import React from 'react'
import "./empresaPage.css"
import Vacantes from '../../Components/empresa/vacantes/Vacantes'

function EmpresaPage() {
  return (
    <div className="empresa-page">
      <h1>Empresa</h1>
      <Vacantes />
    </div>
  )
}

export default EmpresaPage