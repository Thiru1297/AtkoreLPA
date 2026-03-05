// @ts-nocheck
import * as React from 'react';
interface BadgeProps {
  variant: 'accepted' | 'pending' | 'denied' | 'in-progress' | 'submitted' | 'completed' | 'closed' | 'overdue' | 'default' | 'warning' | 'open' | 'priority-high' | 'priority-medium' | 'priority-low' | 'success' | 'secondary';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant, children, className = '' }: BadgeProps) {
  const variants = {
    'accepted': 'bg-[#EEF7EE] text-[#2D5A29] border-[#D4ECD2]',
    'pending': 'bg-surface text-text-secondary border-[#E0E0E0]',
    'denied': 'bg-[#FEF0F1] text-destructive border-[#F5D0D3]',
    'in-progress': 'bg-[#E6F4FF] text-[#0078D4] border-[#C7E3FF]',
    'submitted': 'bg-[#FFF4E5] text-[#D97706] border-[#F59E0B]',
    'completed': 'bg-[#E8F5E9] text-[#1B5E20] border-[#A5D6A7]',
    'closed': 'bg-[#F5F5F5] text-[#424242] border-[#E0E0E0]',
    'overdue': 'bg-[#FEF0F1] text-destructive border-[#F5D0D3]',
    'default': 'bg-surface text-text-secondary border-[#E0E0E0]',
    'warning': 'bg-[#FFF9F0] text-[#C87B16] border-[#FFE7C7]',
    'open': 'bg-[#FFF9F0] text-[#E65100] border-[#FFD699]',
    'priority-high': 'bg-[#FFE5E5] text-[#D32F2F] border-[#FFCDD2]',
    'priority-medium': 'bg-[#FFF4E5] text-[#F57C00] border-[#FFE0B2]',
    'priority-low': 'bg-[#E3F2FD] text-[#1976D2] border-[#BBDEFB]',
    'success': 'bg-[#EEF7EE] text-[#2D5A29] border-[#D4ECD2]',
    'secondary': 'bg-surface text-text-secondary border-[#E0E0E0]'
  };
  
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

