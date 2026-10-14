'use client';

import Link from 'next/link';
import { createContext, useContext, useEffect, useMemo, useState, type JSX, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { CheckCircle2, Circle } from 'lucide-react';

interface ActiveNavigationContextValue {
  activeSection: string;
}

interface ActiveNavigationProviderProps {
  children: ReactNode;
}

interface ActiveNavigationLinkProps {
  href: string;
  label: string;
  className?: string;
  compact?: boolean;
  mobile?: boolean;
}

const ActiveNavigationContext = createContext<ActiveNavigationContextValue>({ activeSection: '' });

const ActiveNavigationProvider = ({ children }: ActiveNavigationProviderProps): JSX.Element => {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    if (pathname !== '/') {
      return;
    }

    const updateFromHash = (): void => setActiveSection(window.location.hash.slice(1));
    updateFromHash();
    window.addEventListener('hashchange', updateFromHash);

    const sectionIds = ['about-us', 'programs', 'virtual-learning', 'admissions'];
    const sections = sectionIds.map((id) => document.getElementById(id)).filter((section): section is HTMLElement => section !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries.filter((entry) => entry.isIntersecting);
        if (visibleSections.length === 0) return;
        const nearestSection = visibleSections.reduce((nearest, entry) => (Math.abs(entry.boundingClientRect.top - window.innerHeight * 0.35) < Math.abs(nearest.boundingClientRect.top - window.innerHeight * 0.35) ? entry : nearest));
        setActiveSection(nearestSection.target.id);
      },
      { rootMargin: '-30% 0px -58% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', updateFromHash);
    };
  }, [pathname]);

  const value = useMemo(() => ({ activeSection: pathname === '/' ? activeSection : '' }), [activeSection, pathname]);

  return <ActiveNavigationContext.Provider value={value}>{children}</ActiveNavigationContext.Provider>;
};

const ActiveNavigationLink = ({ href, label, className = '', compact = false, mobile = false }: ActiveNavigationLinkProps): JSX.Element => {
  const pathname = usePathname();
  const { activeSection } = useContext(ActiveNavigationContext);
  const [targetPath, targetSection = ''] = href.split('#');
  const isSectionLink = href.includes('#');
  const pathMatches = pathname === (targetPath || '/');
  const isActive = isSectionLink ? pathMatches && activeSection === targetSection : pathMatches && (targetPath !== '/' || activeSection === '');
  const baseClassName = compact ? 'group inline-flex w-full flex-row items-center justify-start gap-2 rounded-md px-2 py-1 text-left text-xs leading-5 transition-colors hover:text-secondary' : mobile ? 'relative flex min-h-11 items-center gap-2 rounded-lg px-3 text-[13px] transition-colors' : 'relative rounded-lg px-3 py-2 text-[11px] transition-colors';
  const inactiveClassName = compact ? 'text-muted-foreground' : mobile ? 'text-muted-foreground hover:text-foreground' : 'font-medium text-muted-foreground hover:text-foreground';
  const activeClassName = compact ? 'font-semibold text-secondary' : mobile ? "font-semibold text-secondary after:absolute after:bottom-1 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-secondary after:content-['']" : "font-semibold text-secondary after:absolute after:bottom-0.5 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-secondary after:content-['']";

  return (
    <Link href={href} aria-current={isActive ? 'location' : undefined} className={`${baseClassName} ${isActive ? activeClassName : inactiveClassName} ${className}`}>
      {compact ? (
        <span className="flex w-full flex-row items-center justify-start gap-2 text-left">
          {isActive ? <CheckCircle2 aria-hidden="true" className="size-4 text-secondary" /> : <Circle aria-hidden="true" className="size-3.5 text-muted-foreground/60" />}
          <span className="text-center">{label}</span>
        </span>
      ) : (
        <>
          {mobile && <span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full ${isActive ? 'bg-secondary' : 'bg-muted-foreground/50'}`} />}
          {label}
        </>
      )}
    </Link>
  );
};

export { ActiveNavigationLink, ActiveNavigationProvider };
