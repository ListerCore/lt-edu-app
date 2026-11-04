import type { IconInput } from 'morphicons/react';

// One level, cycle or program of the offer
export interface ProgramItem {
  name: string;
  range: string;
  description: string;
}

export interface LandingOffer {
  intro: string;
  // Levels that follow one another (EBR, EBA, EBE) are drawn as a route; independent options as a list
  sequential: boolean;
  items: ProgramItem[];
}

export interface AdmissionStep {
  title: string;
  description: string;
}

export interface LandingAdmission {
  intro: string;
  steps: AdmissionStep[];
  requirements: string[];
}

// What the hero ID card prints for this kind of institution
export interface IdCardSample {
  name: string;
  detail: string;
  code: string;
  role: string;
}

export interface LandingContent {
  heroLead: string;
  idCard: IdCardSample;
  offer: LandingOffer;
  admission: LandingAdmission;
}

export interface AboutValue {
  icon: IconInput;
  title: string;
  description: string;
}

export interface AccountAudience {
  title: string;
  items: string[];
}

export interface IdCardProps {
  card: IdCardSample;
}
