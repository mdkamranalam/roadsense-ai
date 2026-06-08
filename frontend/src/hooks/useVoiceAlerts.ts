import React, { useEffect } from 'react';

export const useVoiceAlerts = (alerts: any[]) => {
  useEffect(() => {
    if (!alerts || alerts.length === 0) return;

    // We only announce the most critical alert to avoid noise
    const criticalAlert = alerts.find(a => a.priority === 'critical') ||
                          alerts.find(a => a.priority === 'high') ||
                          alerts[0];

    if (criticalAlert) {
      const utterance = new SpeechSynthesisUtterance(criticalAlert.message);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Use a distinct voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.includes('en-US') || v.lang.includes('en-GB'));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      window.speechSynthesis.speak(utterance);
    }
  }, [alerts]);
};

export default useVoiceAlerts;
