import { useEffect, useRef } from 'react';

function HeroSphere() {
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
    
    // Mouse position
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;
    
    // Particle configuration
    const particleCount = 500;
    const particles: {
      x: number;
      y: number;
      z: number;
      radius: number;
      color: string;
      opacity: number;
      speed: number;
    }[] = [];
    
    // Colors
    const colors = [
      '#10B981',
      '#6366F1',
      '#F59E0B',
    ];
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 150 + Math.random() * 50;
      
      particles.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        radius: 1 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0.1 + Math.random() * 0.5,
        speed: 0.01 + Math.random() * 0.02,
      });
    }
    
    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      targetRotationX = (mouseY / canvas.height - 0.5) * 2 * Math.PI;
      targetRotationY = (mouseX / canvas.width - 0.5) * 2 * Math.PI;
      console.log('Mouse position:', mouseX, mouseY);
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    let animationFrameId: number;
    let time = 0;
    
    const animate = () => {
      time += 0.005;
      
      // Smooth rotation
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Sort particles by z-index
      const sortedParticles = [...particles].sort((a, b) => b.z - a.z);
      
      // Update and render particles
      sortedParticles.forEach(particle => {
        // Particle movement
        const wobble = Math.sin(time + particle.speed * 100) * 5;
        
        // Apply rotations
        const cosX = Math.cos(currentRotationX);
        const sinX = Math.sin(currentRotationX);
        const cosY = Math.cos(currentRotationY);
        const sinY = Math.sin(currentRotationY);
        
        // Rotate around X axis
        const y1 = particle.y * cosX - (particle.z + wobble) * sinX;
        const z1 = particle.y * sinX + (particle.z + wobble) * cosX;
        
        // Rotate around Y axis
        const x2 = particle.x * cosY - z1 * sinY;
        const z2 = particle.x * sinY + z1 * cosY;
        
        // Project 3D to 2D
        const perspective = 1000;
        const scale = perspective / (perspective + z2);
        
        const x = canvas.width / 2 + x2 * scale;
        const y = canvas.height / 2 + y1 * scale;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(x, y, particle.radius * scale, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
        
        // Optional: Add glow effect
        ctx.beginPath();
        ctx.arc(x, y, particle.radius * scale * 2, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, particle.radius * scale * 2);
        gradient.addColorStop(0, particle.color + '40');
        gradient.addColorStop(1, particle.color + '00');
        ctx.fillStyle = gradient;
        ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <div className="absolute inset-0 w-full h-full">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}

export default HeroSphere;