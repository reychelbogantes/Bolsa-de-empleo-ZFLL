import { useEffect } from "react";
import { useNavigate  } from 'react-router-dom';
import Carrusel from "../../Components/Home/carrusel/carrusel";
import VacantesDestacadas from "../../Components/Home/vacantes/VacantesDestacadas";
import './Homepage.css';


function Homepage() {
  // Favicon y título dinámicos
  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']");
    if (link) link.href = "/logo.png";
    document.title = "ZFLL - Bolsa de Empleo Zona Franca la Lima";
  }, []);
  const navigate = useNavigate();

  return (
    <>
      <section className="home">
        <div className="home-content">
          <h1 className="home-title">Tu futuro profesional comienza aquí.</h1>
          <p className="home-subtitle">
            Conectamos el talento con las mejores empresas de dispositivos médicos
            y servicios globales en Cartago. Únete a la comunidad líder en innovación.
          </p>
          <div className="home-buttons">
            <button
              className="btn primary"
              onClick={() => navigate('/login', { state: { mode: 'register' } })}
            >
              Crear mi Perfil
            </button>
            <button
              className="btn secondary"
              onClick={() => navigate('/login', { state: { mode: 'login' } })}
            >
              Iniciar Sesión
            </button>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="https://th.bing.com/th/id/R.5f9b825c24c784020456e78eaf5d5351?rik=QZ7J1jULOzZsrw&riu=http%3a%2f%2fpromallascr.com%2fwp-content%2fuploads%2f2019%2f03%2fLa-lima-6.jpg&ehk=WnswRXGylOf37xhATkSTgSsr3%2bg2g5PboUlSCQqW48E%3d&risl=&pid=ImgRaw&r=0"
            alt="Estadio lleno de gente"
          />
          <div className="vacantes-label">
            <span className="icon">💼</span>
            <span>+500 Vacantes Activas</span>
          </div>
        </div>
      </section>
       <h2 className="empresas-confian">Empresas que confían en nosotros</h2>
      <Carrusel />
      <VacantesDestacadas />
    </>
  );
}

export default Homepage;