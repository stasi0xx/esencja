import React from 'react';
import { Paintbrush, Globe, Megaphone, Printer, Search, Camera, PartyPopper } from 'lucide-react';

type Service = {
    title: string;
    description: string;
    icon: React.ReactNode;
};

const services: Service[] = [
    {
        title: 'Projekty graficzne',
        description: 'Projekty graficzne na potrzeby druku, internetu czy reklamy zewnętrznej.',
        icon: <Paintbrush className="h-6 w-6" />,
    },
    {
        title: 'Tworzenie stron www i serwisów',
        description: 'Strony www, serwisy internetowe oraz sklepy online.',
        icon: <Globe className="h-6 w-6" />,
    },
    {
        title: 'Koncepcje i strategie',
        description: 'Koncepcje kreatywne, strategie marketingowe, działania w social media.',
        icon: <Megaphone className="h-6 w-6" />,
    },
    {
        title: 'Druk i oznakowanie',
        description: 'Druk materiałów reklamowych, oznakowanie pojazdów i obiektów.',
        icon: <Printer className="h-6 w-6" />,
    },
    {
        title: 'Kampanie Google Ads',
        description: 'Kampanie AdWords w wyszukiwarce Google.',
        icon: <Search className="h-6 w-6" />,
    },
    {
        title: 'Sesje fotograficzne',
        description: 'Sesje fotograficzne – produktowe i wizerunkowe.',
        icon: <Camera className="h-6 w-6" />,
    },
    {
        title: 'Organizacja wydarzeń',
        description: 'Organizacja imprez firmowych i wydarzeń sportowych.',
        icon: <PartyPopper className="h-6 w-6" />,
    },
];

const ServicesPage: React.FC = () => {
    return (
        <main className="container mx-auto px-6 py-16">
            <header className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Usługi</h1>
                <p className="mt-4 text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto">
                    Sprawdź, w czym możemy pomóc Twojej marce – od projektów graficznych, przez www, po kampanie i eventy.
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
        </main>
    );
};

export default ServicesPage;