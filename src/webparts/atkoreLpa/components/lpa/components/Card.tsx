// @ts-nocheck
import * as React from 'react';
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  status?: 'NC' | 'Compliant' | 'N/A';
  stickyHeader?: React.ReactNode;
  headerExpanded?: boolean;
  onHeaderClick?: () => void;
  // Navigation props for detail pages
  onNavigate?: (page: string, params?: any) => void;
  navigateTo?: string;
  navigationParams?: any;
}

export function Card({
  children,
  className = '',
  status,
  onClick,
  stickyHeader,
  headerExpanded,
  onHeaderClick,
  onNavigate,
  navigateTo,
  navigationParams,
}: CardProps) {
  const baseStyles = "bg-white rounded-lg border border-[rgba(0,0,0,0.12)] transition-all duration-200";
  const clickableStyles = (onClick || (onNavigate && navigateTo)) ? "cursor-pointer hover:shadow-md active:scale-[0.99]" : "";

  // Handle navigation click
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (onNavigate && navigateTo) {
      onNavigate(navigateTo, navigationParams);
    }
  };

  // If stickyHeader is provided, use accordion pattern
  if (stickyHeader) {
    return (
      <div className={`w-full ${baseStyles} ${className} relative overflow-hidden`}>
        {/* Sticky Header */}
        <div 
          className={`p-4 cursor-pointer transition-all ${headerExpanded ? 'sticky top-0 z-10 bg-white shadow-md' : ''}`}
          onClick={onHeaderClick}
          role="button"
          tabIndex={0}
        >
          {stickyHeader}
        </div>
        
        {/* Content */}
        {headerExpanded && (
          <div className="px-4 pb-4 mt-[-18px] mr-[0px] mb-[0px] ml-[0px]" onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        )}
      </div>
    );
  }

  // Regular card pattern
  return (
    <div 
      className={`w-full ${baseStyles} ${clickableStyles} ${className} relative p-4`}
      onClick={handleClick}
      role={onClick || (onNavigate && navigateTo) ? "button" : undefined}
      tabIndex={onClick || (onNavigate && navigateTo) ? 0 : undefined}
    >
      {children}
    </div>
  );
}

export function KPICard({ label, value, trend }: { label: string; value: string | number; trend?: string }) {
  return (
    <Card>
      <div className="flex flex-col gap-1.5">
        <p className="text-xs text-text-muted">{label}</p>
        <p className="text-2xl font-medium text-text">{value}</p>
      </div>
    </Card>
  );
}

