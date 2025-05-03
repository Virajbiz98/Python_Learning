import { useEffect, useRef } from 'react';

function HeroSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    // Sphere parameters
    const sphereRadius = canvas.width < 400 ? 100 : 150;
    const center = {
      x: canvas.width / 2,
      y: canvas.height / 2
    };

    // Create dots on the sphere surface
    const points: { x: number; y: number; z: number; size: number; color: string }[] = [];
    const numPoints = 800;
    const colors = ['#10B981', '#6366F1', '#F59E0B'];

    for (let i = 0; i < numPoints; i++) {
      // Generate random spherical coordinates
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      // Convert to Cartesian coordinates
      const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
      const y = sphereRadius * Math.sin(phi) * Math.sin(theta);
      const z = sphereRadius * Math.cos(phi);
      
      points.push({
        x,
        y,
        z,
        size: Math.random() * 1.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    // Animation variables
    let rotationX = 0;
    let rotationY = 0;
    let rotationXSpeed = 0.001;
    let rotationYSpeed = 0.001;

    // Animation frame function
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update rotation
      rotationX += rotationXSpeed;
      rotationY += rotationYSpeed;
      
      // Calculate rotation matrices
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      
      // Draw points
      for (const point of points) {
        // Apply rotation around X axis
        let y1 = point.y * cosX - point.z * sinX;
        let z1 = point.y * sinX + point.z * cosX;
        
        // Apply rotation around Y axis
        let x2 = point.x * cosY + z1 * sinY;
        let z2 = -point.x * sinY + z1 * cosY;
        
        // Project 3D point to 2D plane
        const scale = 400 / (400 + z2);
        const x2d = center.x + x2 * scale;
        const y2d = center.y + y1 * scale;
        
        // Draw point
        ctx.beginPath();
        ctx.arc(x2d, y2d, point.size * scale, 0, 2 * Math.PI);
        ctx.fillStyle = point.color;
        ctx.globalAlpha = 0.7;
        ctx.fill();
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="w-full h-[400px] relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
}

export default HeroSphere;