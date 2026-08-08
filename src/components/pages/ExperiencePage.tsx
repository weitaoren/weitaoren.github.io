'use client';

import { motion } from 'framer-motion';
import AcademicSection from '@/components/home/AcademicSection';
import type { ExperiencePageConfig } from '@/types/page';

interface ExperiencePageProps {
  config: ExperiencePageConfig;
  embedded?: boolean;
}

export default function ExperiencePage({ config, embedded = false }: ExperiencePageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className={embedded ? '' : 'max-w-4xl mx-auto'}
    >
      <h1 className={`${embedded ? 'text-2xl' : 'text-4xl'} font-serif font-bold text-primary mb-8`}>
        {config.title}
      </h1>

      <div className="space-y-10">
        <AcademicSection title="Industry Internships" entries={config.internships} />

        <section>
          <h2 className="mb-4 border-b border-neutral-200 pb-2 font-serif text-2xl font-bold text-primary dark:border-neutral-800">
            Awards
          </h2>
          <div className="space-y-2 text-neutral-700 dark:text-neutral-600">
            {config.awards.map((award) => (
              <div
                key={`${award.title}-${award.period || ''}`}
                className="grid grid-cols-[1rem_minmax(0,1fr)] gap-x-2"
              >
                <span aria-hidden="true" className="content-bullet" />
                <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <div className="min-w-0 leading-relaxed">
                    <strong className="font-semibold text-primary">{award.title}</strong>
                    <span>, {award.institution}</span>
                  </div>
                  {award.period && (
                    <div className="shrink-0 text-neutral-500 sm:text-right sm:whitespace-nowrap">
                      {award.period}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
