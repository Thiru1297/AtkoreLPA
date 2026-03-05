// @ts-nocheck
import svgPaths from "./svg-s5fmhic07j";

function Text() {
  return (
    <div className="content-stretch flex h-[19.992px] items-start relative shrink-0 w-[64.631px]" data-name="Text">
      <p className="font-['Segoe_UI:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[18px] text-nowrap text-white whitespace-pre">Actions</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[15px] items-center relative w-full">
        <div className="flex items-center justify-center relative shrink-0">
          <div className="flex-none rotate-[180deg]">
            <div className="h-0 relative w-[21px]">
              <div className="absolute bottom-[-7.36px] left-0 right-[-4.76%] top-[-7.36px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 15">
                  <path d={svgPaths.p26df7d00} fill="var(--stroke-0, white)" id="Line 1" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <Text />
      </div>
    </div>
  );
}

function Component() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Component 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Component 1">
          <path d="M14 14L11.1067 11.1067" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p107a080} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[33.977px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-center justify-center pb-[8px] pt-[7.997px] px-[7.997px] relative size-[33.977px]">
        <Component />
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute h-[13.8px] left-[calc(50%+0.47px)] top-[calc(50%+0.46px)] translate-x-[-50%] translate-y-[-50%] w-[2.6px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 14">
        <g id="Frame 3">
          <circle cx="1.3" cy="1.3" fill="var(--fill-0, white)" id="Ellipse 1" r="1.3" />
          <circle cx="1.3" cy="6.9" fill="var(--fill-0, white)" id="Ellipse 2" r="1.3" />
          <circle cx="1.3" cy="12.5" fill="var(--fill-0, white)" id="Ellipse 3" r="1.3" />
        </g>
      </svg>
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[17.984px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Frame />
    </div>
  );
}

function Button1() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[33.977px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start pb-0 pt-[7.997px] px-[7.997px] relative size-[33.977px]">
        <Icon />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[33.977px] relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-px h-[33.977px] items-center relative">
        <Button />
        <Button1 />
      </div>
    </div>
  );
}

export default function AppHeader() {
  return (
    <div className="bg-[#4cac48] relative size-full" data-name="AppHeader">
      <div aria-hidden="true" className="absolute border-[0px_0px_1.108px] border-[rgba(0,0,0,0.12)] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between pb-[1.108px] pt-[19px] px-[15.993px] relative size-full">
          <Frame1 />
          <Container />
        </div>
      </div>
    </div>
  );
}
