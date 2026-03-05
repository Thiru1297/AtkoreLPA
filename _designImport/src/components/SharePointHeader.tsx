import svgPaths from "../imports/svg-6lw8ayvq40";

function WaffleIcon() {
  return (
    <div className="grid grid-cols-3 gap-[2px] w-[16px] h-[16px]">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="bg-white rounded-[1px] w-full h-full" />
      ))}
    </div>
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

function RightActions() {
  return (
    <div className="flex items-center gap-1 md:gap-3">
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

      {/* Settings */}
      <button className="w-[30px] h-[30px] flex items-center justify-center hover:bg-white/10 rounded text-white">
        <svg className="w-[15px] h-[15px]" viewBox="0 0 15 15" fill="none">
          <g>
            <path d={svgPaths.pb2c500} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
            <path d={svgPaths.p23e4c6c0} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          </g>
        </svg>
      </button>

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
      <button className="flex items-center gap-1 pl-1 pr-2 h-[30px] hover:bg-white/10 rounded group">
        <div className="w-[24px] h-[24px] bg-[#4F6BED] rounded-full flex items-center justify-center text-white text-[10px] font-semibold border border-white/20">
          R
        </div>
        <svg className="w-[10px] h-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 15 15" fill="none">
           <path d={svgPaths.p3ffab900} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </svg>
      </button>
    </div>
  );
}

export function SharePointHeader() {
  return (
    <div className="hidden md:flex fixed top-0 left-0 right-0 z-[100] h-[48px] bg-[rgb(76,172,72)] items-center justify-between px-3 shadow-md font-['Segoe_UI',sans-serif]">
      {/* Left: Waffle + Title */}
      <div className="flex items-center gap-4">
        <button className="w-[48px] h-[48px] flex items-center justify-center -ml-3 hover:bg-white/10 transition-colors">
            <WaffleIcon />
        </button>
        <span className="text-white font-semibold text-[14px] tracking-wide">SharePoint</span>
      </div>

      {/* Center: Search */}
      <div className="flex-1 flex justify-center px-4">
        <SearchBar />
      </div>

      {/* Right: Actions */}
      <RightActions />
    </div>
  );
}
