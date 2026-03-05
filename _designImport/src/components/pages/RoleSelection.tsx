import { Card } from '../Card';
import { User, Users, Building, Shield } from 'lucide-react';
import atkore_logo from 'figma:asset/da94439ed416b071fd1ce08757d2dfe2a73c226e.png';

interface RoleSelectionProps {
  onSelectRole: (role: string) => void;
}

export function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  const roles = [
    {
      id: 'auditor',
      icon: User,
      title: 'Auditor',
      description: 'Conduct audits, answer questions, and document non-conformances',
      color: 'bg-[#4CAC48]',
    },
    {
      id: 'department-owner',
      icon: Users,
      title: 'Department Owner',
      description: 'Review and close actions, track department performance',
      color: 'bg-[#7BCF73]',
    },
    {
      id: 'plant-manager',
      icon: Building,
      title: 'Plant Manager',
      description: 'View plant-wide dashboards, audit results, and trends',
      color: 'bg-[#3A7A36]',
    },
    {
      id: 'super-user',
      icon: Shield,
      title: 'Super User',
      description: 'Manage questions, scheduling, roles, and system configuration',
      color: 'bg-[#2D5A29]',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F8F5] flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img src={atkore_logo} alt="Atkore" className="w-16 h-16" />
        </div>
        <h1 className="mb-2">Atkore LPA</h1>
        <p className="text-[#605E5C]">Process Audit System</p>
      </div>

      {/* Role Cards */}
      <div className="w-full max-w-4xl">
        <h2 className="mb-4 text-center">Select Your Role</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card
                key={role.id}
                onClick={() => onSelectRole(role.id)}
                className="cursor-pointer hover:shadow-lg transition-all p-6"
              >
                <div className="flex items-start gap-4">
                  <div className={`${role.color} w-12 h-12 rounded-lg flex items-center justify-center shrink-0`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2">{role.title}</h3>
                    <p className="text-sm text-[#605E5C]">{role.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Design System Link */}
      <div className="mt-8">
        <button
          onClick={() => onSelectRole('design-system')}
          className="text-sm text-[#4CAC48] hover:underline"
        >
          View Design System
        </button>
      </div>
    </div>
  );
}