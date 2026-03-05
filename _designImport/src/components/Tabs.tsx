import { LucideIcon } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  count?: number;
  icon?: LucideIcon;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="border-b border-[rgba(0,0,0,0.12)]" role="tablist" aria-label="Navigation tabs">
      <div className="flex gap-8 md:gap-8 overflow-x-auto px-4 md:px-0 scrollbar-hide snap-x snap-mandatory">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onKeyDown={(e) => {
              const currentIndex = tabs.findIndex(t => t.id === tab.id);
              if (e.key === 'ArrowRight') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % tabs.length;
                onTabChange(tabs[nextIndex].id);
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                onTabChange(tabs[prevIndex].id);
              } else if (e.key === 'Home') {
                e.preventDefault();
                onTabChange(tabs[0].id);
              } else if (e.key === 'End') {
                e.preventDefault();
                onTabChange(tabs[tabs.length - 1].id);
              }
            }}
            className={`relative pb-3 text-sm font-medium whitespace-nowrap transition-colors snap-start focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm
              ${activeTab === tab.id 
                ? 'text-[#4CAC48]' 
                : 'text-[#605E5C] hover:text-[#1B1B1B]'
              }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="ml-1.5 text-[#605E5C]" aria-label={`${tab.count} items`}>
                {tab.count}
              </span>
            )}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4CAC48]" aria-hidden="true" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}