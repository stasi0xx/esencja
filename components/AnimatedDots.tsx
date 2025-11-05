import React, { useRef, useEffect } from 'react';

const AnimatedDots = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 }); // Start mouse off-screen

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    // Fix: Defined a dedicated interface for Dot for better type checking.
    interface Dot {
      x: number;
      y: number;
      originX: number;
      originY: number;
      radius: number;
      vx: number;
      vy: number;
      color: string;
      maxDist: number;
      draw: () => void;
      update: () => void;
    }

    let dots: Dot[] = [];

    const getDotColor = () => {
        return document.documentElement.classList.contains('dark')
            ? 'rgba(156, 163, 175, 0.4)' // gray-400
            : 'rgba(107, 114, 128, 0.5)'; // gray-500
    }
    
    const getLineColor = (opacity: number) => {
        return document.documentElement.classList.contains('dark')
            ? `rgba(156, 163, 175, ${opacity})`
            : `rgba(107, 114, 128, ${opacity})`;
    }

    const createDots = () => {
      dots = [];
      const numDots = Math.floor((canvas.width * canvas.height) / 12000);
      for (let i = 0; i < numDots; i++) {
        dots.push(new DotImpl());
      }
    };

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
          canvas.width = parent.offsetWidth;
          canvas.height = parent.offsetHeight;
      }
      createDots();
    };

    class DotImpl implements Dot {
      x: number;
      y: number;
      originX: number;
      originY: number;
      radius: number;
      vx: number;
      vy: number;
      color: string;
      maxDist: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.originX = this.x;
        this.originY = this.y;
        this.radius = Math.random() * 1.5 + 1;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.color = getDotColor();
        this.maxDist = 120; // mouse interaction distance
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.color = getDotColor(); // Update color on each draw
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        // Mouse interaction
        const dx = this.x - mouse.current.x;
        const dy = this.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const forceDirectionX = dx / dist;
        const forceDirectionY = dy / dist;
        
        const force = (this.maxDist - dist) / this.maxDist;
        
        let directionX = 0;
        let directionY = 0;

        if (dist < this.maxDist) {
            directionX = forceDirectionX * force * 1.5;
            directionY = forceDirectionY * force * 1.5;
        } else {
            // Return to origin
            if (this.x !== this.originX) {
                const odx = this.originX - this.x;
                directionX = odx * 0.01;
            }
            if (this.y !== this.originY) {
                const ody = this.originY - this.y;
                directionY = ody * 0.01;
            }
        }

        this.x += this.vx + directionX;
        this.y += this.vy + directionY;

        // Wall wrapping
        if (this.x > canvas.width + this.radius) this.x = -this.radius;
        if (this.x < -this.radius) this.x = canvas.width + this.radius;
        if (this.y > canvas.height + this.radius) this.y = -this.radius;
        if (this.y < -this.radius) this.y = canvas.height + this.radius;
      }
    }
    
    const connectDots = () => {
        if (!ctx) return;
        for (let i = 0; i < dots.length; i++) {
            for (let j = i + 1; j < dots.length; j++) {
                const dx = dots[i].x - dots[j].x;
                const dy = dots[i].y - dots[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(dots[i].x, dots[i].y);
                    ctx.lineTo(dots[j].x, dots[j].y);
                    ctx.strokeStyle = getLineColor(1 - dist / 100);
                    ctx.lineWidth = 0.3;
                    ctx.stroke();
                }
            }
        }
    }

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(dot => dot.update());
      dots.forEach(dot => dot.draw());
      connectDots();
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouse.current.x = e.clientX - rect.left;
        mouse.current.y = e.clientY - rect.top;
    };
    
    const handleMouseLeave = () => {
        mouse.current.x = -1000;
        mouse.current.y = -1000;
    }
    
    const parent = canvas.parentElement;
    if (!parent) return;

    const resizeObserver = new ResizeObserver(() => {
        resizeCanvas();
    });
    resizeObserver.observe(parent);

    parent.addEventListener('mousemove', handleMouseMove);
    parent.addEventListener('mouseleave', handleMouseLeave);
    
    animate();

    return () => {
       if (parent) {
          resizeObserver.unobserve(parent);
          parent.removeEventListener('mousemove', handleMouseMove);
          parent.removeEventListener('mouseleave', handleMouseLeave);
       }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />;
};

export default AnimatedDots;