import React, { useState, useEffect } from 'react';
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
} from '../../Services/notificationService';
import './NotificationPanel.css';

// Relative time helper
function timeAgo(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Ahora';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `Hace ${Math.floor(diff / 86400)}d`;
    return date.toLocaleDateString('es-CR', { day: 'numeric', month: 'short' });
}

// Icon based on event type
function eventIcon(tipoEvento) {
    const name = (tipoEvento || '').toLowerCase();
    if (name.includes('postulacion')) return '📋';
    if (name.includes('estado') || name.includes('cambio')) return '🔄';
    if (name.includes('mensaje') || name.includes('empresa')) return '💬';
    if (name.includes('vacante')) return '🧳';
    return '🔔';
}

export default function NotificationPanel({ onClose }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all' | 'unread'

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getNotifications(filter === 'unread');
            setNotifications(data?.results ?? data ?? []);
        } catch {
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filter]);

    const handleMarkRead = async (id) => {
        try {
            await markAsRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, leido: true } : n))
            );
        } catch { /* ignore */ }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, leido: true })));
        } catch { /* ignore */ }
    };

    const handleDelete = async (id) => {
        try {
            await deleteNotification(id);
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        } catch { /* ignore */ }
    };

    const unreadTotal = notifications.filter((n) => !n.leido).length;

    return (
        <div className="notif-panel" id="notification-panel">
            {/* Header */}
            <div className="notif-panel-header">
                <div className="notif-panel-title-row">
                    <h3 className="notif-panel-title">Notificaciones</h3>
                    {unreadTotal > 0 && (
                        <span className="notif-panel-count">{unreadTotal}</span>
                    )}
                </div>
                <div className="notif-panel-actions">
                    {unreadTotal > 0 && (
                        <button
                            type="button"
                            className="notif-panel-link"
                            onClick={handleMarkAllRead}
                        >
                            Marcar todas leídas
                        </button>
                    )}
                </div>
            </div>

            {/* Filter tabs */}
            <div className="notif-panel-tabs">
                <button
                    type="button"
                    className={`notif-tab ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    Todas
                </button>
                <button
                    type="button"
                    className={`notif-tab ${filter === 'unread' ? 'active' : ''}`}
                    onClick={() => setFilter('unread')}
                >
                    Sin leer
                </button>
            </div>

            {/* Notification list */}
            <div className="notif-panel-list">
                {loading && (
                    <div className="notif-panel-empty">
                        <div className="notif-spinner" />
                        <span>Cargando...</span>
                    </div>
                )}

                {!loading && notifications.length === 0 && (
                    <div className="notif-panel-empty">
                        <span className="notif-empty-icon">🔔</span>
                        <span>No hay notificaciones</span>
                    </div>
                )}

                {!loading &&
                    notifications.map((n) => (
                        <div
                            key={n.id}
                            className={`notif-item ${!n.leido ? 'unread' : ''}`}
                            onClick={() => !n.leido && handleMarkRead(n.id)}
                        >
                            <div className="notif-item-icon">
                                {eventIcon(n.tipo_evento_nombre)}
                            </div>

                            <div className="notif-item-body">
                                <div className="notif-item-title">{n.titulo || 'Notificación'}</div>
                                <div className="notif-item-msg">
                                    {n.mensaje?.length > 100
                                        ? n.mensaje.slice(0, 100) + '…'
                                        : n.mensaje}
                                </div>
                                <div className="notif-item-time">{timeAgo(n.fecha_creacion)}</div>
                            </div>

                            <button
                                type="button"
                                className="notif-item-delete"
                                title="Eliminar"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(n.id);
                                }}
                            >
                                ×
                            </button>

                            {!n.leido && <span className="notif-item-dot" />}
                        </div>
                    ))}
            </div>

            {/* Footer */}
            <div className="notif-panel-footer">
                <a
                    href="/notificaciones/preferencias"
                    className="notif-panel-link"
                    onClick={(e) => {
                        e.preventDefault();
                        onClose();
                        window.location.href = '/notificaciones/preferencias';
                    }}
                >
                    ⚙️ Configurar notificaciones
                </a>
            </div>
        </div>
    );
}
