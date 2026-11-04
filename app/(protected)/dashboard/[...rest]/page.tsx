import { notFound } from 'next/navigation';

// This route only exists to throw notFound(), so there is no page for instant-navigation validation to render
export const instant = false;

// Any panel route besides the home falls through to the panel's own 404 (rendered inside the sidebar shell)
const Page = (): never => notFound();

export default Page;
