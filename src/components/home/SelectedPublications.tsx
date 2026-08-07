'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Publication } from '@/types/publication';
import { useMessages } from '@/lib/i18n/useMessages';
import FormattedBibTeXText from '@/components/publications/FormattedBibTeXText';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
    enableOnePageMode?: boolean;
}

export default function SelectedPublications({ publications, title, enableOnePageMode = false }: SelectedPublicationsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.selectedPublications;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-serif font-bold text-primary">{resolvedTitle}</h2>
                <Link
                    href={enableOnePageMode ? "/#research" : "/research"}
                    prefetch={true}
                    className="text-accent hover:text-accent-dark text-sm font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                >
                    {messages.home.viewAll} →
                </Link>
            </div>
            <div className="space-y-4">
                {publications.map((pub, index) => (
                    <motion.div
                        key={pub.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className="rounded-lg border border-neutral-200 bg-neutral-50 py-3 pl-12 pr-5 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
                    >
                        <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-4">
                            <p className="relative h-12 w-14 -translate-x-2 font-['Bodoni_72','Didot','Bodoni_MT',Georgia,serif] leading-none text-primary dark:text-neutral-100">
                                <span className="absolute left-0.5 top-0 text-[1.05rem] font-semibold tracking-[0.03em]">{pub.year}</span>
                                {pub.month && (
                                    <>
                                        <span aria-hidden="true" className="absolute left-[1.45rem] top-[1.55rem] h-[1.5px] w-7 -rotate-[32deg] rounded-full bg-gradient-to-r from-[#b79a6a]/40 via-[#b79a6a] to-[#b79a6a]/40 dark:from-[#d2b889]/40 dark:via-[#d2b889] dark:to-[#d2b889]/40" />
                                        <span className="absolute bottom-0 left-[2.05rem] text-[1.05rem] font-semibold tracking-[0.08em]">{String(pub.month).padStart(2, '0')}</span>
                                    </>
                                )}
                            </p>
                            <div className="min-w-0 pl-3">
                                <h3 className="mb-1 font-serif text-lg font-bold leading-tight text-primary">
                                    <FormattedBibTeXText nodes={pub.titleNodes} fallback={pub.title} />
                                </h3>
                                <p className="mb-1 font-serif text-base font-semibold leading-relaxed text-primary dark:text-neutral-100">
                                    {pub.journal || pub.conference}
                                </p>
                                <p className="text-sm text-primary dark:text-neutral-200">
                                    {pub.authors.map((author, idx) => (
                                        <span key={idx}>
                                            <span className={`${author.isHighlighted ? 'font-semibold text-primary' : ''} ${author.isCoAuthor ? `underline underline-offset-4 ${author.isHighlighted ? 'decoration-primary' : 'decoration-neutral-400'}` : ''}`}>
                                                {author.name}
                                            </span>
                                            {author.isCorresponding && (
                                                <sup className={`ml-0 ${author.isHighlighted ? 'text-primary' : 'text-neutral-600 dark:text-neutral-400'}`}>*</sup>
                                            )}
                                            {idx < pub.authors.length - 1 && ', '}
                                        </span>
                                    ))}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
