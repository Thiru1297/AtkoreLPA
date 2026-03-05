// @ts-nocheck
import { useEffect, useRef, useState } from 'react';
import svgPaths from "../imports/svg-6lw8ayvq40";
import { useLpaAppContext } from '../../../context/LpaAppContext';

function WaffleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="2.5" cy="2.5" r="1.2" fill="white" />
      <circle cx="8" cy="2.5" r="1.2" fill="white" />
      <circle cx="13.5" cy="2.5" r="1.2" fill="white" />
      <circle cx="2.5" cy="8" r="1.2" fill="white" />
      <circle cx="8" cy="8" r="1.2" fill="white" />
      <circle cx="13.5" cy="8" r="1.2" fill="white" />
      <circle cx="2.5" cy="13.5" r="1.2" fill="white" />
      <circle cx="8" cy="13.5" r="1.2" fill="white" />
      <circle cx="13.5" cy="13.5" r="1.2" fill="white" />
    </svg>
  );
}

function SearchBar() {
  return (
    <div className="h-[30px] flex-1 max-w-[600px] mx-4 md:mx-8 bg-[#F3F2F1] rounded text-[#605E5C] flex items-center px-3 shadow-sm border border-transparent hover:border-[#8A8886] transition-colors cursor-text">
      <svg className="w-3.5 h-3.5 mr-2 text-[#605E5C]" viewBox="0 0 15 15" fill="none">
        <g>
          <path d={svgPaths.p17362d00} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p1508f700} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
      <span className="text-[13px] leading-none pt-0.5 opacity-70">Search this site</span>
    </div>
  );
}

function RightActions(props: {
  onOpenUserMenu: () => void;
  menuContainerRef: React.RefObject<HTMLDivElement>;
  isUserMenuOpen: boolean;
  closeUserMenu: () => void;
  showSettings: boolean;
  onOpenSettings: () => void;
}) {
  const [photoFailed, setPhotoFailed] = useState<boolean>(false);
  const pageContext: any = (window as any)?._spPageContextInfo || {};
  const loginName: string = pageContext.userLoginName || '';
  const email: string = pageContext.userEmail || '';
  const loginAlias: string = String(loginName || '').split('|').pop() || '';
  const aliasName: string = loginAlias.includes('@') ? loginAlias.split('@')[0] : loginAlias;
  const displayName: string = pageContext.userDisplayName || aliasName || 'User';
  const initials: string = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((x: string) => x[0]?.toUpperCase() || '')
    .join('') || 'U';
  const accountEmail: string = email || (loginAlias.includes('@') ? loginAlias : '');
  const photoUrl: string = accountEmail
    ? `${window.location.origin}/_layouts/15/userphoto.aspx?size=S&accountname=${encodeURIComponent(accountEmail)}`
    : '';

  return (
    <div className="flex items-center gap-1 md:gap-3 relative" ref={props.menuContainerRef}>
      {/* Notifications */}
      <button className="w-[30px] h-[30px] flex items-center justify-center relative hover:bg-white/10 rounded text-white">
        <svg className="w-[15px] h-[15px]" viewBox="0 0 15 15" fill="none">
           <g>
            <path d={svgPaths.p3b1e8f00} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
            <path d={svgPaths.p1799fbf0} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
           </g>
        </svg>
        <div className="absolute top-1 right-1 flex flex-col h-[12px] min-w-[12px] px-[2px] justify-center items-center bg-[#C5282E] rounded-full text-[8px] font-bold leading-none text-white border border-[#00375C]">
          3
        </div>
      </button>

      {/* Settings (Super User only) */}
      {props.showSettings ? (
        <button
          type="button"
          onClick={props.onOpenSettings}
          className="w-[30px] h-[30px] flex items-center justify-center hover:bg-white/10 rounded text-white"
          title="Settings"
          aria-label="Settings"
          data-lpa-custom-settings="true"
        >
          <svg className="w-[15px] h-[15px]" viewBox="0 0 15 15" fill="none">
            <g>
              <path d={svgPaths.pb2c500} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
              <path d={svgPaths.p23e4c6c0} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
            </g>
          </svg>
        </button>
      ) : null}

      {/* Help */}
      <button className="w-[30px] h-[30px] flex items-center justify-center hover:bg-white/10 rounded text-white">
        <svg className="w-[15px] h-[15px]" viewBox="0 0 15 15" fill="none">
          <g>
            <path d={svgPaths.pcf03f00} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
            <path d={svgPaths.p203651c0} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
            <path d="M7.50002 10.625H7.50668" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          </g>
        </svg>
      </button>

      {/* Profile */}
      <button type="button" onClick={props.onOpenUserMenu} className="flex items-center gap-1 pl-1 pr-2 h-[30px] hover:bg-white/10 rounded group">
        {photoUrl && !photoFailed ? (
          <img
            src={photoUrl}
            alt={displayName}
            className="w-[24px] h-[24px] rounded-full border border-white/20 object-cover"
            onError={() => setPhotoFailed(true)}
          />
        ) : (
          <div className="w-[24px] h-[24px] bg-[#4F6BED] rounded-full flex items-center justify-center text-white text-[10px] font-semibold border border-white/20">
            {initials}
          </div>
        )}
        <svg className="w-[10px] h-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 15 15" fill="none">
           <path d={svgPaths.p3ffab900} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </svg>
      </button>

      {props.isUserMenuOpen ? (
        <div className="fixed right-[12px] top-[48px] w-[340px] bg-white border border-[#E1DFDD] shadow-2xl text-[#201F1E] z-[1000]">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#EDEBE9]">
            <span className="text-[24px] leading-none text-[#605E5C]">{displayName.split(' ')[0]}</span>
            <a href={`${window.location.origin}/_layouts/15/SignOut.aspx`} className="text-[24px] leading-none text-[#323130] no-underline" title="Sign out">
              Sign out
            </a>
          </div>
          <div className="px-5 py-4 border-b border-[#EDEBE9]">
            <div className="flex gap-4">
              {photoUrl && !photoFailed ? (
                <img
                  src={photoUrl}
                  alt={displayName}
                  className="w-[90px] h-[90px] rounded-full border border-[#8A8886] object-cover"
                  onError={() => setPhotoFailed(true)}
                />
              ) : (
                <div className="w-[90px] h-[90px] rounded-full border border-[#8A8886] flex items-center justify-center text-[38px] text-[#323130]">{initials}</div>
              )}
              <div className="min-w-0">
                <div className="text-[34px] font-semibold leading-none text-[#323130]">{displayName}</div>
                <div className="text-[16px] text-[#323130] truncate mt-2">{accountEmail}</div>
                <a href="https://www.office.com/account/" target="_blank" rel="noopener noreferrer" className="block mt-2 text-[#115EA3] text-[16px] underline">View account</a>
                <div className="flex items-center justify-between mt-2">
                  <a href="https://myaccount.microsoft.com/" target="_blank" rel="noopener noreferrer" className="text-[#115EA3] text-[16px] underline">My Microsoft 365 profile</a>
                  <span className="text-[#605E5C] text-[20px] leading-none">&hellip;</span>
                </div>
              </div>
            </div>
          </div>
          <button type="button" onClick={props.closeUserMenu} className="w-full text-left px-5 py-4 hover:bg-[#F3F2F1] text-[16px] text-[#323130] flex items-center gap-3">
            <span className="w-[42px] h-[42px] rounded-full border border-[#8A8886] inline-flex items-center justify-center text-[#605E5C]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="10" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3.5 18C3.5 14.9 6.1 12.5 9.2 12.5H10.8C13.9 12.5 16.5 14.9 16.5 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M18.5 9V15M15.5 12H21.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
            <span>Sign in with a different account</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function SharePointHeader() {
  const { role } = useLpaAppContext();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const userMenuContainerRef = useRef<HTMLDivElement>(null);
  const isSuperUser: boolean = role === 'super-user';

  const openM365Launcher = () => {
    const nativeLauncher: HTMLElement | null = document.getElementById('O365_MainLink_NavMenu');
    if (nativeLauncher) {
      nativeLauncher.click();
      return;
    }

    window.open('https://www.office.com/apps', '_blank', 'noopener,noreferrer');
  };

  const openSharePointSettings = () => {
    const selectors: string[] = [
      '#O365_MainLink_Settings',
      '#O365_MainLink_Settings_container button',
      'button[data-automationid="SettingsButton"]',
      'button[data-automation-id="SettingsButton"]',
      'button[aria-label="Settings"]',
      'button[title="Settings"]'
    ];

    for (const selector of selectors) {
      const element: HTMLElement | null = document.querySelector(selector);
      if (!element) {
        continue;
      }
      if (element.getAttribute('data-lpa-custom-settings') === 'true') {
        continue;
      }

      element.click();
      return;
    }

    window.open(`${window.location.origin}/_layouts/15/settings.aspx`, '_blank', 'noopener,noreferrer');
  };

  const handleOpenUserMenu = () => {
    setIsUserMenuOpen((v) => !v);
  };

  useEffect(() => {
    const onClickOutside = (evt: MouseEvent) => {
      if (!isUserMenuOpen) {
        return;
      }
      const target: Node | null = evt.target as Node;
      if (userMenuContainerRef.current && target && !userMenuContainerRef.current.contains(target)) {
        setIsUserMenuOpen(false);
      }
    };

    const onEsc = (evt: KeyboardEvent) => {
      if (evt.key === 'Escape') {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, [isUserMenuOpen]);

  return (
    <div className="fixed left-0 right-0 top-0 z-[100] hidden justify-center md:flex">
      <div className="h-[48px] w-full max-w-7xl bg-[rgb(76,172,72)] items-center justify-between px-3 shadow-md font-['Segoe_UI',sans-serif] md:flex">
        {/* Left: Waffle + Title */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            title="Microsoft 365 apps"
            aria-label="Microsoft 365 apps"
            onClick={openM365Launcher}
            className="w-[48px] h-[48px] flex items-center justify-center -ml-3 hover:bg-white/10 transition-colors"
          >
              <WaffleIcon />
          </button>
          <span className="text-white font-semibold text-[14px] tracking-wide">SharePoint</span>
        </div>

        {/* Center: Search */}
        <div className="flex-1 flex justify-center px-4">
          <SearchBar />
        </div>

        {/* Right: Actions */}
        <RightActions
          onOpenUserMenu={handleOpenUserMenu}
          menuContainerRef={userMenuContainerRef}
          isUserMenuOpen={isUserMenuOpen}
          closeUserMenu={() => setIsUserMenuOpen(false)}
          showSettings={isSuperUser}
          onOpenSettings={openSharePointSettings}
        />
      </div>
    </div>
  );
}

