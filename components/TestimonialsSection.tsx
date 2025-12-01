import { useTestimonials } from '../hooks/useTestimonials';
import AnimatedElement from './AnimatedElement';

const TestimonialsSection = () => {
    const { testimonials, loading, error } = useTestimonials();

    // Duplicate testimonials for seamless loop
    const extendedTestimonials = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

    if (error) {
        return (
            <section id="opinie" className="py-16 md:py-24 bg-gray-100 dark:bg-neutral-900/50">
                <div className="container mx-auto px-6">
                    <p className="text-center text-red-500">Nie udało się załadować opinii.</p>
                </div>
            </section>
        );
    }

    if (loading || testimonials.length === 0) {
        return (
            <section id="opinie" className="py-16 md:py-24 bg-gray-100 dark:bg-neutral-900/50">
                <div className="container mx-auto px-6">
                    <AnimatedElement className="text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Co Mówią Nasi Klienci</h2>
                        <p className="text-gray-600 dark:text-neutral-400 mt-4 max-w-2xl mx-auto">
                            Zaufali nam liderzy branży. Zobacz, co mówią o naszej współpracy.
                        </p>
                    </AnimatedElement>
                    <p className="text-center text-gray-500 dark:text-neutral-400 mt-8">
                        {loading ? 'Ładowanie opinii...' : 'Brak opinii do wyświetlenia'}
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section id="opinie" className="py-16 md:py-24 bg-gray-100 dark:bg-neutral-900/50">
            <div className="container mx-auto px-6">
                <AnimatedElement className="text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Co Mówią Nasi Klienci</h2>
                    <p className="text-gray-600 dark:text-neutral-400 mt-4 max-w-2xl mx-auto">
                        Zaufali nam liderzy branży. Zobacz, co mówią o naszej współpracy.
                    </p>
                </AnimatedElement>
            </div>

            <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)] mt-16">
                <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 animate-scroll [animation-play-state:running] hover:[animation-play-state:paused]">
                    {extendedTestimonials.map((testimonial, index) => (
                        <li key={index} className="w-[350px] max-w-full flex-shrink-0 bg-white dark:bg-neutral-950/80 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-neutral-800/50 backdrop-blur-sm">
                            <blockquote className="text-gray-600 dark:text-neutral-400 mb-4 italic">"{testimonial.quote}"</blockquote>
                            <div className="font-bold text-gray-900 dark:text-white">{testimonial.name}</div>
                            {testimonial.subtitle && (
                                <div className="text-sm text-gray-500 dark:text-gray-300">{testimonial.subtitle}</div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default TestimonialsSection;