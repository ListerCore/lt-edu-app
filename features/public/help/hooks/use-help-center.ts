'use client';

import { useMemo, useState } from 'react';
import type { HelpAnnouncement, HelpCenterTab, HelpCenterViewModel, HelpGuide, HelpTopic, HelpTutorial } from '../types';

const announcementsData: HelpAnnouncement[] = [
  {
    id: 'platform-update',
    title: 'Mantenimiento programado y actualización de SIGE-JL',
    summary: 'Mejoras de rendimiento para el aula virtual y sus herramientas de aprendizaje.',
    detail: 'Las actualizaciones ayudan a mantener disponibles los cursos, las tareas y los recursos digitales. Si tienes una dificultad de acceso, comunícate con el equipo de soporte.',
    category: 'Plataforma',
    label: 'Actualización',
    featured: true,
  },
  {
    id: 'matricula-guide',
    title: 'Ficha Única de Matrícula en formato digital',
    summary: 'Consulta cómo revisar y descargar la información de matrícula desde tu espacio virtual.',
    detail: 'Verifica tus datos personales y académicos antes de descargar el documento. Si encuentras un dato incorrecto, solicita orientación por los canales institucionales.',
    category: 'Matrícula',
    label: 'Trámites',
  },
  {
    id: 'evidence-deadline',
    title: 'Organiza la entrega de evidencias de aprendizaje',
    summary: 'Revisa las indicaciones de cada curso y conserva una copia de tus archivos antes de enviarlos.',
    detail: 'Cada actividad puede tener un formato y una fecha distintos. Consulta el aula virtual para confirmar los requisitos vigentes de tu sección.',
    category: 'Estudiantes',
    label: 'Recomendación',
  },
  {
    id: 'account-security',
    title: 'Protege tu cuenta y tus datos personales',
    summary: 'Usa una contraseña personal y evita compartir códigos de verificación o enlaces de acceso.',
    detail: 'Si sospechas que otra persona ingresó a tu cuenta, cambia tu contraseña y comunícate con soporte para recibir ayuda.',
    category: 'Seguridad',
    label: 'Seguridad',
  },
];

const tutorialsData: HelpTutorial[] = [
  {
    id: 'start-platform',
    title: 'Guía completa: ingresa y navega por tu Aula Virtual SIGE-JL',
    summary: 'Aprende a iniciar sesión, ubicar tus cursos y revisar las herramientas disponibles desde computadora o celular.',
    category: 'Primeros pasos',
    duration: '06:42',
    views: '2.4 mil',
    image: '/help/tutorial-01.jpg',
    imageAlt: 'Estudiante revisando el aula virtual desde una computadora portátil.',
    featured: true,
  },
  {
    id: 'upload-homework',
    title: 'Cómo subir tareas y adjuntar archivos PDF',
    summary: 'Prepara tus archivos y confirma que la entrega quedó registrada correctamente.',
    category: 'Tareas y evaluaciones',
    duration: '03:20',
    views: '1.8 mil',
    image: '/help/tutorial-02.jpg',
    imageAlt: 'Estudiante preparando una tarea digital en el aula virtual.',
  },
  {
    id: 'online-assessments',
    title: 'Rinde evaluaciones y cuestionarios en línea',
    summary: 'Revisa las indicaciones, el tiempo disponible y el envío de tus respuestas.',
    category: 'Tareas y evaluaciones',
    duration: '04:15',
    views: '1.2 mil',
    image: '/help/tutorial-03.jpg',
    imageAlt: 'Evaluación académica en línea mostrada en la pantalla de una computadora.',
  },
  {
    id: 'grades',
    title: 'Consulta tus calificaciones y competencias',
    summary: 'Encuentra tus resultados y comprende los niveles de logro de cada curso.',
    category: 'Libreta de notas',
    duration: '02:45',
    views: '960',
    image: '/help/tutorial-04.jpg',
    imageAlt: 'Reporte académico con niveles de logro y calificaciones.',
  },
  {
    id: 'attendance',
    title: 'Revisa tu asistencia y presenta una justificación',
    summary: 'Consulta tus registros y conoce qué información debes compartir si faltaste a clases.',
    category: 'Asistencia',
    duration: '03:08',
    views: '1.5 mil',
    image: '/help/tutorial-05.jpg',
    imageAlt: 'Estudiante adulta revisando información académica desde su celular.',
  },
  {
    id: 'teacher-portal',
    title: 'Portal docente: sesiones, foros y evidencias',
    summary: 'Recorrido por las herramientas que el equipo docente utiliza en sus cursos.',
    category: 'Aula virtual',
    duration: '05:12',
    views: '420',
    image: '/help/tutorial-06.jpg',
    imageAlt: 'Docente revisando actividades y criterios de evaluación en su computadora.',
  },
  {
    id: 'payments',
    title: 'Consulta pagos y comprobantes de pensión',
    summary: 'Ubica tus comprobantes y revisa las indicaciones de pago comunicadas por la institución.',
    category: 'Pagos y pensiones',
    duration: '02:58',
    views: '870',
    image: '/help/tutorial-07.jpg',
    imageAlt: 'Comprobante de pago digital consultado desde un dispositivo móvil.',
  },
];

const guidesData: HelpGuide[] = [
  { id: 'student-induction', title: 'Manual de inducción del estudiante EBA', summary: 'Conoce la organización del aula virtual, los cursos y las herramientas de aprendizaje.', pages: 24, size: '3.8 MB', label: 'Actualizado' },
  { id: 'tasks-and-forums', title: 'Guía rápida para enviar tareas y participar en foros', summary: 'Pasos para adjuntar archivos y participar en las actividades de tus cursos.', pages: 8, size: '1.2 MB', label: 'Nuevo' },
  { id: 'family-portal', title: 'Manual de seguimiento académico y pensiones', summary: 'Orientación para consultar calificaciones, asistencia y comunicaciones.', pages: 16, size: '2.5 MB', label: 'Familias' },
  { id: 'digital-security', title: 'Protocolo de seguridad y recuperación de acceso', summary: 'Recomendaciones para cuidar tus credenciales y recuperar tu cuenta.', pages: 6, size: '980 KB', label: 'Seguridad' },
];

const filterByQuery = <T extends { title: string; summary: string }>(items: T[], query: string): T[] => {
  const normalizedQuery = query.trim().toLocaleLowerCase('es');
  if (!normalizedQuery) return items;
  return items.filter((item) => `${item.title} ${item.summary}`.toLocaleLowerCase('es').includes(normalizedQuery));
};

export const useHelpCenter = (): HelpCenterViewModel => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<HelpCenterTab>('all');
  const [activeTopic, setActiveTopic] = useState<HelpTopic>('Todos los videos');

  const announcements = useMemo(() => filterByQuery(announcementsData, query), [query]);
  const tutorials = useMemo(() => {
    const topicItems = activeTopic === 'Todos los videos' ? tutorialsData : tutorialsData.filter((item) => item.category === activeTopic);
    return filterByQuery(topicItems, query);
  }, [activeTopic, query]);
  const guides = useMemo(() => filterByQuery(guidesData, query), [query]);

  return {
    query,
    activeTab,
    activeTopic,
    announcements,
    tutorials,
    guides,
    counts: { all: announcementsData.length + tutorialsData.length + guidesData.length, announcements: announcementsData.length, videos: tutorialsData.length, guides: guidesData.length },
    updateQuery: setQuery,
    selectTab: setActiveTab,
    selectTopic: setActiveTopic,
  };
};
