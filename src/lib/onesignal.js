export function initPushNotifications() {
  if (typeof window === 'undefined') return;
  window.OneSignalDeferred = window.OneSignalDeferred || [];
  window.OneSignalDeferred.push(async (OneSignal) => {
    await OneSignal.init({
      appId: '4b76d76d-38cf-46bc-8742-6084b7098053',
      allowLocalhostAsSecureOrigin: true,
    });

    // Explicitly show the permission prompt after a short delay,
    // rather than waiting for it to trigger automatically
    setTimeout(() => {
      OneSignal.Slidedown.promptPush();
    }, 2000);
  });
}
