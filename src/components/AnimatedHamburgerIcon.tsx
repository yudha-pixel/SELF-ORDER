// src/components/AnimatedHamburgerIcon.tsx
export default function AnimatedHamburgerIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="w-6 h-6 flex flex-col justify-center items-center">
      <div className="w-full relative">
        {/* Top line */}
        <div className={`w-5 h-0.5 bg-[#84482b] transform transition-all duration-300 ease-in-out ${
          isOpen ? 'rotate-45 translate-y-1.5' : 'rotate-0 translate-y-0'
        }`} />
        
        {/* Middle line */}
        <div className={`w-5 h-0.5 bg-[#84482b] transform transition-all duration-300 ease-in-out mt-1 ${
          isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
        }`} />
        
        {/* Bottom line */}
        <div className={`w-5 h-0.5 bg-[#84482b] transform transition-all duration-300 ease-in-out mt-1 ${
          isOpen ? '-rotate-45 -translate-y-1.5' : 'rotate-0 translate-y-0'
        }`} />
      </div>
    </div>
  );
}