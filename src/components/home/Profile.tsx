'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    EnvelopeIcon,
    AcademicCapIcon,
    HeartIcon,
    MapPinIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Check, Copy, Github, Linkedin } from 'lucide-react';
import type { SiteConfig } from '@/lib/config';
import { useMessages } from '@/lib/i18n/useMessages';

// Custom ORCID icon component
const OrcidIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z" />
    </svg>
);

interface ProfileProps {
    author: SiteConfig['author'];
    social: SiteConfig['social'];
    features: SiteConfig['features'];
    researchInterests?: string[];
}

export default function Profile({ author, social, features, researchInterests }: ProfileProps) {
    const messages = useMessages();

    const [hasLiked, setHasLiked] = useState(false);
    const [showThanks, setShowThanks] = useState(false);
    const [showAddress, setShowAddress] = useState(false);
    const [showEmail, setShowEmail] = useState(false);
    const [emailCopied, setEmailCopied] = useState(false);

    // Check local storage for user's like status
    useEffect(() => {
        if (!features.enable_likes) return;

        const userHasLiked = localStorage.getItem('jiale-website-user-liked');
        if (userHasLiked === 'true') {
            setHasLiked(true);
        }
    }, [features.enable_likes]);

    const handleLike = () => {
        const newLikedState = !hasLiked;
        setHasLiked(newLikedState);

        if (newLikedState) {
            localStorage.setItem('jiale-website-user-liked', 'true');
            setShowThanks(true);
            setTimeout(() => setShowThanks(false), 2000);
        } else {
            localStorage.removeItem('jiale-website-user-liked');
            setShowThanks(false);
        }
    };

    const handleCopyEmail = async () => {
        if (!social.email || !navigator.clipboard) return;

        try {
            await navigator.clipboard.writeText(social.email);
            setEmailCopied(true);
            window.setTimeout(() => setEmailCopied(false), 1600);
        } catch {
            setEmailCopied(false);
        }
    };

    const socialLinks = [
        ...(social.email ? [{
            name: messages.profile.email,
            href: `mailto:${social.email}`,
            icon: EnvelopeIcon,
            isEmail: true,
        }] : []),
        ...(social.location || social.location_details ? [{
            name: messages.profile.location,
            href: social.location_url || '#',
            icon: MapPinIcon,
            isLocation: true,
        }] : []),
        ...(social.google_scholar ? [{
            name: 'Google Scholar',
            href: social.google_scholar,
            icon: AcademicCapIcon,
        }] : []),
        ...(social.orcid ? [{
            name: 'ORCID',
            href: social.orcid,
            icon: OrcidIcon,
        }] : []),
        ...(social.github ? [{
            name: 'GitHub',
            href: social.github,
            icon: Github,
        }] : []),
        ...(social.linkedin ? [{
            name: 'LinkedIn',
            href: social.linkedin,
            icon: Linkedin,
        }] : []),
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-24 lg:-my-8 lg:border-r lg:border-neutral-200 lg:bg-[#f7f7f4] lg:px-3 lg:py-8"
        >
            {/* Profile Image */}
            <div className="mx-auto mb-5 h-52 w-52 overflow-hidden rounded-2xl shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl">
                <Image
                    src={author.avatar}
                    alt={author.name}
                    width={256}
                    height={256}
                    className="w-full h-full object-cover object-center"
                    priority
                />
            </div>

            {/* Name and Title */}
            <div className="mb-4 text-center">
                <h1 className="text-3xl font-serif font-bold text-primary mb-2">
                    {author.name}
                </h1>
                <p className="text-lg text-primary font-medium mb-1">
                    {author.title}
                </p>
                <p className="text-neutral-600 mb-2 whitespace-pre-line leading-relaxed">
                    {author.institution}
                </p>
                {author.quote && (
                    <p className="font-serif text-sm italic text-neutral-500">
                        {author.quote}
                    </p>
                )}
            </div>

            {/* Contact Links */}
            <div className="relative mb-4 flex flex-wrap justify-center gap-3 px-2 sm:gap-4">
                {socialLinks.map((link) => {
                    const IconComponent = link.icon;
                    if (link.isLocation) {
                        return (
                            <div key={link.name} className="relative">
                                <button
                                    onMouseEnter={() => {
                                        setShowEmail(false);
                                        setShowAddress(true);
                                    }}
                                    onMouseLeave={() => setShowAddress(false)}
                                    onClick={() => {
                                        setShowEmail(false);
                                        setShowAddress((visible) => !visible);
                                    }}
                                    type="button"
                                    className="p-2 sm:p-2 text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors duration-200"
                                    aria-label={link.name}
                                    aria-expanded={showAddress}
                                >
                                    <MapPinIcon className="h-5 w-5" />
                                </button>

                                {/* Address tooltip */}
                                <AnimatePresence>
                                    {showAddress && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                            animate={{ opacity: 1, y: -10, scale: 1 }}
                                            exit={{ opacity: 0, y: -20, scale: 0.8 }}
                                            className="absolute z-20 top-0 left-1/2 flex -translate-x-1/2 -translate-y-full transform items-center justify-center rounded-lg bg-neutral-800 px-4 py-2 text-sm font-medium leading-5 text-white shadow-lg max-w-[calc(100vw-2rem)] sm:max-w-none sm:whitespace-nowrap"
                                            onMouseEnter={() => setShowAddress(true)}
                                            onMouseLeave={() => setShowAddress(false)}
                                        >
                                            <div className="w-full text-center">
                                                {social.location_details?.map((line, i) => (
                                                    <p key={i} className="break-words">{line}</p>
                                                ))}
                                                {(!social.location_details || social.location_details.length === 0) && social.location && (
                                                    <p className="break-words">{social.location}</p>
                                                )}
                                                {social.location_url && (
                                                    <div className="mt-2 flex flex-col justify-center space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                                                        <a
                                                            href={social.location_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center justify-center space-x-2 bg-accent hover:bg-accent-dark text-white px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 w-full sm:w-auto"
                                                        >
                                                            <MapPinIcon className="h-4 w-4" />
                                                            <span>{messages.profile.googleMap}</span>
                                                        </a>
                                                    </div>
                                                )}

                                            </div>
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-800"></div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    }
                    if (link.isEmail) {
                        return (
                            <div key={link.name} className="relative">
                                <button
                                    onMouseEnter={() => {
                                        setShowAddress(false);
                                        setShowEmail(true);
                                    }}
                                    onMouseLeave={() => setShowEmail(false)}
                                    onClick={() => {
                                        setShowAddress(false);
                                        setShowEmail((visible) => !visible);
                                    }}
                                    type="button"
                                    className="p-2 sm:p-2 text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors duration-200"
                                    aria-label={link.name}
                                    aria-expanded={showEmail}
                                >
                                    <EnvelopeIcon className="h-5 w-5" />
                                </button>

                                {/* Email tooltip */}
                                <AnimatePresence>
                                    {showEmail && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                            animate={{ opacity: 1, y: -10, scale: 1 }}
                                            exit={{ opacity: 0, y: -20, scale: 0.8 }}
                                            className="absolute z-20 top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-neutral-800 text-white px-4 py-3 rounded-lg text-sm font-medium shadow-lg max-w-[calc(100vw-2rem)] sm:max-w-none sm:whitespace-nowrap"
                                            onMouseEnter={() => setShowEmail(true)}
                                            onMouseLeave={() => setShowEmail(false)}
                                        >
                                            <div className="text-center">
                                                <p className="break-words">{social.email}</p>
                                                <div className="mt-2 flex items-center justify-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={handleCopyEmail}
                                                        aria-label={emailCopied ? messages.common.copied : messages.common.copy}
      className="inline-flex w-[4.25rem] flex-none items-center justify-center gap-1.5 rounded-md bg-accent px-1.5 py-1 text-xs font-medium text-white transition-colors duration-200 hover:bg-accent-dark"
                                                    >
                                                        {emailCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                                        <span>{emailCopied ? messages.common.copied : messages.common.copy}</span>
                                                    </button>
                                                    <a
                                                        href={link.href}
      className="inline-flex w-[4.25rem] flex-none items-center justify-center gap-1.5 rounded-md bg-accent px-1.5 py-1 text-xs font-medium text-white transition-colors duration-200 hover:bg-accent-dark"
                                                    >
                                                        <EnvelopeIcon className="h-3.5 w-3.5" />
                                                        <span>{messages.profile.send}</span>
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-800"></div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    }
                    return (
                        <a
                            key={link.name}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 sm:p-2 text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors duration-200"
                            aria-label={link.name}
                        >
                            <IconComponent className="h-5 w-5" />
                        </a>
                    );
                })}
            </div>

            {/* Research Interests */}
            {researchInterests && researchInterests.length > 0 && (
                <>
                <div aria-hidden="true" className="relative mx-auto mt-4 flex items-center px-1">
                    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/45 to-accent/25" />
                    <span className="mx-3 h-2 w-2 rotate-45 border border-accent/60 bg-background" />
                    <span className="h-px flex-1 bg-gradient-to-r from-accent/25 via-accent/45 to-transparent" />
                </div>
                <div className="mx-auto mb-6 max-w-full px-1 pt-3">
                    <h3 className="mb-3 font-serif text-xl font-bold text-primary">{messages.profile.researchInterests}</h3>
                    <ul className="content-list space-y-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-500">
                        {researchInterests.map((interest, index) => (
                            <li key={index} className="whitespace-nowrap">{interest}</li>
                        ))}
                    </ul>
                </div>
                </>
            )}

            {/* Like Button */}
            {features.enable_likes && (
                <div className="flex justify-center">
                    <div className="relative">
                        <motion.button
                            onClick={handleLike}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${hasLiked
                                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 cursor-pointer'
                                }`}
                        >
                            {hasLiked ? (
                                <HeartSolidIcon className="h-4 w-4" />
                            ) : (
                                <HeartIcon className="h-4 w-4" />
                            )}
                            <span>{hasLiked ? messages.profile.liked : messages.profile.like}</span>
                        </motion.button>

                        {/* Thanks bubble */}
                        <AnimatePresence>
                            {showThanks && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                    animate={{ opacity: 1, y: -10, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.8 }}
                                    className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg whitespace-nowrap"
                                >
                                    {messages.profile.thanks} 😊
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-accent"></div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
