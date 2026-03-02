import React, { useState } from "react";
import Modal from "../modal/Modal";
import "./Vacantes.css";

function Vacantes() {

    const [vacantes, setVacantes] = useState([
        {
            id: 1,
            titulo_puesto: "Ingeniero de Software Senior",
            descripcion: "Desarrollo de aplicaciones empresariales",
            requisitos: ["React", "Node.js"],
            activa: true,
        },
        {
            id: 2,
            titulo_puesto: "Soporte Técnico",
            descripcion: "Atención a usuarios",
            requisitos: ["Servicio al cliente"],
            activa: false,
        },
    ]);

    const [search, setSearch] = useState("");
    const [editing, setEditing] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [form, setForm] = useState({
        titulo_puesto: "",
        tipo_contrato: "",
        area: "",
        modalidad: "",
        descripcion: "",
        requisitos: "",
        metodo_aplicacion: "plataforma",
    });

    /* ================== HELPERS ================== */

    const resetForm = () => {
        setForm({
            titulo_puesto: "",
            tipo_contrato: "",
            area: "",
            modalidad: "",
            descripcion: "",
            requisitos: "",
            metodo_aplicacion: "plataforma",
        });
        setEditing(null);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    /* ================== CRUD ================== */

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            requisitos: form.requisitos.split("\n"),
        };

        if (editing) {
            setVacantes(vacantes.map(v =>
                v.id === editing.id ? { ...v, ...payload } : v
            ));
        } else {
            setVacantes([
                ...vacantes,
                { id: Date.now(), ...payload, activa: true }
            ]);
        }

        resetForm();
        setShowModal(false);
    };

    const handleEdit = (vacante) => {
        setEditing(vacante);
        setForm({
            titulo_puesto: vacante.titulo_puesto,
            tipo_contrato: vacante.tipo_contrato || "",
            area: vacante.area || "",
            modalidad: vacante.modalidad || "",
            descripcion: vacante.descripcion,
            requisitos: vacante.requisitos.join("\n"),
            metodo_aplicacion: vacante.metodo_aplicacion || "plataforma",
        });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        setVacantes(vacantes.filter(v => v.id !== id));
    };

    const confirmDelete = () => {
        if (window.confirm("¿Seguro que deseas eliminar esta vacante?")) {
            handleDelete(editing.id);
            setShowModal(false);
            resetForm();
        }
    };

    const handleToggle = (id) => {
        setVacantes(vacantes.map(v =>
            v.id === id ? { ...v, activa: !v.activa } : v
        ));
    };

    /* ================== FILTER ================== */

    const filteredVacantes = vacantes.filter(v =>
        v.titulo_puesto.toLowerCase().includes(search.toLowerCase())
    );

    /* ================== RENDER ================== */

    return (
        <div className="vacantes-container">

            {/* HEADER */}
            <div className="vacantes-header">
                <div>
                    <h2>Gestión de Vacantes</h2>
                    <p>Administra tus ofertas laborales</p>
                </div>

                <button
                    className="btn-primary"
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                >
                    + Nueva Vacante
                </button>
            </div>

            {/* BUSCADOR */}
            <div className="search-box">
                <input
                    placeholder="Buscar vacante..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* LISTA DE VACANTES */}
            <div className="vacantes-list">
                {filteredVacantes.map(v => (
                    <div key={v.id} className="vacante-card">

                        <div className="vacante-info">
                            <h3>{v.titulo_puesto}</h3>
                            <p>{v.descripcion}</p>

                            <span className={v.activa ? "badge activa" : "badge pausada"}>
                                {v.activa ? "ACTIVA" : "PAUSADA"}
                            </span>
                        </div>

                        <div className="vacante-actions">
                            <button
                                onClick={() => handleToggle(v.id)}
                                title={v.activa ? "Pausar vacante" : "Activar vacante"}
                            >
                                {v.activa ? "👁️" : "🚫"}
                            </button>

                            <button
                                onClick={() => handleEdit(v)}
                                title="Editar vacante"
                            >
                                ⚙️
                            </button>
                        </div>

                    </div>
                ))}
            </div>

            {/* MODAL */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editing ? "Editar Vacante" : "Nueva Vacante"}
            >
                <form onSubmit={handleSubmit} className="modal-form">

                    <h4>1️⃣ Información General</h4>

                    {/* Contenedor Grid para las 2 columnas */}
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Título del Puesto *</label>
                            <input
                                name="titulo_puesto"
                                placeholder="Ej: Ingeniero de Calidad"
                                value={form.titulo_puesto}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Tipo de Contrato *</label>
                            <select name="tipo_contrato" value={form.tipo_contrato} onChange={handleChange} required>
                                <option value="">Seleccionar</option>
                                <option value="Tiempo Completo">Tiempo Completo</option>
                                <option value="Medio Tiempo">Medio Tiempo</option>
                                <option value="Contrato">Contrato</option>
                                <option value="Prácticas">Prácticas</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Área / Departamento</label>
                            <input
                                name="area"
                                placeholder="Ej: Manufactura"
                                value={form.area}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Modalidad</label>
                            <select name="modalidad" value={form.modalidad} onChange={handleChange}>
                                <option value="">Seleccionar</option>
                                <option value="Presencial">Presencial</option>
                                <option value="Remoto">Remoto</option>
                                <option value="Híbrido">Híbrido</option>
                            </select>
                        </div>
                    </div>

                    <h4>2️⃣ Detalles y Requisitos</h4>

                    <div className="form-group">
                        <label>Descripción *</label>
                        <textarea
                            name="descripcion"
                            placeholder="Describe las responsabilidades..."
                            value={form.descripcion}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Requisitos (uno por línea)</label>
                        <textarea
                            name="requisitos"
                            placeholder="Ej: Inglés B2&#10;Manejo de SAP"
                            value={form.requisitos}
                            onChange={handleChange}
                        />
                    </div>

                    <h4>3️⃣ Configuración</h4>

                    <div className="radio-card-group">
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="metodo_aplicacion"
                                value="plataforma"
                                checked={form.metodo_aplicacion === "plataforma"}
                                onChange={handleChange}
                            />
                            <div className="radio-text">
                                <span className="radio-title">Recibir aplicaciones en la plataforma</span>
                            </div>
                        </label>

                        <label className="radio-option">
                            <input
                                type="radio"
                                name="metodo_aplicacion"
                                value="externo"
                                checked={form.metodo_aplicacion === "externo"}
                                onChange={handleChange}
                            />
                            <div className="radio-text">
                                <span className="radio-title">Redireccionar a portal externo</span>
                            </div>
                        </label>
                    </div>

                    <button type="submit" className="btn-submit-modal">
                        {editing ? "Actualizar Vacante" : "Publicar Vacante"}
                    </button>

                    {editing && (
                        <button
                            type="button"
                            className="btn-danger"
                            onClick={confirmDelete}
                            style={{ marginTop: '10px' }}
                        >
                            🗑️ Eliminar Vacante
                        </button>
                    )}
                </form>
            </Modal>

        </div>
    );
}

export default Vacantes;