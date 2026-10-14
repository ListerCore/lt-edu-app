'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@/components/providers/theme';

type Particle = { x: number; y: number; vx: number; vy: number };
type LinkPacket = { start: number; end: number; progress: number; speed: number };

const ParticleNetwork = (): React.ReactNode => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dark = theme === 'dark';
    const lineColor = dark ? '255,255,255' : '35,43,54';
    const dotColor = dark ? 'rgba(255,255,255,.52)' : 'rgba(35,43,54,.32)';
    const packetColor = dark ? '#e85b49' : '#b83d32';
    const packetGlow = dark ? 'rgba(232,91,73,.28)' : 'rgba(184,61,50,.2)';
    const maxDistance = 150;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let connections: number[][] = [];
    let packets: LinkPacket[] = [];
    let frame = 0;
    let lastPacketTime = 0;

    const connectedParticles = (index: number): number[] => {
      const current = particles[index];
      const connected: number[] = [];
      for (let next = index + 1; next < particles.length; next += 1) {
        const other = particles[next];
        const dx = current.x - other.x;
        const dy = current.y - other.y;
        if (dx * dx + dy * dy < maxDistance * maxDistance) connected.push(next);
      }
      return connected;
    };

    const draw = (): void => {
      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;
      for (let index = 0; index < particles.length; index += 1) {
        for (const next of connections[index] ?? []) {
          const current = particles[index];
          const other = particles[next];
          const distance = Math.hypot(current.x - other.x, current.y - other.y);
          context.strokeStyle = `rgba(${lineColor},${0.12 * (1 - distance / maxDistance)})`;
          context.beginPath();
          context.moveTo(current.x, current.y);
          context.lineTo(other.x, other.y);
          context.stroke();
        }
      }

      context.fillStyle = dotColor;
      for (const particle of particles) {
        context.beginPath();
        context.arc(particle.x, particle.y, 1.5, 0, Math.PI * 2);
        context.fill();
      }

      for (const packet of packets) {
        const start = particles[packet.start];
        const end = particles[packet.end];
        if (!start || !end) continue;
        const x = start.x + (end.x - start.x) * packet.progress;
        const y = start.y + (end.y - start.y) * packet.progress;
        context.fillStyle = packetGlow;
        context.beginPath();
        context.arc(x, y, 5, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = packetColor;
        context.beginPath();
        context.arc(x, y, 2, 0, Math.PI * 2);
        context.fill();
      }
    };

    const resize = (): void => {
      width = window.innerWidth;
      height = window.innerHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      const count = Math.min(110, Math.floor((width * height) / 16000));
      particles = Array.from({ length: count }, () => ({ x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35 }));
      connections = particles.map((_, index) => connectedParticles(index));
      packets = [];
      if (reducedMotion) draw();
    };

    const animate = (now: number): void => {
      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;
      }

      connections = particles.map((_, index) => connectedParticles(index));
      if (now - lastPacketTime > 600 && packets.length < 6) {
        const options = connections.flatMap((connected, index) => connected.map((end) => ({ start: index, end })));
        const link = options[Math.floor(Math.random() * options.length)];
        if (link) packets.push({ ...link, progress: 0, speed: 0.01 + Math.random() * 0.008 });
        lastPacketTime = now;
      }

      packets = packets.filter((packet) => packet.progress <= 1);
      for (const packet of packets) packet.progress += packet.speed;
      draw();
      frame = window.requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    if (!reducedMotion) frame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [theme]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_12%_35%,rgba(119,48,34,.12),transparent_42%),radial-gradient(ellipse_at_88%_65%,rgba(105,69,46,.08),transparent_36%)] dark:bg-[radial-gradient(ellipse_at_12%_35%,rgba(119,48,34,.22),transparent_42%),radial-gradient(ellipse_at_88%_65%,rgba(105,69,46,.15),transparent_36%)]" />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
};

export { ParticleNetwork };
