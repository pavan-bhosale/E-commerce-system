import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCheck, X, Package, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { Button } from './Button';

interface NotificationPanelProps {
  onSelectOrder?: (orderId: string) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ onSelectOrder }) => {
  const {
    notifications,
    notificationPanelOpen,
    setNotificationPanelOpen,
    markNotificationRead,
    markAllNotificationsRead,
    unreadNotificationCount
  } = useApp();

  if (!notificationPanelOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'production':
        return <ShieldCheck className="w-4 h-4 text-amber-600" />;
      case 'dispatch':
        return <Truck className="w-4 h-4 text-emerald-600" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationRead(notif.id);
    if (notif.orderId && onSelectOrder) {
      setNotificationPanelOpen(false);
      onSelectOrder(notif.orderId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xs transition-opacity"
        onClick={() => setNotificationPanelOpen(false)}
      />

      {/* Flyout panel on right */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm sm:max-w-md bg-white shadow-2xl border-l border-slate-100 flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">Notifications</h3>
                <p className="text-xs text-slate-500">
                  {unreadNotificationCount} unread update{unreadNotificationCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {unreadNotificationCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-50 flex items-center gap-1 transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Mark all read</span>
                </button>
              )}
              <button
                onClick={() => setNotificationPanelOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
            {notifications.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-sm">
                No notifications right now
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3.5 rounded-xl cursor-pointer transition-all duration-150 flex gap-3 ${
                    !n.read ? 'bg-blue-50/40 hover:bg-blue-50/70' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-white shadow-2xs border border-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className={`text-xs font-semibold ${!n.read ? 'text-slate-900' : 'text-slate-700'}`}>
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 flex-shrink-0">{n.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                    {n.orderId && (
                      <span className="inline-block mt-1.5 text-[11px] font-medium text-blue-600 hover:underline">
                        View Order Details →
                      </span>
                    )}
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs text-slate-500">
            <span>Real-time B2B order & dispatch logs</span>
            <Button variant="ghost" size="xs" onClick={() => setNotificationPanelOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
