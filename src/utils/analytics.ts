const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

declare global {
    interface Window {
        dataLayer: unknown[];
        gtag: (...args: any[]) => void;
    }
}

let analyticsLoaded = false;

export function loadGoogleAnalytics() {
    if (!GA_MEASUREMENT_ID || analyticsLoaded) return;

    window.dataLayer = window.dataLayer || [];

    window.gtag = function (...args: any[]) {
        window.dataLayer.push(args);
    };

    const script = document.createElement("script");

    script.id = "google-analytics";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

    document.head.appendChild(script);

    window.gtag("js", new Date());

    window.gtag("config", GA_MEASUREMENT_ID, {
        send_page_view: false,
    });

    analyticsLoaded = true;
}

export function trackPageView(path: string) {
    if (!analyticsLoaded || !window.gtag) return;

    window.gtag("event", "page_view", {
        page_path: path,
        page_location: window.location.href,
        page_title: document.title,
    });
}