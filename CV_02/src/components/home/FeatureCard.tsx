import { DivideIcon as LucideIcon } from 'lucide-react';
import FeatureCanvas from './FeatureCanvas';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: typeof LucideIcon;
  color?: string;
}

import { useState } from 'react';

function FeatureCard({
  title,
  description,
  icon: Icon,
  color = '#1E3A8A'
}: FeatureCardProps) {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
    setMouseY(e.clientY - rect.top);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMouseX(0);
    setMouseY(0);
  };

  const cardWidth = 300; // Approximate card width
  const cardHeight = 200; // Approximate card height
  const maxTranslate = 10;

  const translateX = isHovered ? (mouseX - cardWidth / 2) / (cardWidth / 2) * maxTranslate : 0;
  const translateY = isHovered ? (mouseY - cardHeight / 2) / (cardHeight / 2) * maxTranslate : 0;

  return (
    <div
      className={`card p-8 transition-all duration-300 hover:border-primary-500/50 hover:blue-glow group relative overflow-hidden hover:translate-y-[-2px] hover:border-blue-500 hover:shadow-blue-500 cursor-pointer bg-gray-800/01 backdrop-blur-lg border border-gray-700/20 ${
       isClicked ? 'clicked' : ''
     }`}
      style={{
        perspective: '1000px',
        width: '320px',
        height: '220px'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 opacity-05">
        <FeatureCanvas color={color} />
      </div>
      <div className="relative z-10">
        <div className="p-3 bg-primary-500/02 rounded-lg inline-flex mb-4 group-hover:bg-primary-500/08 transition-colors">
          <Icon className="h-6 w-6 text-primary-500" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
}

export default FeatureCard;