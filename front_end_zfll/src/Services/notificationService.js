// ============================================================
// notificationService.js
// API service for notifications and preferences
// ============================================================

import api from './apiClient';


const NOTIF_BASE = '/notifications';
const CATALOG_BASE = "/catalogs"; // (esto también faltaba)
// ─── Notifications (inbox) ───────────────────

export async function getNotifications(unread = false) {
  const params = unread ? { unread: "true" } : {};
  const res = await api.get(`${NOTIF_BASE}/`, { params });
  return res.data;
}

export async function getUnreadCount() {
  const res = await api.get(`${NOTIF_BASE}/count/`);
  return res.data;
}

export async function markAsRead(id) {
    return api.patch(`${NOTIF_BASE}/${id}/read/`);
}

export async function markAllAsRead() {
    return api.patch(`${NOTIF_BASE}/read-all/`);
}

export async function deleteNotification(id) {
    return api.delete(`${NOTIF_BASE}/${id}/delete/`);
}

// ─── Preferences ─────────────────────────────

export async function getPreferences() {
    return api.get(`${NOTIF_BASE}/preferences/`);
}

export async function updatePreference(id, data) {
    return api.patch(`${NOTIF_BASE}/preferences/${id}/`, data);
}

export async function createPreference(data) {
    return api.post(`${NOTIF_BASE}/preferences/`, data);
}

export async function deletePreference(id) {
    return api.delete(`${NOTIF_BASE}/preferences/${id}/`);
}

export async function initPreferences() {
    return api.post(`${NOTIF_BASE}/preferences/bulk/`);
}

// ─── Company → Candidate ─────────────────────

export async function sendNotification({ usuario_ids, titulo, mensaje, url_accion }) {
    return api.post(`${NOTIF_BASE}/send/`, {
        usuario_ids,
        titulo,
        mensaje,
        url_accion,
    });
}

// ─── Catalogs ────────────────────────────────

export async function getTiposEvento() {
    return api.get(`${CATALOG_BASE}/tipos-evento/`);
}

export async function getMediosNotificacion() {
    return api.get(`${CATALOG_BASE}/medios-notificacion/`);
}
