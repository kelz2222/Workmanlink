export function initPushNotifications() {
  if (typeof window === 'undefined') return;
  window.OneSignalDeferred = window.OneSignalDeferred || [];
  window.OneSignalDeferred.push(async (OneSignal) => {
    await OneSignal.init({
      appId: '4b76d76d-38cf-46bc-8742-6084b7098053',
      notifyButton: {
        enable: true,
      },
    });
  });
}
