import React, { useEffect, useRef } from "react";

const ParticleHoverEffect = ({ imageUrl }) => {
  const canvasRef = useRef(null);
  let particles = [];

  // Configurable variables
  const particleSize = 3;
  const spacing = 4;
  const maxMouseEffectDistance = 80;
  const particleFriction = 0.85;
  const attractionStrength = 0.04;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set dynamic width & height based on parent container
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      loadImageAndExtractParticles(ctx, canvas);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // Initial call
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [imageUrl]);

  const loadImageAndExtractParticles = (ctx, canvas) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      extractParticles(img, ctx, canvas);
      animate();
    };
  };

  const extractParticles = (image, ctx, canvas) => {
    particles = [];

    const offscreenCanvas = document.createElement("canvas");
    const offCtx = offscreenCanvas.getContext("2d");
    if (!offCtx) return;

    offscreenCanvas.width = image.width;
    offscreenCanvas.height = image.height;
    offCtx.drawImage(image, 0, 0);

    const imageData = offCtx.getImageData(0, 0, image.width, image.height);
    const data = imageData.data;

    const scaleX = canvas.width / image.width;
    const scaleY = canvas.height / image.height;

    for (let y = 0; y < image.height; y += spacing) {
      for (let x = 0; x < image.width; x += spacing) {
        const index = (y * image.width + x) * 4;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const alpha = data[index + 3];

        if (alpha > 128) {
          particles.push({
            x: x * scaleX,
            y: y * scaleY,
            originalX: x * scaleX,
            originalY: y * scaleY,
            vx: 0,
            vy: 0,
            color: `rgb(${r},${g},${b})`,
          });
        }
      }
    }
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= particleFriction;
      particle.vy *= particleFriction;

      const dx = particle.originalX - particle.x;
      const dy = particle.originalY - particle.y;
      particle.vx += dx * attractionStrength;
      particle.vy += dy * attractionStrength;

      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x, particle.y, particleSize, particleSize);
    });

    requestAnimationFrame(animate);
  };

  const handleMouseMove = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    particles.forEach((particle) => {
      const dx = particle.x - mouseX;
      const dy = particle.y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < maxMouseEffectDistance) {
        const angle = Math.atan2(dy, dx);
        const force = (maxMouseEffectDistance - distance) / maxMouseEffectDistance;
        particle.vx += Math.cos(angle) * force * 6;
        particle.vy += Math.sin(angle) * force * 6;
      }
    });
  };

  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <canvas ref={canvasRef} onMouseMove={handleMouseMove} />
    </div>
  );
};

export default ParticleHoverEffect;
