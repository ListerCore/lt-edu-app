import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Módulo no disponible | SIGE-JL',
  description: 'El módulo solicitado no está disponible.',
};

export const instant = false;

const navigationRoutes = ['students', 'enrollment', 'attendance', 'evaluation', 'academics', 'classrooms', 'wellbeing', 'finance', 'reports', 'alerts', 'settings'];

export const generateStaticParams = (): { rest: string[] }[] => navigationRoutes.map((route) => ({ rest: [route] }));

const DashboardModuleNotFound = (): never => notFound();

export default DashboardModuleNotFound;
