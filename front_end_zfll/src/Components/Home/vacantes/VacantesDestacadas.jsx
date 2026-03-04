import React, { useState } from 'react';
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaClock, 
  FaTimes, 
  FaCalendarAlt, 
  FaFilter 
} from "react-icons/fa";
import '../../../Pages/Homepage/Homepage.css';

const VacantesDestacadas = () => {
  const [vacanteSeleccionada, setVacanteSeleccionada] = useState(null);

  const vacantes = [
    {
      id: 1,
      titulo: "Ingeniero de Calidad Jr.",
      empresa: "Medtronic",
      ubicacion: "Cartago, Costa Rica",
      fecha: "2024-02-25",
      tipo: "TIEMPO COMPLETO",
      inicial: "M",
      descripcion: "Buscamos un ingeniero con pasión por la excelencia médica y mejora de procesos.",
      requisitos: ["Ingeniería Industrial", "Inglés B2", "Excel Avanzado"]
    },
    {
      id: 2,
      titulo: "Pasantía en Logística",
      empresa: "Edwards Lifesciences",
      ubicacion: "Cartago, Costa Rica",
      fecha: "2024-02-24",
      tipo: "PASANTÍA",
      inicial: "E",
      descripcion: "Oportunidad para estudiantes de último año de carrera para integrarse al equipo de cadena de suministro.",
      requisitos: ["Estudiante de Logística", "Disponibilidad inmediata"]
    },
    {
      id: 3,
      titulo: "Senior Software Developer",
      empresa: "Terumo BCT",
      ubicacion: "Cartago, Costa Rica",
      fecha: "2024-02-20",
      tipo: "TIEMPO COMPLETO",
      inicial: "T",
      descripcion: "Desarrollo de sistemas críticos para dispositivos médicos utilizando tecnologías de vanguardia.",
      requisitos: ["5+ años experiencia", "C++", "Sistemas Embebidos"]
    }
  ];

  return (
    <section className="vacantes-container">
      {/* Encabezado y Buscador */}
      <header className="toolbar">
        <div className="title-group">
          <h1>Vacantes Destacadas</h1>
          <p>Explora las oportunidades actuales en la zona franca.</p>
        </div>

        <nav className="controls">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Buscar por puesto, empresa o..." 
              className="search-input"
            />
          </div>
          <button type="button" className="filter-btn">
            <FaFilter />
          </button>
        </nav>
      </header>

      {/* Grid de Tarjetas */}
      <main className="jobs-grid">
        {vacantes.map((item) => (
          <article key={item.id} className="job-card1">
            <div className="card-header">
              <div className="logo-box">{item.inicial}</div>
              <span className={`badge ${item.tipo === 'PASANTÍA' ? 'badge-indigo' : 'badge-blue'}`}>
                {item.tipo}
              </span>
            </div>

            <div className="card-body">
              <h3>{item.titulo}</h3>
              <p className="company">{item.empresa}</p>
            </div>

            <ul className="meta-info">
              <li>
                <FaMapMarkerAlt className="meta-icon" />
                {item.ubicacion}
              </li>
              <li>
                <FaClock className="meta-icon" />
                {item.fecha}
              </li>
            </ul>

            <button 
              type="button" 
              className="btn-details"
              onClick={() => setVacanteSeleccionada(item)}
            >
              Ver Detalles
            </button>
          </article>
        ))}
      </main>

      {/* MODAL (Se muestra solo si hay una vacante seleccionada) */}
      {vacanteSeleccionada && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setVacanteSeleccionada(null)}>
              <FaTimes />
            </button>
            
            <header className="modal-header">
              <div className="logo-box-large">{vacanteSeleccionada.inicial}</div>
              <div>
                <h2>{vacanteSeleccionada.titulo}</h2>
                <p className="modal-company">{vacanteSeleccionada.empresa}</p>
              </div>
            </header>

            <section className="modal-body">
              <div className="info-section">
                <h4>Descripción del puesto</h4>
                <p>{vacanteSeleccionada.descripcion}</p>
              </div>

              <div className="info-section">
                <h4>Requisitos clave</h4>
                <div className="tags-container">
                  {vacanteSeleccionada.requisitos.map((req, index) => (
                    <span key={index} className="tag">{req}</span>
                  ))}
                </div>
              </div>

              {/* SECCIÓN INVENTADA (Reemplazo de Selecciona tu CV) */}
              <div className="custom-selection-box">
                <div className="selection-header">
                  <span className="icon">
                    <FaCalendarAlt />
                  </span>
                  <h4>Selecciona tu jornada de entrevista</h4>
                </div>
                
                <div className="selection-options">
                  <label className="option-item">
                    <input type="radio" name="jornada" defaultChecked />
                    <div className="option-info">
                      <strong>Bloque Mañana</strong>
                      <span>08:00 AM - 12:00 PM</span>
                    </div>
                  </label>

                  <label className="option-item">
                    <input type="radio" name="jornada" />
                    <div className="option-info">
                      <strong>Bloque Tarde</strong>
                      <span>01:00 PM - 05:00 PM</span>
                    </div>
                  </label>
                </div>
              </div>
            </section>

            <footer className="modal-footer">
              <button className="btn-cancel" onClick={() => setVacanteSeleccionada(null)}>Cancelar</button>
              <button className="btn-confirm">Confirmar Postulación</button>
            </footer>
          </div>
        </div>
      )}
    </section>
  );
};

export default VacantesDestacadas;