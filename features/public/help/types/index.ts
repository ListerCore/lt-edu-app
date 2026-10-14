export type HelpCenterTab = 'all' | 'announcements' | 'videos' | 'guides';

export type HelpTopic = 'Todos los videos' | 'Primeros pasos' | 'Aula virtual' | 'Tareas y evaluaciones' | 'Asistencia' | 'Libreta de notas' | 'Pagos y pensiones' | 'Seguridad';

export interface HelpAnnouncement {
  id: string;
  title: string;
  summary: string;
  detail: string;
  category: string;
  label: string;
  featured?: boolean;
}

export interface HelpTutorial {
  id: string;
  title: string;
  summary: string;
  category: Exclude<HelpTopic, 'Todos los videos'>;
  duration: string;
  views: string;
  image: string;
  imageAlt: string;
  featured?: boolean;
}

export interface HelpGuide {
  id: string;
  title: string;
  summary: string;
  pages: number;
  size: string;
  label: string;
}

export interface HelpCenterViewModel {
  query: string;
  activeTab: HelpCenterTab;
  activeTopic: HelpTopic;
  announcements: HelpAnnouncement[];
  tutorials: HelpTutorial[];
  guides: HelpGuide[];
  counts: Record<HelpCenterTab, number>;
  updateQuery: (value: string) => void;
  selectTab: (tab: HelpCenterTab) => void;
  selectTopic: (topic: HelpTopic) => void;
}
