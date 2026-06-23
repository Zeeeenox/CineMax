import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Notification } from '../../types';
import { useNotifications } from '../../context/NotificationContext';

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: 'border-success-500/50 bg-success-500/10',
  error: 'border-error-500/50 bg-error-500/10',
  warning: 'border-warning-500/50 bg-warning-500/10',
  info: 'border-primary-500/50 bg-primary-500/10',
};

const iconColors = {
  success: 'text-success-400',
  error: 'text-error-400',
  warning: 'text-warning-400',
  info: 'text-primary-400',
};

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function NotificationItem({
  notification,
  onClose,
}: {
  notification: Notification;
  onClose: () => void;
}) {
  const Icon = icons[notification.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      className={`pointer-events-auto glass rounded-xl border ${colors[notification.type]} p-4 shadow-xl`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-6 h-6 ${iconColors[notification.type]} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-secondary-100">{notification.title}</p>
          <p className="text-sm text-secondary-400 mt-1">{notification.message}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-secondary-400 hover:text-secondary-100 hover:bg-secondary-800 transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
