import atkoreLogo from '../assets/da94439ed416b071fd1ce08757d2dfe2a73c226e.png';

export function CustomFooter() {
  return (
    <footer className="hidden w-full border-t border-[#E1DFDD] bg-white px-4 py-3 md:block md:px-6">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-center gap-3">
        <img src={atkoreLogo} alt="Atkore" className="h-7 w-7 object-contain" />
        <p className="text-[12px] text-[#605E5C]">
          Atkore&reg; is a registered trademark of Atkore Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
