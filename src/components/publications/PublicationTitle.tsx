'use client';

import { useEffect, useRef } from 'react';
import { Publication } from '@/types/publication';
import FormattedBibTeXText from './FormattedBibTeXText';

export default function PublicationTitle({ publication, className }: { publication: Publication; className?: string }) {
    const headingRef = useRef<HTMLHeadingElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const heading = headingRef.current;
        const text = textRef.current;
        if (!heading || !text) return;
        let active = true;
        const desktop = window.matchMedia('(min-width: 1024px)');
        const fit = () => {
            if (!active) return;
            heading.style.fontSize = '';
            if (!desktop.matches || heading.clientWidth === 0) return;
            const baseSize = parseFloat(window.getComputedStyle(heading).fontSize);
            const naturalWidth = text.getBoundingClientRect().width;
            if (naturalWidth > heading.clientWidth) {
                heading.style.fontSize = `${baseSize * (heading.clientWidth - 1) / naturalWidth}px`;
            }
        };
        const observer = new ResizeObserver(fit);
        observer.observe(heading);
        desktop.addEventListener('change', fit);
        document.fonts.addEventListener('loadingdone', fit);
        void document.fonts.ready.then(fit);
        fit();
        return () => {
            active = false;
            observer.disconnect();
            desktop.removeEventListener('change', fit);
            document.fonts.removeEventListener('loadingdone', fit);
        };
    }, [publication]);

    return (
        <h3 ref={headingRef} className={`w-full font-serif text-lg font-bold leading-tight text-primary lg:whitespace-nowrap ${className || ''}`}>
            <span ref={textRef} className="lg:inline-block">
                <FormattedBibTeXText nodes={publication.titleNodes} fallback={publication.title} />
            </span>
        </h3>
    );
}
