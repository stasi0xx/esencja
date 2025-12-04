import React from 'react';
import { useServices } from '../hooks/useServices.ts';
import { Briefcase, Rocket, Search, Sparkles, HelpCircle, Paintbrush, Globe, Megaphone, Printer, Camera, PartyPopper} from 'lucide-react';
import AnimatedDots from "../components/AnimatedDots.tsx";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Briefcase,
    Rocket,
    Search,
    Sparkles,
    Paintbrush,
    Globe,
    Megaphone,
    Printer,
    Camera,
    PartyPopper
};

const resolveIcon = (iconName: string | null) => {
    if (!iconName) return HelpCircle;
    return iconMap[iconName] ?? HelpCircle;
};


const ServicesPage: React.FC = () => {
    const { services, loading, error } = useServices();

    return (
        <div className="relative">
            <AnimatedDots />
            <div className="container mx-auto px-6 py-16 relative z-10">
                <h1 className="text-4xl md:text-5xl font-black mb-8 text-center dark:text-white">
                    CO robimy
                </h1>

                {loading && (
                    <p className="text-center text-gray-500 dark:text-neutral-400">
                        Ładowanie usług...
                    </p>
                )}

                {error && (
                    <p className="text-center text-red-500 text-sm mb-6">{error}</p>
                )}

                {!loading && !error && services.length === 0 && (
                    <p className="text-center text-gray-500 dark:text-neutral-400">
                        Brak zdefiniowanych usług. Dodaj je w panelu administratora.
                    </p>
                )}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    {services.map((service) => {
                        const Icon = resolveIcon(service.icon);
                        return (
                            <div
                                key={service.id}
                                className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-200"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-gray-900 dark:text-white" />
                                    </div>
                                    <h2 className="text-lg font-semibold dark:text-white">
                                        {service.title}
                                    </h2>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-neutral-400 leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;