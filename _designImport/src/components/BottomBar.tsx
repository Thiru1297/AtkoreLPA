interface BottomBarProps {
  children: React.ReactNode;
  className?: string;
}

export function BottomBar({ children, className = '' }: BottomBarProps) {
  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-[rgba(0,0,0,0.12)] p-4 z-40 ${className}`}>
      {children}
    </div>
  );
}
