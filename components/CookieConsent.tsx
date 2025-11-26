import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const COOKIE_STORAGE_KEY = "cookie-consent";

const CookieConsent: React.FC = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        try {
            const stored = window.localStorage.getItem(COOKIE_STORAGE_KEY);
            if (stored !== "accepted") {
                setVisible(true);
            }
        } catch {
            // w razie problemu z localStorage po prostu pokaż baner
            setVisible(true);
        }
    }, []);

    const handleAccept = () => {
        try {
            window.localStorage.setItem(COOKIE_STORAGE_KEY, "accepted");
        } catch {
            // ignorujemy błąd
        }
        setVisible(false);
    };

    const handleClose = () => {
        // zamknięcie bez zapisu zgody – przy kolejnym wejściu znów się pokaże
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl">
            <div className="relative rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur
                      dark:border-neutral-800 dark:bg-neutral-900/95">
                {/* Close button */}
                <button
                    type="button"
                    onClick={handleClose}
                    className="absolute right-3 top-3 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600
                     dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                    aria-label="Zamknij powiadomienie o cookies"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="flex flex-col gap-3 pr-6 md:flex-row md:items-center md:gap-6">
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Ta strona używa plików cookies
                        </h3>
                        <p className="mt-1 text-xs md:text-sm text-gray-600 dark:text-neutral-300">
                            Wykorzystujemy pliki cookies w celu poprawy działania serwisu, analizy ruchu
                            oraz dopasowania treści. Możesz zmienić ustawienia cookies w swojej przeglądarce.
                        </p>
                    </div>

                    <div className="flex flex-shrink-0 gap-2">
                        <button
                            type="button"
                            onClick={handleAccept}
                            className="inline-flex items-center justify-center rounded-full bg-gray-900 px-4 py-2 text-xs font-medium text-white
                         hover:bg-gray-800 transition-colors
                         dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
                        >
                            Akceptuję
                        </button>
                        {/* opcjonalny przycisk "Więcej informacji" */}
                        {/* <a
              href="/polityka-prywatnosci"
              className="inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700
                         hover:bg-gray-50 transition-colors
                         dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              Więcej informacji
            </a> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;