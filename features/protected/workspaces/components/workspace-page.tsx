import type { JSX } from 'react';
import { EnrollmentScreen } from './enrollment-screen';
import { AttendanceScreen } from './attendance-screen';
import { EvaluationScreen } from './evaluation-screen';
import { ClassroomsScreen } from './classrooms-screen';
import { AlertsScreen } from './alerts-screen';
import { StudentsScreen } from './students-screen';
import { AcademicsScreen } from './academics-screen';

const screens = {
  enrollment: EnrollmentScreen,
  attendance: AttendanceScreen,
  evaluation: EvaluationScreen,
  classrooms: ClassroomsScreen,
  alerts: AlertsScreen,
  students: StudentsScreen,
  academics: AcademicsScreen,
};

const WorkspaceRoute = ({ slug }: { slug: string }): JSX.Element => {
  const Screen = screens[slug as keyof typeof screens];
  if (!Screen)
    return (
      <main className="min-w-0 flex-1 p-6">
        <p className="text-sm text-muted-foreground">Este módulo está en preparación.</p>
      </main>
    );
  return <Screen />;
};

export { WorkspaceRoute };
