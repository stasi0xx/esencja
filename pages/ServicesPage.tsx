import React from 'react';
import { Paintbrush, Globe, Megaphone, Printer, Search, Camera, PartyPopper } from 'lucide-react';
import Button from "../components/Button.tsx";


type Service = {
    title: string;
    description: string;
    icon: React.ReactNode;
};

const services: Service[] = [
    {
        title: 'Grafika, która działa ',
        description: 'Projekty do druku, internetu i reklamy zewnętrznej.',
        icon: <Paintbrush className="h-6 w-6" />,
    },
    {
        title: 'Strony i sklepy ',
        description: 'Nowoczesne, funkcjonalne, przyjazne użytkownikom.',
        icon: <Globe className="h-6 w-6" />,
    },
    {
        title: 'Kreacja i strategia ',
        description: 'Kampanie marketingowe i social media, które przyciągają uwagę.',
        icon: <Megaphone className="h-6 w-6" />,
    },
    {
        title: 'Druk i branding ',
        description: ' Materiały reklamowe, oznakowanie pojazdów i obiektów.',
        icon: <Printer className="h-6 w-6" />,
    },
    {
        title: 'Kampanie Google Ads',
        description: 'Docieramy precyzyjnie do Twoich klientów.',
        icon: <Search className="h-6 w-6" />,
    },
    {
        title: 'Fotografia, która sprzedaje ',
        description: 'Profesjonalne sesje dla Twojej marki.',
        icon: <Camera className="h-6 w-6" />,
    },
    {
        title: 'Eventy z efektem ',
        description: 'Imprezy firmowe i wydarzenia sportowe z pełnym wsparciem',
        icon: <PartyPopper className="h-6 w-6" />,
    },
];

const ServicesPage: React.FC = () => {
    return (
        <main className="container mx-auto px-6 py-16">
            <header className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Co robimy?</h1>
                <p className="mt-4 text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto">
                    Działamy kompleksowo, z pomysłem i konsekwencją, aby każda inicjatywa przynosiła realny efekt dla Twojej marki.
                </p>
            </header>

            <section aria-label="Lista usług">
                <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((s, idx) => (
                        <li
                            key={idx}
                            className="group rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-gray-100 dark:bg-neutral-900 text-gray-900 dark:text-white">
                                    {s.icon}
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{s.title}</h2>
                            </div>
                            <p className="text-gray-600 dark:text-neutral-400">{s.description}</p>
                        </li>
                    ))}
                </ul>
            </section>
            <div className="mt-12 flex justify-center">
                <Button to="/kontakt" text="Porozmawiajmy o Twoim projekcie" />
            </div>

        </main>
    );
};

export default ServicesPage;