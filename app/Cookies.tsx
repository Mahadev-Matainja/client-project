"use client";

import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) setVisible(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setVisible(false);

    // Example: load analytics after consent
    // window.gtag('consent', 'update', { analytics_storage: 'granted' });
  };

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "false");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 bg-gray-900 text-white p-4 rounded-2xl shadow-lg z-50 max-w-sm">
      <p className="text-sm mb-3">
        We use cookies to improve your experience. By clicking “Accept”, you
        agree to our use of cookies.
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={declineCookies}
          className="bg-gray-700 hover:bg-gray-600 text-sm px-3 py-1.5 rounded-lg"
        >
          Decline
        </button>
        <button
          onClick={acceptCookies}
          className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm px-3 py-1.5 rounded-lg font-semibold"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
