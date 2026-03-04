import React, { useState, useEffect, useRef, useCallback } from 'react';
import NotificationPanel from './NotificationPanel';
import { getUnreadCount } from '../../Services/notificationService';
import './NotificationBell.css';

const POLL_INTERVAL = 30_000; // 30 seconds

export default function NotificationBell() {
    const [count, setCount] = useState(0);
    const [panelOpen, setPanelOpen] = useState(false);
    const wrapperRef = useRef(null);

    const fetchCount = useCallback(async () => {
        try {
            const data = await getUnreadCount();
            setCount(data?.unread_count ?? 0);
        } catch {
            // silently fail if not authenticated
        }
    }, []);

    // Poll for unread count
    useEffect(() => {
        fetchCount();
        const timer = setInterval(fetchCount, POLL_INTERVAL);
        return () => clearInterval(timer);
    }, [fetchCount]);

    // Close panel on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setPanelOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleToggle = () => setPanelOpen((prev) => !prev);

    const handlePanelClose = () => {
        setPanelOpen(false);
        fetchCount(); // refresh count after marking read
    };

    return (
        <div className="notif-bell-wrapper" ref={wrapperRef}>
            <button
                type="button"
                className="notif-bell-btn"
                onClick={handleToggle}
                aria-label="Notificaciones"
                id="notification-bell"
            >
                <svg
                    className="notif-bell-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {count > 0 && (
                    <span className="notif-bell-badge">
                        {count > 99 ? '99+' : count}
                    </span>
                )}
            </button>

            {panelOpen && <NotificationPanel onClose={handlePanelClose} />}
        </div>
    );
}
