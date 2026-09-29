// script.js
// Code Sketchbook — 미디어 아티스트를 위한 코드 학습
// 각 레슨은 p5.js 인스턴스 모드로 독립된 캔버스를 그립니다.

const PAPER = [255, 255, 255];
// A missing theme must never prevent the lesson previews from starting.
const activeTheme = window.sketchbookTheme || { color: '#e6332a', rgb: [230, 51, 42] };
const ACCENT = activeTheme.color;
const ACCENT_RGB = activeTheme.rgb;
document.querySelector('#var-color').value = ACCENT;
const BLUE = '#3b82c4';
const INK = '#1d1d1f';

// ===============================================
// 히어로: 마우스를 피해 흩어지는 인터랙티브 점들
// ===============================================
new p5(function (p) {
    const host = document.querySelector('#canvas-hero');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let dots = [];
    let pointerInside = false;
    function layout() {
        dots = [];
        const spacing = Math.max(18, Math.min(28, p.width / 24));
        for (let y = spacing; y < p.height; y += spacing) {
            for (let x = spacing; x < p.width; x += spacing) {
                const nx = (x - p.width / 2) / (p.width * 0.44);
                const ny = (y - p.height / 2) / (p.height * 0.43);
                if (nx * nx + ny * ny < 1 && nx * nx + ny * ny > 0.14) {
                    dots.push({ x, y, homeX: x, homeY: y });
                }
            }
        }
    }
    p.setup = function () {
        const canvas = p.createCanvas(host.clientWidth, Math.max(300, Math.min(540, host.clientWidth * 0.8)));
        canvas.parent(host);
        canvas.elt.setAttribute('role', 'img');
        canvas.elt.setAttribute('aria-label', 'Interactive particle ring that moves away from your cursor');
        canvas.elt.addEventListener('pointerenter', () => { pointerInside = true; });
        canvas.elt.addEventListener('pointerleave', () => { pointerInside = false; });
        p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
        p.noStroke();
        layout();
        new ResizeObserver(() => {
            const width = host.clientWidth;
            if (width && width !== p.width) {
                p.resizeCanvas(width, Math.max(300, Math.min(540, width * 0.8)));
                layout();
            }
        }).observe(host);
    };
    p.draw = function () {
        p.background(255);
        p.fill(ACCENT);
        dots.forEach(function (d) {
            const dx = d.homeX - p.mouseX;
            const dy = d.homeY - p.mouseY;
            const distance = Math.hypot(dx, dy);
            const force = pointerInside ? Math.max(0, 1 - distance / 210) : 0;
            const drift = reducedMotion.matches ? 0 : Math.sin(p.frameCount * 0.018 + d.homeY * 0.02) * 4;
            const safeDistance = Math.max(distance, 1);
            d.x = p.lerp(d.x, d.homeX + dx / safeDistance * force * 115, 0.12);
            d.y = p.lerp(d.y, d.homeY + dy / safeDistance * force * 115 + drift, 0.12);
            p.circle(d.x, d.y, 4 + force * 9);
        });
        if (pointerInside) {
            p.noFill();
            p.stroke(...ACCENT_RGB, 80);
            p.circle(p.mouseX, p.mouseY, reducedMotion.matches ? 60 : 65 + Math.sin(p.frameCount * 0.07) * 14);
        }
        p.stroke(ACCENT);
        p.strokeWeight(1);
        const cx = p.width / 2, cy = p.height / 2;
        p.line(cx - 9, cy, cx + 9, cy);
        p.line(cx, cy - 9, cx, cy + 9);
        p.noStroke();
    };
});

// ===============================================
// 01. 변수 (Variable): 슬라이더로 원의 위치 · 크기 · 색 바꾸기
// ===============================================
new p5(function (p) {
    const xInput = document.querySelector('#var-x');
    const yInput = document.querySelector('#var-y');
    const sizeInput = document.querySelector('#var-size');
    const colorInput = document.querySelector('#var-color');

    p.setup = function () {
        p.createCanvas(300, 300).parent('canvas-var');
        p.noStroke();
    };

    p.draw = function () {
        p.background(...PAPER);
        const x = Number(xInput.value);
        const y = Number(yInput.value);
        const size = Number(sizeInput.value);
        p.fill(colorInput.value);
        p.ellipse(x, y, size, size);
    };
});

// ===============================================
// 02. 조건문 (if): 마우스 위치에 따라 색이 바뀌는 원
// ===============================================
new p5(function (p) {
    p.setup = function () {
        p.createCanvas(300, 300).parent('canvas-if');
        p.noStroke();
    };

    p.draw = function () {
        p.background(...PAPER);

        p.push();
        p.stroke(210);
        p.drawingContext.setLineDash([4, 4]);
        p.line(p.width / 2, 0, p.width / 2, p.height);
        p.pop();

        const mx = p.constrain(p.mouseX, 0, p.width);
        const my = p.constrain(p.mouseY, 0, p.height);

        p.noStroke();
        if (mx < p.width / 2) {
            p.fill(BLUE);
        } else {
            p.fill('#e6332a');
        }
        p.ellipse(mx, my, 40, 40);

        p.fill(140);
        p.textSize(11);
        p.text('마우스를 캔버스 위에서 움직여보세요', 12, p.height - 12);
    };
});

// ===============================================
// 03. 반복문 (loop): count번 반복해서 방사형 점 패턴 그리기
// ===============================================
new p5(function (p) {
    const countInput = document.querySelector('#loop-count');

    p.setup = function () {
        p.createCanvas(300, 300).parent('canvas-loop');
        p.noStroke();
    };

    p.draw = function () {
        p.background(...PAPER);
        p.fill(ACCENT);

        const count = Number(countInput.value);
        const cx = p.width / 2;
        const cy = p.height / 2;

        for (let i = 0; i < count; i++) {
            const angle = (p.TWO_PI / count) * i + p.frameCount * 0.006;
            const x = cx + p.cos(angle) * 100;
            const y = cy + p.sin(angle) * 100;
            p.ellipse(x, y, 14, 14);
        }
    };
});

// ===============================================
// 04. 함수 (Function): 같은 stamp() 함수를 재사용해서 도장 찍기
// ===============================================
new p5(function (p) {
    let stamps = [];

    function stamp(x, y, size, col) {
        return { x, y, size, col };
    }

    p.setup = function () {
        p.createCanvas(300, 300).parent('canvas-func');
        p.noStroke();

        document.querySelector('#func-stamp-btn').addEventListener('click', function () {
            const x = p.random(30, p.width - 30);
            const y = p.random(30, p.height - 30);
            const size = p.random(24, 64);
            const col = p.random([ACCENT, BLUE, INK]);
            stamps.push(stamp(x, y, size, col));
        });

        document.querySelector('#func-clear-btn').addEventListener('click', function () {
            stamps = [];
        });
    };

    p.draw = function () {
        p.background(...PAPER);
        stamps.forEach(function (s) {
            p.fill(s.col);
            p.ellipse(s.x, s.y, s.size, s.size);
        });
    };
});

// ===============================================
// 05. 데이터 타입 (Type): Boolean 변수로 애니메이션 켜고 끄기
// ===============================================
new p5(function (p) {
    let isMoving = true;
    let x = 0;

    p.setup = function () {
        p.createCanvas(300, 140).parent('canvas-type');
        p.noStroke();

        document.querySelector('#type-toggle-btn').addEventListener('click', function () {
            isMoving = !isMoving;
        });
    };

    p.draw = function () {
        p.background(...PAPER);
        if (isMoving) {
            x = (x + 2) % p.width;
        }
        p.fill(ACCENT);
        p.ellipse(x, p.height / 2, 30, 30);

        p.fill(140);
        p.textSize(11);
        p.text('isMoving = ' + isMoving + '  (타입: ' + typeof isMoving + ')', 12, p.height - 14);
    };
});

// ===============================================
// 06. 배열 (Array): 배열에 담긴 여러 원을 반복문으로 업데이트
// ===============================================
new p5(function (p) {
    let dots = [];
    const countInput = document.querySelector('#array-count');

    function regenerate() {
        dots = [];
        const count = Number(countInput.value);
        for (let i = 0; i < count; i++) {
            dots.push({ x: p.random(p.width), y: p.random(p.height), vy: p.random(1, 3) });
        }
    }

    p.setup = function () {
        p.createCanvas(340, 260).parent('canvas-array');
        p.noStroke();
        regenerate();

        document.querySelector('#array-btn').addEventListener('click', regenerate);
        countInput.addEventListener('input', regenerate);
    };

    p.draw = function () {
        p.background(...PAPER);
        p.fill(ACCENT);
        dots.forEach(function (d) {
            d.y = (d.y + d.vy) % p.height;
            p.ellipse(d.x, d.y, 8, 8);
        });
    };
});

// ===============================================
// 07. 노이즈 (Perlin Noise): 부드럽게 이어지는 유기적인 움직임
// ===============================================
new p5(function (p) {
    let t = 0;
    const speedInput = document.querySelector('#noise-speed');

    p.setup = function () {
        p.createCanvas(340, 260).parent('canvas-noise');
        p.noStroke();
        p.background(...PAPER);
    };

    p.draw = function () {
        p.fill(255, 255, 255, 40);
        p.rect(0, 0, p.width, p.height);

        const speed = Number(speedInput.value) / 1000;
        const x = p.noise(t) * p.width;
        const y = p.noise(t + 100) * p.height;

        p.fill(ACCENT);
        p.ellipse(x, y, 20, 20);

        t += speed;
    };
});

// ===============================================
// 08. 객체와 클래스 (Object/Class): Particle 클래스를 재사용해 입자 생성
// ===============================================
new p5(function (p) {
    let particles = [];

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = p.random(-2, 2);
            this.vy = p.random(-2, 2);
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > p.width) this.vx *= -1;
            if (this.y < 0 || this.y > p.height) this.vy *= -1;
        }
        show() {
            p.fill(ACCENT);
            p.ellipse(this.x, this.y, 10, 10);
        }
    }

    p.setup = function () {
        p.createCanvas(340, 260).parent('canvas-object');
        p.noStroke();

        document.querySelector('#object-clear-btn').addEventListener('click', function () {
            particles = [];
        });
    };

    p.mousePressed = function () {
        if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
            particles.push(new Particle(p.mouseX, p.mouseY));
        }
    };

    p.draw = function () {
        p.background(...PAPER);
        particles.forEach(function (particle) {
            particle.update();
            particle.show();
        });

        if (particles.length === 0) {
            p.fill(160);
            p.textSize(11);
            p.text('캔버스를 클릭해보세요', 12, p.height - 12);
        }
    };
});

// ===============================================
// 09. 이벤트 (Events): 방향키 / 버튼으로 사각형 움직이기
// ===============================================
new p5(function (p) {
    let x, y;
    const step = 10;

    function move(dx, dy) {
        x = p.constrain(x + dx, 20, p.width - 20);
        y = p.constrain(y + dy, 20, p.height - 20);
    }

    p.setup = function () {
        p.createCanvas(340, 260).parent('canvas-event');
        p.noStroke();
        x = p.width / 2;
        y = p.height / 2;

        document.querySelector('#event-up').addEventListener('click', function () { move(0, -step); });
        document.querySelector('#event-down').addEventListener('click', function () { move(0, step); });
        document.querySelector('#event-left').addEventListener('click', function () { move(-step, 0); });
        document.querySelector('#event-right').addEventListener('click', function () { move(step, 0); });

        window.addEventListener('keydown', function (e) {
            if (document.querySelector('#track-intermediate').hidden ||
                !document.querySelector('#lesson-09').contains(document.activeElement) ||
                /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
            if (e.key === 'ArrowUp') move(0, -step);
            if (e.key === 'ArrowDown') move(0, step);
            if (e.key === 'ArrowLeft') move(-step, 0);
            if (e.key === 'ArrowRight') move(step, 0);
        });
    };

    p.draw = function () {
        p.background(...PAPER);
        p.fill(ACCENT);
        p.rectMode(p.CENTER);
        p.rect(x, y, 36, 36, 6);

        p.fill(160);
        p.textSize(11);
        p.text('방향키 또는 버튼을 눌러보세요', 12, p.height - 12);
    };
});

// ===============================================
// 10. 색상 모드 (Color Modes): HSB로 무지개색 순환시키기
// ===============================================
new p5(function (p) {
    let hue = 0;
    const speedInput = document.querySelector('#color-speed');
    const count = 14;

    p.setup = function () {
        p.createCanvas(340, 260).parent('canvas-color');
        p.noStroke();
        p.colorMode(p.HSB, 360, 100, 100);
    };

    p.draw = function () {
        p.background(0, 0, 100);
        const cx = p.width / 2;
        const cy = p.height / 2;

        for (let i = 0; i < count; i++) {
            const angle = (p.TWO_PI / count) * i;
            const x = cx + p.cos(angle) * 90;
            const y = cy + p.sin(angle) * 90;
            p.fill((hue + i * (360 / count)) % 360, 80, 90);
            p.ellipse(x, y, 26, 26);
        }

        const speed = Number(speedInput.value) / 10;
        hue = (hue + speed) % 360;
    };
});

// ===============================================
// 난이도 탭: 초급 / 중급 트랙 전환
// ===============================================
const levelTabs = document.querySelectorAll('.level-tab[data-track]');
levelTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
        levelTabs.forEach(function (t) { t.classList.remove('is-active'); });
        tab.classList.add('is-active');

        const target = tab.dataset.track;
        document.querySelectorAll('.track').forEach(function (track) {
            track.hidden = track.id !== 'track-' + target;
        });
    });
});

// ===============================================
// 퀴즈: 4지선다 객관식 공통 핸들러
// ===============================================
document.querySelectorAll('.quiz').forEach(function (quiz) {
    const options = quiz.querySelectorAll('.quiz-option');
    const feedback = quiz.querySelector('.quiz-feedback');

    options.forEach(function (btn) {
        btn.addEventListener('click', function () {
            if (quiz.classList.contains('answered')) {
                return;
            }
            quiz.classList.add('answered');

            const isCorrect = btn.dataset.correct === 'true';

            options.forEach(function (b) {
                b.disabled = true;
                if (b.dataset.correct === 'true') {
                    b.classList.add('correct');
                }
            });
            if (!isCorrect) {
                btn.classList.add('wrong');
            }

            feedback.textContent = isCorrect
                ? '정답입니다! 🎉'
                : '아쉽지만 오답이에요. 초록색으로 표시된 게 정답이에요.';
            feedback.classList.add(isCorrect ? 'ok' : 'no');
        });
    });
});

// ===============================================
// 스크롤 시 섹션이 서서히 나타나는 연출
// ===============================================
const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
});

// Pointer-responsive minimal lesson icons.
document.querySelectorAll('.lesson-text').forEach(function (card) {
    const icon = card.querySelector('.icon-chip');
    card.addEventListener('pointermove', function (event) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const bounds = card.getBoundingClientRect();
        icon.style.transform = `translate(${((event.clientX - bounds.left) / bounds.width - 0.5) * 12}px, ${((event.clientY - bounds.top) / bounds.height - 0.5) * 12}px) rotate(12deg)`;
    });
    card.addEventListener('pointerleave', () => { icon.style.transform = ''; });
});
document.querySelectorAll('.quiz-feedback').forEach(el => el.setAttribute('aria-live', 'polite'));
levelTabs.forEach(tab => {
    tab.setAttribute('aria-pressed', String(tab.classList.contains('is-active')));
    tab.addEventListener('click', () => {
        levelTabs.forEach(item => item.setAttribute('aria-pressed', String(item === tab)));
        const activeTrack = document.querySelector('#track-' + tab.dataset.track);
        const sections = [...activeTrack.querySelectorAll('.lesson-section')];
        document.querySelectorAll('.topbar-links a').forEach((link, index) => {
            link.textContent = sections[index].querySelector('h2').textContent;
            link.href = '#' + sections[index].id;
        });
        document.querySelector('.hero-cta').href = '#' + sections[0].id;
    });
});

// Advanced sketches share pointer, visibility and reset handling.
['flow', 'force', 'wave', 'tree', 'orbit'].forEach(function (kind) {
    new p5(function (p) {
        const host = document.querySelector('#canvas-' + kind);
        const input = document.querySelector('#' + kind + '-amount');
        const initial = input.value;
        let active = false, time = 0, particles = [];
        const pointer = { x: 220, y: 170 };
        function reset() {
            time = 0;
            particles = Array.from({ length: 65 }, () => ({
                position: p.createVector(p.random(p.width), p.random(p.height)),
                velocity: p.createVector(p.random(-1, 1), p.random(-1, 1))
            }));
        }
        p.setup = function () {
            const canvas = p.createCanvas(440, 340);
            canvas.parent(host);
            p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
            canvas.elt.setAttribute('aria-label', kind + ' interactive sketch. Move pointer or drag to interact.');
            canvas.elt.setAttribute('role', 'img');
            canvas.elt.style.touchAction = 'pan-y';
            function point(event) {
                const rect = canvas.elt.getBoundingClientRect();
                pointer.x = p.constrain((event.clientX - rect.left) / rect.width * p.width, 0, p.width);
                pointer.y = p.constrain((event.clientY - rect.top) / rect.height * p.height, 0, p.height);
                active = true;
            }
            canvas.elt.addEventListener('pointerenter', point);
            canvas.elt.addEventListener('pointermove', point);
            canvas.elt.addEventListener('pointerdown', point);
            canvas.elt.addEventListener('pointerleave', () => { active = false; });
            canvas.elt.addEventListener('pointercancel', () => { active = false; });
            canvas.elt.addEventListener('pointerup', event => { if (event.pointerType !== 'mouse') active = false; });
            document.querySelector('#' + kind + '-reset').addEventListener('click', () => {
                input.value = initial;
                active = false;
                reset();
                p.redraw();
            });
            reset();
            // Hidden tracks and offscreen lessons do not consume animation frames.
            new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) p.loop(); else p.noLoop();
            }).observe(host);
        };
        p.draw = function () {
            p.background(255);
            const amount = Number(input.value);
            time += Math.min(p.deltaTime || 16, 50) * 0.001;
            p.stroke(ACCENT); p.strokeWeight(1.2); p.noFill();
            if (kind === 'flow') {
                const spacing = 440 / amount;
                for (let y = 20; y < p.height; y += spacing) {
                    for (let x = 20; x < p.width; x += spacing) {
                        let angle = p.noise(x * 0.006, y * 0.006, time * 0.15) * p.TWO_PI * 2;
                        const distance = p.dist(x, y, pointer.x, pointer.y);
                        const influence = active ? Math.max(0, 1 - distance / 180) : 0;
                        const target = Math.atan2(pointer.y - y, pointer.x - x);
                        angle += Math.atan2(Math.sin(target - angle), Math.cos(target - angle)) * influence;
                        p.strokeWeight(1 + influence * 2);
                        p.line(x, y, x + Math.cos(angle) * 16, y + Math.sin(angle) * 16);
                    }
                }
            } else if (kind === 'force') {
                const target = p.createVector(active ? pointer.x : p.width / 2, active ? pointer.y : p.height / 2);
                p.noStroke(); p.fill(ACCENT);
                particles.forEach(particle => {
                    const force = p5.Vector.sub(target, particle.position);
                    force.setMag(amount * 0.03);
                    particle.velocity.add(force).mult(0.96).limit(6);
                    particle.position.add(particle.velocity);
                    p.circle(particle.position.x, particle.position.y, 4);
                });
            } else if (kind === 'wave') {
                const amplitude = active ? p.map(pointer.y, 0, p.height, 8, 65) : 35;
                const phase = active ? pointer.x / p.width * p.TWO_PI : 0;
                for (let layer = 0; layer < 7; layer++) {
                    p.stroke(...ACCENT_RGB, 45 + layer * 30);
                    p.beginShape();
                    for (let x = 0; x <= p.width; x += 3) {
                        const a = Math.sin(x * amount * 0.008 + time + layer * 0.15);
                        const b = Math.sin(x * amount * 0.0128 - time + phase);
                        p.vertex(x, p.height / 2 + (a + b) * amplitude + (layer - 3) * 8);
                    }
                    p.endShape();
                }
            } else if (kind === 'tree') {
                const angle = active ? p.map(pointer.x, 0, p.width, 0.12, 1.15) : 0.48;
                function branch(length, depth) {
                    if (!depth) return;
                    p.strokeWeight(Math.max(0.7, depth * 0.35));
                    p.line(0, 0, 0, -length);
                    p.translate(0, -length);
                    [-1, 1].forEach(side => {
                        p.push(); p.rotate(angle * side);
                        branch(length * 0.68, depth - 1); p.pop();
                    });
                }
                p.push(); p.translate(p.width / 2, p.height - 18); branch(88, amount); p.pop();
            } else {
                const cx = active ? pointer.x : p.width / 2;
                const cy = active ? pointer.y : p.height / 2;
                for (let i = 1; i <= amount; i++) {
                    const radius = 20 + i * 12;
                    p.push(); p.translate(cx, cy); p.rotate(time * 0.3 + i * Math.PI / amount);
                    p.noFill(); p.stroke(...ACCENT_RGB, 130); p.ellipse(0, 0, radius * 2, radius);
                    p.translate(radius * Math.cos(time + i), radius * 0.5 * Math.sin(time + i));
                    p.noStroke(); p.fill(ACCENT); p.circle(0, 0, 7); p.pop();
                }
            }
            if (active) {
                p.noFill(); p.stroke(...ACCENT_RGB, 90); p.strokeWeight(1);
                p.circle(pointer.x, pointer.y, 26);
            }
        };
    });
});

// A soft spotlight and a lifted edge make hover visible without obscuring content.
document.querySelectorAll('.demo-box, .code-window').forEach(function (card) {
    card.addEventListener('pointermove', function (event) {
        const bounds = card.getBoundingClientRect();
        card.style.setProperty('--pointer-x', (event.clientX - bounds.left) + 'px');
        card.style.setProperty('--pointer-y', (event.clientY - bounds.top) + 'px');
    });
});
