'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import type { AcademicEntry } from '@/types/page';

interface AcademicSectionProps {
  title?: string;
  entries: AcademicEntry[];
}

function InlineMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children: content }) => <>{content}</>,
        strong: ({ children: content }) => <strong className="font-semibold text-primary">{content}</strong>,
        em: ({ children: content }) => <em className="italic text-neutral-600 dark:text-neutral-500">{content}</em>,
        a: ({ href = '', children: content, ...props }) => {
          const className = 'font-semibold text-primary underline underline-offset-4 decoration-neutral-300 transition-colors duration-200 hover:decoration-primary';

          if (href.startsWith('/')) {
            return <Link href={href} className={className}>{content}</Link>;
          }

          return (
            <a {...props} href={href} target="_blank" rel="noopener noreferrer" className={className}>
              {content}
            </a>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}

export default function AcademicSection({ title, entries }: AcademicSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {title && (
        <h2 className="text-2xl font-serif font-bold text-primary mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
          {title}
        </h2>
      )}

      <div className="space-y-5 text-[1.0625rem] text-neutral-700 dark:text-neutral-600">
        {entries.map((entry, index) => (
          <article key={`${entry.primary}-${index}`} className="space-y-1">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
              <div className="min-w-0 leading-relaxed">
                <InlineMarkdown>{entry.primary}</InlineMarkdown>
              </div>
              {entry.location && (
                <div className="shrink-0 text-sm text-neutral-500 sm:text-base sm:text-right">
                  {entry.location}
                </div>
              )}
            </div>

            <div className="grid grid-cols-[1rem_minmax(0,1fr)] gap-x-2">
              <span aria-hidden="true" className="content-bullet" />
              <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <div className="min-w-0 text-base leading-relaxed">
                  <InlineMarkdown>{entry.secondary}</InlineMarkdown>
                </div>
                {entry.period && (
                  <div className="shrink-0 text-base text-neutral-500 sm:text-right sm:whitespace-nowrap">
                    {entry.period}
                  </div>
                )}
              </div>
            </div>

            {entry.note && (
              <div className="grid grid-cols-[1rem_minmax(0,1fr)] gap-x-2 text-base leading-relaxed text-neutral-600 dark:text-neutral-500">
                <span aria-hidden="true" className="content-bullet" />
                <div className="min-w-0">
                  <InlineMarkdown>{entry.note}</InlineMarkdown>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </motion.section>
  );
}
