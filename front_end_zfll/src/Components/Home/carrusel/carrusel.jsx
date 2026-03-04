import React from "react";
import "./carrusel.css";

// ── Importa aquí cada logo que tengas en la carpeta ──────────
import BSC        from "../ImagenesEmpresas/BSC_Logo_azulgris.png";
import TBCT      from "../ImagenesEmpresas/TBCT.png";
import HeraeusMedevio from "../ImagenesEmpresas/Heraeus-Medevio.png";
import edwards          from "../ImagenesEmpresas/Edwards.png";
import lutron           from "../ImagenesEmpresas/lutron.png";
import Matthews           from "../ImagenesEmpresas/Matthews-Brand-Solutions.png";
import Nextern            from "../ImagenesEmpresas/Nextern.png";

const Carrusel = ({ items }) => {
  const defaultItems = [
    { name: "BSC",                  logo: BSC        },
    { name: "TBCT",                 logo: TBCT       },
    { name: "Heraeus Medevio",      logo: HeraeusMedevio },
    { name: "Edwards Lifesciences", logo: edwards          },
    { name: "lutron",               logo: lutron           },
    { name: "Matthews Brand Solutions", logo: Matthews },
    { name: "Nextern",                logo: Nextern            },
    { name: "BSC",                  logo: BSC        },
    { name: "TBCT",                 logo: TBCT       },
    { name: "Heraeus Medevio",      logo: HeraeusMedevio },
    { name: "Edwards Lifesciences", logo: edwards          },
    { name: "lutron",               logo: lutron           },
    { name: "Matthews Brand Solutions", logo: Matthews },
    { name: "Nextern",                logo: Nextern            },
  ];

  const list = (items && items.length) ? items : defaultItems;
  const duplicatedList = [...list, ...list];

  return (
    <div className="carrusel" aria-label="Empresas que confían">
      <div className="texto" role="marquee" aria-hidden="false">
        
        {duplicatedList.map((item, i) => (
          <span key={i} className="empresa">
            <img
              src={item.logo}
              alt={item.name}
              className="empresa-logo"
            />
          </span>
        ))}
      </div>
    </div>
  );
};

export default Carrusel;