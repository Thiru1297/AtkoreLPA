import { Menu, LogOut, HelpCircle } from 'lucide-react';
import svgPaths from '../imports/svg-s5fmhic07j';
import atkore_logo from 'figma:asset/da94439ed416b071fd1ce08757d2dfe2a73c226e.png';

interface AppHeaderProps {
  title: string;
  onMenuClick?: () => void;
  showMenu?: boolean;
  actions?: React.ReactNode;
  onExit?: () => void;
  onBack?: () => void;
}

export function AppHeader({ title, onMenuClick, showMenu = false, actions, onExit, onBack }: AppHeaderProps) {
  return (
    <header className="sticky top-0 md:top-[48px] z-40 h-14 md:h-16 flex items-center bg-[#4CAC48] md:bg-white border-b md:border-[rgba(0,0,0,0.12)] shadow-sm md:shadow-none text-white md:text-[#1B1B1B]">
      
      {/* MOBILE VIEW */}
      <div className="flex md:hidden w-full items-center justify-between px-4 h-full">
        <div className="flex items-center gap-3">
          {/* Back Arrow (Functions as Back or Exit/Logout) */}
          <button 
            onClick={onBack || onExit}
            className="flex items-center justify-center p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label={onBack ? "Go back" : "Log out"}
          >
             <svg className="w-[22px] h-[15px] rotate-180" viewBox="0 0 22 15" fill="none">
               <path d={svgPaths.p26df7d00} fill="currentColor" />
             </svg>
          </button>
          
          <span className="text-[19px] font-semibold tracking-tight">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-1">
           {/* Search Icon (Mobile) */}
           <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path d="M14 14L11.1067 11.1067" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                <path d={svgPaths.p107a080} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
              </svg>
           </button>
           
           {/* More Icon (Mobile) */}
           <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
              <svg className="w-[3px] h-[14px]" viewBox="0 0 3 14" fill="none">
                <circle cx="1.3" cy="1.3" r="1.3" fill="currentColor" />
                <circle cx="1.3" cy="6.9" r="1.3" fill="currentColor" />
                <circle cx="1.3" cy="12.5" r="1.3" fill="currentColor" />
              </svg>
           </button>
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden md:flex w-full items-center px-6">
        <div className="flex items-center gap-3 md:gap-4 flex-1">
          <div className="flex items-center gap-2 md:gap-3">
            <img src={atkore_logo} alt="Atkore" className="w-10 h-10 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[#4CAC48] font-medium text-base">Atkore LPA</span>
              <span className="text-xs text-[#605E5C]">{title}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {actions}
          <button
            className="p-2 hover:bg-gray-100 rounded"
            aria-label="Help"
          >
            <HelpCircle size={18} className="text-[#605E5C]" />
          </button>
          {onExit && (
            <button
              onClick={onExit}
              className="p-2 hover:bg-gray-100 rounded"
              aria-label="Exit"
              title="Exit to role selection"
            >
              <LogOut size={18} className="text-[#605E5C]" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
