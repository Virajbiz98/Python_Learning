import { DivideIcon as LucideIcon } from 'lucide-react';
import FeatureCanvas from './FeatureCanvas';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: typeof LucideIcon;
  color?: string;
}

function FeatureCard({
  title,
  description,
  icon: Icon,
  color = '#39FF14'
}: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '-50px 0px',
  });

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      ref={ref}
      className={`card p-8 transition-all duration-300 group relative overflow-hidden cursor-pointer bg-gray-800 rounded-2xl hover:border-[#39FF14]/50 hover:shadow-[#39FF14]/20 hover:scale-110 ${
        isHovered ? 'scale-105 shadow-lg' : ''
      } ${inView ? 'scroll-fade-in' : 'scroll-fade-out'} hover:[transform:rotateX(3deg)_rotateY(2deg)_perspective(1000px)] w-[320px] h-[220px]`}
      style={{
        perspective: '1000px',
        transform: `rotateX(${isHovered ? '5deg' : '0deg'}) rotateY(${
          isHovered ? '5deg' : '0deg'
        })`,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
        backdropFilter: 'blur(10px)'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 opacity-05">
        <FeatureCanvas color={color} />
      </div>
      <div className="relative z-10">
        <div className="p-3 rounded-lg inline-flex mb-4 group-hover:bg-[#39FF14]/10 transition-colors">
          <Icon className="h-6 w-6 text-[#39FF14]/80" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-300 transition-opacity duration-300">{description}</p>
      </div>
    </div>
  );
}

export default FeatureCard;
