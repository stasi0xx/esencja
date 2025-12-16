import React, { useState, useEffect } from 'react';
import AnimatedElement from '../components/AnimatedElement';
import { MapPin, Phone, Mail, Clock, Building2 } from 'lucide-react';
import ButtonAction from "../components/ButtonAction.tsx";

declare global {
        interface Window {
              gtag: (...args: any[]) => void;
           }
    }

const CONVERSION_ID = 'AW-961285751/I1VbCO-chM0bEPecsMoD';

const ContactPage: React.FC = () => {
    const [emailCopied, setEmailCopied] = useState(false);

    useEffect(() => {
             if (typeof window !== 'undefined' && window.gtag) {
                        window.gtag('event', 'conversion', {
                              'send_to': `${CONVERSION_ID}`
                       });
                 }
           }, []);

    const handleCopyEmail = async () => {
        try {
            await navigator.clipboard.writeText('agencja@esencja.net');
            setEmailCopied(true);
            setTimeout(() => setEmailCopied(false), 2000);
        } catch (error) {
            // można ewentualnie dodać fallback lub komunikat błędu
            console.error('Nie udało się skopiować e-maila', error);
        }
    };

    return (
        <div className="relative overflow-hidden">
            <div className="overflow-x-hidden">

                {/* Główne bloki kontaktowe */}
                {/* Główne bloki kontaktowe */}
                <section className="container mx-auto px-6 py-12 grid gap-10 lg:grid-cols-[0.9fr,1.1fr] items-start">
                    {/* Dane kontaktowe / biuro */}
                    <AnimatedElement className="space-y-8">
                        <div>
                            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-gray-500 dark:text-neutral-500">
                                Kontakt
                            </p>
                            <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                                ESENCJA | kreatorzy reklamy
                            </h2>
                            <p className="mt-2 text-gray-600 dark:text-neutral-400">
                                ul. Batorego 23 lok 7<br />
                                81-365 Gdynia
                            </p>
                        </div>

                        {/* Karty kontaktowe */}
                        <div className="grid gap-5 md:grid-cols-2">
                            {/* Adres */}
                            <div className="group relative overflow-hidden rounded-xl border border-gray-200/80 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 shadow-sm px-5 py-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-semibold tracking-[0.18em] uppercase text-gray-500 dark:text-neutral-500">
                                            Adres biura
                                        </div>
                                        <div className="mt-1 text-sm text-gray-800 dark:text-neutral-200 leading-relaxed">
                                            ul. Batorego 23 lok 7<br />
                                            81-365 Gdynia
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Telefon + e-mail */}
                            <div className="group relative overflow-hidden rounded-xl border border-gray-200/80 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 shadow-sm px-5 py-4">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm">
                                            <Phone size={18} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-semibold tracking-[0.18em] uppercase text-gray-500 dark:text-neutral-500">
                                                Telefon
                                            </div>
                                            <div className="mt-1 text-sm text-gray-800 dark:text-neutral-200 leading-relaxed">
                                                biuro:{' '}
                                                <a
                                                    href="tel:+48609795999"
                                                    className="font-medium text-gray-900 dark:text-white hover:underline"
                                                >
                                                    +48 60 979 59 99
                                                </a>
                                                <br />
                                                kom.:{' '}
                                                <a
                                                    href="tel:+48601863050"
                                                    className="font-medium text-gray-900 dark:text-white hover:underline"
                                                >
                                                    +48 601 86 30 50
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-neutral-800 to-transparent" />

                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm">
                                            <Mail size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs font-semibold tracking-[0.18em] uppercase text-gray-500 dark:text-neutral-500">
                                                E-mail
                                            </div>

                                            {/* mail + przycisk pod spodem */}
                                            <div className="mt-2 flex flex-col gap-2">
                                                <a
                                                    href="mailto:agencja@esencja.net"
                                                    className="inline-flex text-sm font-medium text-gray-900 dark:text-white hover:underline break-all"
                                                >
                                                    agencja@esencja.net
                                                </a>

                                                <ButtonAction
                                                    text={emailCopied ? "Skopiowano" : "Kopiuj e‑mail"}
                                                    onClick={handleCopyEmail}
                                                />
                                            </div>

                                            {emailCopied && (
                                                <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                                                    Adres e‑mail został skopiowany do schowka.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Godziny pracy */}
                            <div className="group relative overflow-hidden rounded-xl border border-gray-200/80 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 shadow-sm px-5 py-4 md:col-span-2">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm">
                                        <Clock size={18} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="text-xs font-semibold tracking-[0.18em] uppercase text-gray-500 dark:text-neutral-500">
                                            Godziny pracy biura
                                        </div>
                                        <div className="text-sm text-gray-800 dark:text-neutral-200 leading-relaxed">
                                            poniedziałek – piątek:{' '}
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                9.00 – 17.00
                                            </span>
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">
                                            Poza godzinami pracy możesz wysłać wiadomość e‑mail – odezwiemy się
                                            najszybciej jak to możliwe.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dane spółki – POD danymi kontaktowymi */}
                        <AnimatedElement delay={150} className="space-y-6">
                            <div className="border border-gray-200 dark:border-neutral-800 rounded-lg p-6 bg-white dark:bg-neutral-900 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <Building2 className="text-gray-900 dark:text-white" size={20} />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Dane spółki
                                    </h3>
                                </div>
                                <div className="text-gray-700 dark:text-neutral-300 text-sm space-y-1.5">
                                    <p className="font-medium">ESENCJA Sp. z o.o.</p>
                                    <p>
                                        ul. Batorego 23 lok 7<br />
                                        81-365 Gdynia
                                    </p>
                                    <p>NIP: 585-145-98-24</p>
                                    <p>
                                        Sąd Rejonowy Gdańsk-Północ w Gdańsku<br />
                                        XII Wydział Gospodarczy, KRS 0000381803
                                    </p>
                                </div>
                            </div>
                        </AnimatedElement>
                    </AnimatedElement>

                    {/* Mapa obok (druga kolumna na dużych ekranach) */}
                    <AnimatedElement delay={200} className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Mapa Google
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-neutral-400">
                            Poniżej znajdziesz naszą lokalizację w Mapach Google.
                        </p>
                        <div className="aspect-video w-full overflow-hidden rounded-lg border border-gray-200 dark:border-neutral-800 shadow-sm">
                            <iframe
                                title="Mapa dojazdu ESENCJA"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2315.850643710466!2d18.532445312757698!3d54.5184953725383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46fda725917c0001%3A0x32faec91ea41e19!2sStefana%20Batorego%2023%2F7%2C%2081-365%20Gdynia!5e0!3m2!1spl!2spl!4v1764181082970!5m2!1spl!2spl"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </AnimatedElement>
                </section>
            </div>
        </div>
    );
};

export default ContactPage;