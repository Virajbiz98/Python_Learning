import { useEffect, useRef } from 'react';

interface FeatureCanvasProps {
  color: string;
}

function FeatureCanvas({ color }: FeatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Particle system
    const particles: {
      x: number;
      y: number;
      size: number;
      baseX: number;
      baseY: number;
      density: number;
    }[] = [];
    
    // Mouse
    const mouse = {
      x: null as number | null,
      y: null as number | null,
      radius: 100
    };
    
    // Create particles
    const createParticles = () => {
      const particleCount = Math.min(50, (canvas.width * canvas.height) / 8000);
      const gap = Math.sqrt((canvas.width * canvas.height) / particleCount);
      
      for (let y = 0; y < canvas.height; y += gap) {
        for (let x = 0; x < canvas.width; x += gap) {
          particles.push({
            x: x + Math.random() * gap,
            y: y + Math.random() * gap,
            size: Math.random() * 2 + 1,
            baseX: x,
            baseY: y,
            density: Math.random() * 30 + 1
          });
        }
      }
    };
    
    createParticles();
    
    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    // Animation
    let animationFrameId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        let dx = 0;
        let dy = 0;
        let distance = 0;
        let forceDirectionX = 0;
        let forceDirectionY = 0;
        let force = 0;
        
        // Mouse repulsion
        if (mouse.x !== null && mouse.y !== null) {
          dx = mouse.x - particle.x;
          dy = mouse.y - particle.y;
          distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouse.radius) {
            force = (mouse.radius - distance) / mouse.radius;
            forceDirectionX = dx / distance;
            forceDirectionY = dy / distance;
            
            particle.y -= forceDirectionY * force * particle.density;
          }
        }
        
        // Return to base position
        dx = particle.baseX - particle.x;
        dy = particle.baseY - particle.y;
        distance = Math.sqrt(dx * dx + dy * dy);
        
        force = distance / 15;
        if (force < 1) force = 1;
        
        forceDirectionX = dx / distance;
        forceDirectionY = dy / distance;
        
        particle.x += forceDirectionX * force;
        particle.y += forceDirectionY * force;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = color + 'CC';
        ctx.fill();
        
        // Draw connections
        particles.forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 50) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            const alpha = (1 - distance / 50) * 0.2;
            ctx.strokeStyle = `${color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
            ctx.stroke();
          }
        });
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color]);
  
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export default FeatureCanvas;