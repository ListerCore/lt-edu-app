'use client';

import { createContext, useContext, useEffect, useState, useSyncExternalStore, type JSX, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/lib/site';

const SectionActivityContext = createContext<string | null>(null);

const sectionIds = siteConfig.navigation.map(({ href }) => href.split('#')[1]).filter(Boolean);

// URL hash as an external store, so the initial section is read without setState in an effect
const subscribeHash = (callback: () => void): (() => void) => {
  window.addEventListener('hashchange', callback);
  return () => window.removeEventListener('hashchange', callback);
};
const getHashSnapshot = (): string => window.location.hash.slice(1);
const getServerHash = (): string => '';

export const SectionActivityProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const pathname = usePathname();
  const [observedSection, setObservedSection] = useState<string | null | undefined>(undefined);
  const hash = useSyncExternalStore(subscribeHash, getHashSnapshot, getServerHash);
  // The scroll observer wins once it reports (null = above every section); until then fall back to the URL hash
  const activeSection = observedSection !== undefined ? observedSection : sectionIds.includes(hash) ? hash : null;

  useEffect(() => {
    const sections = sectionIds.map((id) => document.getElementById(id)).filter((section): section is HTMLElement => section !== null);
    if (sections.length === 0) return;

    // Above the first section (hero) no link is current
    const firstSection = sections[0];
    const onScroll = (): void => {
      if (window.scrollY + window.innerHeight * 0.24 < firstSection.offsetTop) setObservedSection(null);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visibleSections[0]) setObservedSection(visibleSections[0].target.id);
      },
      { rootMargin: '-24% 0px -62% 0px', threshold: [0, 0.15, 0.35, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      setObservedSection(undefined);
    };
    // Re-observe after client navigation, since the home sections remount
  }, [pathname]);

  return <SectionActivityContext.Provider value={activeSection}>{children}</SectionActivityContext.Provider>;
};

export const useActiveSection = (): string | null => useContext(SectionActivityContext);

// Whether a navigation link points at the current place: a home section (hash) or a page route
export const useIsActiveLink = (): ((href: string) => boolean) => {
  const activeSection = useActiveSection();
  const pathname = usePathname();
  return (href: string): boolean => {
    const [path, hash] = href.split('#');
    if (hash) return pathname === (path || '/') && activeSection === hash;
    return pathname === href || pathname.startsWith(`${href}/`);
  };
};
