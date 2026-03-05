// @ts-nocheck
import { User, Users, Building, Shield } from 'lucide-react';
import atkore_logo from '../../assets/da94439ed416b071fd1ce08757d2dfe2a73c226e.png';

interface RoleLoadingScreenProps {
  role: string;
}

export function RoleLoadingScreen({ role }: RoleLoadingScreenProps) {
  const roleConfig = {
    'auditor': {
      icon: User,
      title: 'Auditor',
      color: 'bg-[#4CAC48]',
      message: 'Preparing your audit schedule...',
    },
    'department-owner': {
      icon: Users,
      title: 'Department Owner',
      color: 'bg-[#7BCF73]',
      message: 'Loading your department actions...',
    },
    'plant-manager': {
      icon: Building,
      title: 'Plant Manager',
      color: 'bg-[#3A7A36]',
      message: 'Preparing your plant dashboard...',
    },
    'super-user': {
      icon: Shield,
      title: 'Super User',
      color: 'bg-[#2D5A29]',
      message: 'Loading system administration...',
    },
  };

  const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.auditor;
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-[#F5F8F5] flex flex-col items-center justify-center p-4">
      <div className="text-center">
        {/* Logo/Brand */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <img src={atkore_logo} alt="Atkore" className="w-10 h-10" />
          <span className="text-[#323130] tracking-tight">Atkore LPA</span>
        </div>

        {/* Role Icon with Animation */}
        <div className="mb-6 relative">
          {/* Pulsing background rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`${config.color} w-24 h-24 rounded-full opacity-20 animate-ping`} style={{ animationDuration: '2s' }}></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`${config.color} w-20 h-20 rounded-full opacity-30 animate-pulse`}></div>
          </div>
          
          {/* Main icon container */}
          <div className="relative flex items-center justify-center">
            <div 
              className={`${config.color} w-20 h-20 rounded-2xl flex items-center justify-center shadow-md`}
              style={{
                boxShadow: '0 2.8px 2.2px rgba(0, 0, 0, 0.02), 0 6.7px 5.3px rgba(0, 0, 0, 0.028), 0 12.5px 10px rgba(0, 0, 0, 0.035)',
              }}
            >
              <Icon size={32} className="text-white" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Loading Message */}
        <div className="mb-8">
          <h2 className="mb-2 text-[#323130]">{config.message}</h2>
          <p className="text-sm text-[#605E5C]">This will only take a moment</p>
        </div>

        {/* Modern Loading Indicator */}
        <div className="flex items-center justify-center gap-2">
          <div 
            className={`w-2 h-2 ${config.color} rounded-full animate-bounce`}
            style={{ animationDelay: '0ms', animationDuration: '1.4s' }}
          ></div>
          <div 
            className={`w-2 h-2 ${config.color} rounded-full animate-bounce`}
            style={{ animationDelay: '200ms', animationDuration: '1.4s' }}
          ></div>
          <div 
            className={`w-2 h-2 ${config.color} rounded-full animate-bounce`}
            style={{ animationDelay: '400ms', animationDuration: '1.4s' }}
          ></div>
        </div>

        {/* Progress bar alternative (commented out, can be used instead of dots) */}
        {/* <div className="w-64 h-1 bg-[#E1DFDD] rounded-full overflow-hidden mx-auto">
          <div 
            className={`h-full ${config.color} rounded-full animate-pulse`}
            style={{ 
              width: '60%',
              animation: 'loading-progress 1.5s ease-in-out infinite'
            }}
          ></div>
        </div> */}
      </div>

      {/* Optional: Role badge at bottom */}
      <div className="absolute bottom-8">
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
          <div className={`w-2 h-2 ${config.color} rounded-full animate-pulse`}></div>
          <span className="text-xs text-[#605E5C]">Loading as {config.title}</span>
        </div>
      </div>
    </div>
  );
}

