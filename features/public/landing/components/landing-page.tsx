import type { JSX } from 'react';
import { LandingContact } from './landing-contact';
import { LandingHero } from './landing-hero';
import { LandingInstitutions } from './landing-institutions';
import { LandingModules } from './landing-modules';
import { LandingRoles } from './landing-roles';
import { LandingSecurity } from './landing-security';

// Home: presents the management platform; sections match the navbar anchors (#modules, #roles, #institutions, #security)
export const LandingPage = (): JSX.Element => (
  <>
    <LandingHero />
    <LandingModules />
    <LandingRoles />
    <LandingInstitutions />
    <LandingSecurity />
    <LandingContact />
  </>
);
