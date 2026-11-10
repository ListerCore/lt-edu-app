import 'server-only';

// Institution whose public site this deployment serves (/news) and whose panel the platform superadmin opens.
// Institution roles always work on their own institution, whatever this says
export const siteInstitution = (): string => process.env.APP__SITE__INSTITUTION?.trim() || 'demo-ebr';
