export interface BasePageConfig {
    type: 'about' | 'publication' | 'card' | 'text' | 'experience';
    title: string;
    description?: string;
}

export interface AcademicEntry {
    primary: string;
    secondary: string;
    location?: string;
    period?: string;
    note?: string;
}

export interface PublicationPageConfig extends BasePageConfig {
    type: 'publication';
    source: string;
    tagline?: string;
    section_title?: string;
    details_source?: string;
    hide_controls?: boolean;
}

export interface TextPageConfig extends BasePageConfig {
    type: 'text';
    source: string;
}

export interface AwardEntry {
    title: string;
    institution: string;
    period?: string;
}

export interface ExperiencePageConfig extends BasePageConfig {
    type: 'experience';
    internships: AcademicEntry[];
    awards: AwardEntry[];
}

export interface CardItem {
    title: string;
    subtitle?: string;
    date?: string;
    content?: string;
    tags?: string[];
    link?: string;
    image?: string;
}

export interface CardPageConfig extends BasePageConfig {
    type: 'card';
    items: CardItem[];
}
