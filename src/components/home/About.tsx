'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { useMessages } from '@/lib/i18n/useMessages';

interface AboutProps {
    content: string;
    title?: string;
    divided?: boolean;
}

export default function About({ content, title, divided = false }: AboutProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.about;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
        >
            {divided ? (
                <h2 className="mb-4 border-b border-neutral-200 pb-2 font-serif text-2xl font-bold text-primary dark:border-neutral-800">
                    {resolvedTitle}
                </h2>
            ) : (
                <div className="section-heading-block mb-5">
                    <h2 className="font-serif text-3xl font-bold text-primary">{resolvedTitle}</h2>
                    <span aria-hidden="true" className="section-heading-rule" />
                </div>
            )}
            <div className="text-[1.0625rem] text-neutral-700 dark:text-neutral-600 leading-relaxed">
                <ReactMarkdown
                    components={{
                        h1: ({ children }) => <h1 className="text-3xl font-serif font-bold text-primary mt-8 mb-4">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-2xl font-serif font-bold text-primary mt-8 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xl font-semibold text-primary mt-6 mb-3">{children}</h3>,
                        p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="content-list mb-4 space-y-3">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-5 mb-4 space-y-3">{children}</ol>,
                        li: ({ children }) => <li>{children}</li>,
                        a: ({ href = '', children, ...props }) => {
                            const className = "text-primary font-semibold underline underline-offset-4 decoration-neutral-300 transition-colors duration-200 hover:decoration-primary";

                            if (href.startsWith('/')) {
                                return (
                                    <Link
                                        href={href}
                                        className={className}
                                        onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' })}
                                        scroll
                                    >
                                        {children}
                                    </Link>
                                );
                            }

                            return (
                                <a
                                    {...props}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={className}
                                >
                                    {children}
                                </a>
                            );
                        },
                        blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-500">
                                {children}
                            </blockquote>
                        ),
                        strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                        em: ({ children }) => <em className="italic text-neutral-600 dark:text-neutral-500">{children}</em>,
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </motion.section>
    );
}
