/**
 * Browser Notifications API Utility
 * Handles permission gating and sending push-style desktop/mobile browser notifications
 */

export const isBrowserNotificationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

export const getBrowserNotificationPermission = (): NotificationPermission => {
  if (!isBrowserNotificationSupported()) return 'denied';
  return Notification.permission;
};

export const requestBrowserNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isBrowserNotificationSupported()) {
    console.warn('Browser notifications are not supported on this platform/browser.');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return 'denied';
  }
};

export const sendBrowserNotification = (
  title: string, 
  options?: NotificationOptions & { onClick?: () => void }
): Notification | null => {
  if (!isBrowserNotificationSupported()) return null;
  if (Notification.permission !== 'granted') return null;

  try {
    const notification = new Notification(title, {
      icon: options?.icon,
      dir: 'rtl',
      lang: 'ar',
      ...options
    });

    notification.onclick = () => {
      window.focus();
      if (options?.onClick) {
        options.onClick();
      }
      notification.close();
    };

    return notification;
  } catch (err) {
    console.error('Error sending browser notification:', err);
    return null;
  }
};

/**
 * Specifically send a notification when a new message is received
 */
export const sendNewMessageNotification = (
  senderName: string, 
  messageText: string, 
  avatar?: string,
  onOpenChat?: () => void
) => {
  return sendBrowserNotification(`رسالة جديدة من ${senderName} 💬`, {
    body: messageText || 'أرسل لك رسالة جديدة في المحادثات المشفرة.',
    icon: avatar,
    tag: `msg-${Date.now()}`,
    onClick: onOpenChat
  });
};

/**
 * Specifically send a notification when a new follow request is received
 */
export const sendFollowRequestNotification = (
  requesterName: string, 
  requesterHandle?: string,
  avatar?: string,
  onOpenProfile?: () => void
) => {
  return sendBrowserNotification(`طلب متابعة جديد 👤`, {
    body: `يرغب ${requesterName} ${requesterHandle ? `(${requesterHandle})` : ''} بمتابعة حسابك على نكسوس.`,
    icon: avatar,
    tag: `follow-req-${Date.now()}`,
    onClick: onOpenProfile
  });
};
