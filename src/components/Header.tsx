import React, { useState } from 'react';
import { ScreenType } from '../types';

interface HeaderProps {
  currentScreen: ScreenType;
  userEmail: string;
  onLogout: () => void;
  onNavigateHome: () => void;
}

export const EMBLEM_LOGO_URL =
  'https://lh3.googleusercontent.com/aida/AEtjO1V4cyTJ4r6V9dxTsI014ECNwQSZPC27JA6yUJv4Tj_YC0iTbqfVCq8Jpf4J72RlEmHiMApMmVDU6sdgrWSItPdRjPquEWbXFPfhnir0OB202f4WHxuf_14poqXEVuF9ncU4amyGc_9ya-0d09lQ0AbuPrQEVb0-2AIV7fUcDYWP7lJ7ISiujyN4mog7KwcZKQyo7Nd0ca3kQk4slI3ozGFeC5V3kRXcZe2u_4J7DK6egtQZXVpU3l8Wyyzg';

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  userEmail,
  onLogout,
  onNavigateHome,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  // Subtitle text varies according to screen shown in screenshots
  let subtitle = 'Audio Analysis';
  if (currentScreen === 'analyzing') {
    subtitle = 'Analyzing';
  } else if (currentScreen === 'result') {
    subtitle = 'Result';
  }

  return (
    <header className="w-full bg-[#ffffff]/90 backdrop-blur-xl border-b border-[#eaedff] shadow-[0_1px_8px_rgba(0,0,0,0.03)] sticky top-0 z-40">
      <div className="h-16 px-4 md:px-6 flex items-center justify-between max-w-4xl mx-auto">
        {/* Brand */}
        <div
          onClick={onNavigateHome}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <img
            alt="Deep Audio Detector Emblem"
            className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            src={EMBLEM_LOGO_URL}
          />
          <div className="flex flex-col">
            <span className="font-headline font-semibold text-[17px] text-[#131b2e] tracking-tight leading-none">
              Deep Audio Detector
            </span>
            <span className="text-[11px] text-[#434655] font-normal leading-tight mt-1">
              {subtitle}
            </span>
          </div>
        </div>

        {/* Profile Avatar / Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            aria-label="User Account"
            className="w-8 h-8 rounded-full bg-[#004ac6] flex items-center justify-center text-white shadow-sm hover:opacity-90 active:scale-95 transition-all focus:outline-none"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#dae2fd] p-3 text-sm z-50 animate-in fade-in zoom-in-95">
              <div className="px-2 py-1.5 border-b border-[#eaedff]">
                <p className="text-xs text-[#737686] font-medium">Signed in as</p>
                <p className="font-semibold text-[#131b2e] truncate">{userEmail}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-[#006c49]"></span>
                  <span className="text-[11px] text-[#006c49] font-medium">Forensic Analyst Level III</span>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onNavigateHome();
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#f2f3ff] text-[#131b2e] text-xs flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#004ac6]">biotech</span>
                  Analyze Audio File
                </button>
              </div>

              <div className="pt-1 border-t border-[#eaedff]">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onLogout();
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-red-50 text-[#ab0b1c] text-xs font-medium flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
