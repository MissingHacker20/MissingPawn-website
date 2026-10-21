(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileViewport = window.matchMedia('(max-width: 768px)');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
        return;
    }

    canvas.className = 'ambient-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);

    const points = [];
    const pointer = { x: -1000, y: -1000 };
    let width = 0;
    let height = 0;
    let animationFrame = 0;

    function resize() {
        window.cancelAnimationFrame(animationFrame);

        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        width = document.documentElement.clientWidth || window.innerWidth;
        height = document.documentElement.clientHeight || window.innerHeight;
        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        const count = Math.min(68, Math.max(28, Math.round(width * height / 18000)));
        points.length = 0;

        for (let i = 0; i < count; i += 1) {
            points.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.42,
                vy: (Math.random() - 0.5) * 0.42,
                radius: Math.random() * 1.8 + 1,
                phase: Math.random() * Math.PI * 2,
                symbol: i % 9 === 0 ? ['♟', '♞', '♜', '♝'][Math.floor(Math.random() * 4)] : ''
            });
        }

        draw();
    }

    function draw() {
        context.clearRect(0, 0, width, height);

        const interactive = !mobileViewport.matches && !reducedMotion.matches;
        const glowX = interactive ? pointer.x : -1000;
        const glowY = interactive ? pointer.y : -1000;
        const glow = context.createRadialGradient(glowX, glowY, 0, glowX, glowY, 340);
        glow.addColorStop(0, 'rgba(210, 42, 42, 0.2)');
        glow.addColorStop(1, 'rgba(210, 42, 42, 0)');
        context.fillStyle = glow;
        context.fillRect(0, 0, width, height);

        points.forEach((point, index) => {
            if (interactive) {
                point.x += point.vx;
                point.y += point.vy;
                point.phase += 0.018;

                if (point.x < -10 || point.x > width + 10) point.vx *= -1;
                if (point.y < -10 || point.y > height + 10) point.vy *= -1;
            }

            const pulse = interactive ? 0.75 + Math.sin(point.phase) * 0.25 : 1;
            context.beginPath();
            context.arc(point.x, point.y, point.radius * pulse, 0, Math.PI * 2);
            context.fillStyle = 'rgba(235, 86, 86, 0.78)';
            context.shadowColor = 'rgba(210, 42, 42, 0.55)';
            context.shadowBlur = 12;
            context.fill();
            context.shadowBlur = 0;

            if (point.symbol) {
                context.font = '30px "Segoe UI Symbol", serif';
                context.fillStyle = 'rgba(200, 76, 76, 0.17)';
                context.fillText(point.symbol, point.x + 8, point.y - 8);
            }

            for (let next = index + 1; next < points.length; next += 1) {
                const other = points[next];
                const dx = point.x - other.x;
                const dy = point.y - other.y;
                const distance = Math.hypot(dx, dy);

                if (distance < 175) {
                    context.beginPath();
                    context.moveTo(point.x, point.y);
                    context.lineTo(other.x, other.y);
                    context.strokeStyle = `rgba(170, 175, 195, ${(1 - distance / 175) * 0.28})`;
                    context.lineWidth = 1;
                    context.stroke();
                }
            }

            const pointerDistance = Math.hypot(point.x - pointer.x, point.y - pointer.y);
            if (interactive && pointerDistance < 190) {
                context.beginPath();
                context.moveTo(point.x, point.y);
                context.lineTo(pointer.x, pointer.y);
                context.strokeStyle = `rgba(235, 86, 86, ${(1 - pointerDistance / 190) * 0.48})`;
                context.lineWidth = 1.25;
                context.stroke();
            }
        });

        if (interactive && !document.hidden) {
            animationFrame = window.requestAnimationFrame(draw);
        }
    }

    function startAnimation() {
        window.cancelAnimationFrame(animationFrame);
        draw();
    }

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', (event) => {
        if (mobileViewport.matches || reducedMotion.matches) {
            return;
        }

        pointer.x = event.clientX;
        pointer.y = event.clientY;
    }, { passive: true });
    window.addEventListener('pointerleave', () => {
        pointer.x = -1000;
        pointer.y = -1000;
    });
    document.addEventListener('visibilitychange', startAnimation);
    reducedMotion.addEventListener('change', startAnimation);
    mobileViewport.addEventListener('change', startAnimation);

    document.querySelectorAll('main h1').forEach((heading) => {
        heading.classList.add('motion-reveal');
        window.requestAnimationFrame(() => heading.classList.add('is-visible'));
    });

    resize();
})();
