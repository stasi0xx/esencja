
import AnimatedElement from './AnimatedElement';

const testimonials = [
  {
    quote: "Ich strategie SEO wyniosły naszą widoczność na zupełnie nowy poziom. Profesjonalizm i wyniki, które mówią same za siebie.",
    name: "Jan Kowalski",
    title: "CEO, Tech-Innowacje"
  },
  {
    quote: "Kampania w mediach społecznościowych przerosła nasze najśmielsze oczekiwania. Kreatywność i zaangażowanie na najwyższym poziomie.",
    name: "Anna Nowak",
    title: "Marketing Manager, Kreatywna Moda"
  },
  {
    quote: "Dzięki Esencji nasz ROI z reklam Google Ads wzrósł o 150%. Niesamowita agencja, z którą współpraca to czysta przyjemność.",
    name: "Piotr Wiśniewski",
    title: "Właściciel, E-Sklep Lider"
  },
  {
    quote: "Pełen profesjonalizm od strategii po realizację. Nasza nowa strona internetowa jest nie tylko piękna, ale i skuteczna.",
    name: "Katarzyna Dąbrowska",
    title: "Dyrektor ds. Rozwoju, Finanse Plus"
  },
   {
    quote: "Analizy i raporty, które otrzymujemy, są niezwykle wnikliwe i pomagają nam podejmować lepsze decyzje biznesowe.",
    name: "Tomasz Zieliński",
    title: "Prezes Zarządu, BuildCo"
  }
];

// Duplicate testimonials for seamless loop
const extendedTestimonials = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

const TestimonialsSection = () => {
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
              <div className="text-sm text-gray-500 dark:text-gray-300">{testimonial.title}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TestimonialsSection;