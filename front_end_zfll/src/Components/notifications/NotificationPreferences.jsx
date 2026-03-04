import React, { useState, useEffect } from 'react';
import {
    getPreferences,
    updatePreference,
    initPreferences,
    getTiposEvento,
    getMediosNotificacion,
} from '../../Services/notificationService';
import './NotificationPreferences.css';

export default function NotificationPreferences() {
    const [preferences, setPreferences] = useState([]);
    const [tiposEvento, setTiposEvento] = useState([]);
    const [medios, setMedios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(null); // id being saved
    const [message, setMessage] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [prefData, tiposData, mediosData] = await Promise.all([
                getPreferences(),
                getTiposEvento(),
                getMediosNotificacion(),
            ]);

            const prefs = prefData?.results ?? prefData ?? [];
            const tipos = tiposData?.results ?? tiposData ?? [];
            const meds = mediosData?.results ?? mediosData ?? [];

            setTiposEvento(tipos);
            setMedios(meds);

            // If no preferences exist, initialize them
            if (prefs.length === 0 && tipos.length > 0 && meds.length > 0) {
                await initPreferences();
                const newPrefs = await getPreferences();
                setPreferences(newPrefs?.results ?? newPrefs ?? []);
            } else {
                setPreferences(prefs);
            }
        } catch (err) {
            console.error('Error loading preferences:', err);
            setMessage({ type: 'error', text: 'Error al cargar preferencias.' });
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (pref) => {
        setSaving(pref.id);
        try {
            await updatePreference(pref.id, { habilitado: !pref.habilitado });
            setPreferences((prev) =>
                prev.map((p) =>
                    p.id === pref.id ? { ...p, habilitado: !p.habilitado } : p
                )
            );
            setMessage({ type: 'success', text: 'Preferencia actualizada.' });
        } catch {
            setMessage({ type: 'error', text: 'Error al actualizar.' });
        } finally {
            setSaving(null);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    // Get preference for a specific tipo + medio combination
    const getPref = (tipoId, medioId) =>
        preferences.find((p) => p.tipo_evento === tipoId && p.medio === medioId);

    // Friendly name mapping
    const eventLabel = (nombre) => {
        const map = {
            postulacion_enviada: 'Postulación enviada',
            nueva_postulacion: 'Nueva postulación recibida',
            cambio_estado_postulacion: 'Cambio de estado',
            mensaje_empresa: 'Mensaje de empresa',
            nueva_vacante: 'Nueva vacante publicada',
        };
        return map[nombre] || nombre;
    };

    const medioIcon = (nombre) => {
        const n = (nombre || '').toLowerCase();
        if (n.includes('correo') || n.includes('email')) return '📧';
        if (n.includes('celular') || n.includes('sms') || n.includes('telefono')) return '📱';
        return '🔔';
    };

    if (loading) {
        return (
            <div className="notif-prefs-loading">
                <div className="notif-prefs-spinner" />
                <span>Cargando preferencias...</span>
            </div>
        );
    }

    return (
        <div className="notif-prefs" id="notification-preferences">
            <div className="notif-prefs-card">
                {/* Header */}
                <div className="notif-prefs-header">
                    <div>
                        <h2 className="notif-prefs-title">Configuración de Notificaciones</h2>
                        <p className="notif-prefs-subtitle">
                            Selecciona qué notificaciones deseas recibir y por cuál medio.
                        </p>
                    </div>
                </div>

                {/* Toast */}
                {message && (
                    <div className={`notif-prefs-toast ${message.type}`}>
                        {message.type === 'success' ? '✅' : '❌'} {message.text}
                    </div>
                )}

                {/* Table */}
                {tiposEvento.length === 0 || medios.length === 0 ? (
                    <div className="notif-prefs-empty">
                        <span>⚙️</span>
                        <p>No se encontraron tipos de evento o medios de notificación configurados.</p>
                    </div>
                ) : (
                    <div className="notif-prefs-table-wrap">
                        <table className="notif-prefs-table">
                            <thead>
                                <tr>
                                    <th className="notif-prefs-th-event">Tipo de Evento</th>
                                    {medios.map((m) => (
                                        <th key={m.id} className="notif-prefs-th-medio">
                                            <span className="notif-prefs-medio-icon">{medioIcon(m.nombre)}</span>
                                            <span>{m.nombre}</span>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tiposEvento.map((tipo) => (
                                    <tr key={tipo.id} className="notif-prefs-row">
                                        <td className="notif-prefs-event-cell">
                                            {eventLabel(tipo.nombre)}
                                        </td>
                                        {medios.map((medio) => {
                                            const pref = getPref(tipo.id, medio.id);
                                            if (!pref) {
                                                return (
                                                    <td key={medio.id} className="notif-prefs-toggle-cell">
                                                        <span className="notif-prefs-na">—</span>
                                                    </td>
                                                );
                                            }
                                            return (
                                                <td key={medio.id} className="notif-prefs-toggle-cell">
                                                    <label className="notif-toggle">
                                                        <input
                                                            type="checkbox"
                                                            checked={pref.habilitado}
                                                            onChange={() => handleToggle(pref)}
                                                            disabled={saving === pref.id}
                                                        />
                                                        <span className="notif-toggle-slider" />
                                                    </label>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Info */}
                <div className="notif-prefs-info">
                    <span>ℹ️</span>
                    <span>
                        Las notificaciones dentro de la plataforma siempre estarán activas.
                        Aquí configuras los envíos externos (correo o celular).
                    </span>
                </div>
            </div>
        </div>
    );
}
