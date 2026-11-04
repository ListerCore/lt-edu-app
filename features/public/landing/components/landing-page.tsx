import type { JSX } from 'react';
import { LandingAbout } from './landing-about';
import { LandingAccount } from './landing-account';
import { LandingAdmissions } from './landing-admissions';
import { LandingContact } from './landing-contact';
import { LandingHero } from './landing-hero';
import { LandingPrograms } from './landing-programs';

// Home of the institution's site; sections match the navbar anchors (#about, #programs, #admissions)
export const LandingPage = (): JSX.Element => (
  <>
    <LandingHero />
    <LandingAbout />
    <LandingPrograms />
    <LandingAccount />
    <LandingAdmissions />
    <LandingContact />
  </>
);
