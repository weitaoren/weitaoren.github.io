'use client';

import Profile from '@/components/home/Profile';
import About from '@/components/home/About';
import AcademicSection from '@/components/home/AcademicSection';
import SelectedPublications from '@/components/home/SelectedPublications';
import News, { NewsItem } from '@/components/home/News';
import PublicationsList from '@/components/publications/PublicationsList';
import TextPage from '@/components/pages/TextPage';
import CardPage from '@/components/pages/CardPage';
import ExperiencePage from '@/components/pages/ExperiencePage';
import type { SiteConfig } from '@/lib/config';
import { Publication } from '@/types/publication';
import { AcademicEntry, CardPageConfig, ExperiencePageConfig, PublicationPageConfig, TextPageConfig } from '@/types/page';
import { useLocaleStore } from '@/lib/stores/localeStore';

interface SectionConfig {
  id: string;
  type: 'markdown' | 'publications' | 'list' | 'academic';
  title?: string;
  source?: string;
  filter?: string;
  limit?: number;
  content?: string;
  publications?: Publication[];
  items?: NewsItem[];
  entries?: AcademicEntry[];
}

type PageData =
  | { type: 'about'; id: string; sections: SectionConfig[] }
  | { type: 'publication'; id: string; config: PublicationPageConfig; publications: Publication[]; detailsContent?: string }
  | { type: 'text'; id: string; config: TextPageConfig; content: string }
  | { type: 'card'; id: string; config: CardPageConfig }
  | { type: 'experience'; id: string; config: ExperiencePageConfig };

export interface HomePageLocaleData {
  author: SiteConfig['author'];
  social: SiteConfig['social'];
  features: SiteConfig['features'];
  enableOnePageMode?: boolean;
  researchInterests?: string[];
  pagesToShow: PageData[];
}

interface HomePageClientProps {
  dataByLocale: Record<string, HomePageLocaleData>;
  defaultLocale: string;
}

export default function HomePageClient({ dataByLocale, defaultLocale }: HomePageClientProps) {
  const locale = useLocaleStore((state) => state.locale);
  const fallback = dataByLocale[defaultLocale] || Object.values(dataByLocale)[0];
  const data = dataByLocale[locale] || fallback;

  if (!data) {
    return null;
  }

  return (
    <div className="mx-auto min-h-screen max-w-6xl bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[16.5rem_minmax(0,1fr)] lg:gap-8 xl:gap-10">
        <div>
          <Profile
            author={data.author}
            social={data.social}
            features={data.features}
            researchInterests={data.researchInterests}
          />
        </div>

        <div className="min-w-0 max-w-none space-y-8">
          {data.pagesToShow.map((page) => (
            <section
              key={page.id}
              id={page.id}
              className={`space-y-8 ${page.id === 'research' ? 'relative scroll-mt-4 pt-16 lg:pt-24' : 'scroll-mt-24'}`}
            >
              {page.id === 'research' && (
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-4 flex items-center lg:top-8"
                >
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/45 to-accent/25" />
                  <span className="mx-3 h-2 w-2 rotate-45 border border-accent/60 bg-background" />
                  <span className="h-px flex-1 bg-gradient-to-r from-accent/25 via-accent/45 to-transparent" />
                </div>
              )}
              {page.type === 'about' && page.sections.map((section: SectionConfig) => {
                switch (section.type) {
                  case 'markdown':
                    return (
                      <About
                        key={section.id}
                        content={section.content || ''}
                        title={section.title}
                        divided={section.id !== 'about'}
                      />
                    );
                  case 'publications':
                    return (
                      <SelectedPublications
                        key={section.id}
                        publications={section.publications || []}
                        title={section.title}
                        enableOnePageMode={data.enableOnePageMode}
                      />
                    );
                  case 'academic':
                    return (
                      <AcademicSection
                        key={section.id}
                        title={section.title}
                        entries={section.entries || []}
                      />
                    );
                  case 'list':
                    return (
                      <News
                        key={section.id}
                        items={section.items || []}
                        title={section.title}
                      />
                    );
                  default:
                    return null;
                }
              })}
              {page.type === 'publication' && (
                <PublicationsList
                  config={page.config}
                  publications={page.publications}
                  detailsContent={page.detailsContent}
                  embedded={true}
                />
              )}
              {page.type === 'text' && (
                <TextPage
                  config={page.config}
                  content={page.content}
                  embedded={true}
                />
              )}
              {page.type === 'card' && (
                <CardPage
                  config={page.config}
                  embedded={true}
                />
              )}
              {page.type === 'experience' && (
                <ExperiencePage
                  config={page.config}
                  embedded={true}
                />
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
