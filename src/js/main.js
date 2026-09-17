'use strict';

document.addEventListener('DOMContentLoaded', function () {

    //////////////////////////////////////////////////////////////////
    // [ Fixed Header ]

    function initFixedHeader() {
        const header = document.querySelector('.header');
        if (!header) return;

        window.addEventListener('scroll', function () {
            header.classList.toggle('js-fixed', window.scrollY > 150);
        });
    }

    //////////////////////////////////////////////////////////////////
    // [ Back to Top Button ]

    function initBackToTop() {
        const btn = document.querySelector('.btn-backToTop');
        if (!btn) return;

        document.addEventListener('scroll', function () {
            btn.classList.toggle('show', window.scrollY > 400);
        });

        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    //////////////////////////////////////////////////////////////////
    // [ Swiper Sliders ]

    function initSwipers() {
        if (typeof Swiper === 'undefined') return;

        if (document.querySelector('.swiperReviews')) {

            const reviewsSlider = document.querySelector('.swiperReviews');
            const reviewsArea = reviewsSlider.closest('.swiperReviews-area');

            const currentCounter = reviewsArea.querySelector(
                '.swiper-counter .current'
            );

            const totalCounter = reviewsArea.querySelector(
                '.swiper-counter .total'
            );

            new Swiper(reviewsSlider, {
                slidesPerView: 'auto',
                spaceBetween: 4,
                loop: true,

                navigation: {
                    prevEl: reviewsArea.querySelector('.btn-swiper-prev'),
                    nextEl: reviewsArea.querySelector('.btn-swiper-next'),
                },

                on: {
                    init: function () {
                        currentCounter.textContent = this.realIndex + 1;
                        totalCounter.textContent = this.slides.length;
                    },

                    slideChange: function () {
                        currentCounter.textContent = this.realIndex + 1;
                    },
                },
            });
        }

    }

    //////////////////////////////////////////////////////////////////
    // [ Phone & Date Masks ]

    function initMasks() {
        if (typeof IMask === 'undefined') return;

        document.querySelectorAll('.maskPhone').forEach(function (el) {
            IMask(el, { mask: '+{7}(000)000-00-00' });
        });

        document.querySelectorAll('.maskDate').forEach(function (el) {
            IMask(el, { mask: Date, min: new Date(1900, 0, 1), lazy: false });
        });
    }


    //////////////////////////////////////////////////////////////////
    // [ Hero Typewriter ]

    function heroTypewriterSleep(ms) {
        return new Promise(function (resolve) { setTimeout(resolve, ms); });
    }

    // рекурсивно оборачивает текстовые узлы в span.js-letter, сохраняя вложенные теги (например .text-accent)
    function heroTypewriterWrapLetters(node) {
        const letters = [];
        Array.from(node.childNodes).forEach(function (child) {
            if (child.nodeType === Node.TEXT_NODE) {
                const frag = document.createDocumentFragment();
                Array.from(child.textContent).forEach(function (ch) {
                    const span = document.createElement('span');
                    span.className = 'js-letter';
                    span.textContent = ch;
                    frag.appendChild(span);
                    letters.push(span);
                });
                node.replaceChild(frag, child);
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                letters.push.apply(letters, heroTypewriterWrapLetters(child));
            }
        });
        return letters;
    }

    // инлайн-стиль (setProperty на элементе) всегда перебивает правила из CSS, даже внутри @media,
    // поэтому адаптивность считаем прямо в JS: берём base-конфиг и "докручиваем" его
    // брейкпоинтами из config.responsive, начиная с меньшего minWidth и заканчивая тем,
    // что подходит под текущую ширину экрана (аналог mobile-first в CSS)
    function heroTypewriterResolveResponsiveConfig(config) {
        let resolved = Object.assign({}, config);

        if (Array.isArray(config.responsive) && config.responsive.length) {
            const width = window.innerWidth;
            const sorted = config.responsive.slice().sort(function (a, b) {
                return a.minWidth - b.minWidth;
            });

            sorted.forEach(function (bp) {
                if (width >= bp.minWidth) {
                    resolved = Object.assign(resolved, bp);
                }
            });
        }

        return resolved;
    }

    function heroTypewriterApplyStrikeVars(el, config) {
        const resolved = heroTypewriterResolveResponsiveConfig(config);

        el.style.setProperty('--through-thickness', resolved.strikeThickness + 'px');
        el.style.setProperty('--through-top', resolved.strikeTop + '%');
        el.style.setProperty('--through-inset', resolved.strikeInset + 'px');
        el.style.setProperty('--through-duration', resolved.strikeDuration + 'ms');
        if (resolved.strikeColor) {
            el.style.setProperty('--through-color', resolved.strikeColor);
        }

        return resolved;
    }

    async function heroTypewriterRun(root, config) {
        const parts = Array.from(root.querySelectorAll('[data-part]')).map(function (el) {
            return {
                el: el,
                letters: heroTypewriterWrapLetters(el),
                isStrikeTarget: el.hasAttribute('data-strike-target')
            };
        });

        if (!parts.length) return;

        const strikeTarget = parts.find(function (p) { return p.isStrikeTarget; });
        if (strikeTarget) {
            heroTypewriterApplyStrikeVars(strikeTarget.el, config);

            // при изменении ширины окна (переход между брейкпоинтами) переменные линии
            // пересчитываются и применяются заново — уже нарисованная линия сразу подстроится
            let resizeTimer = null;
            window.addEventListener('resize', function () {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function () {
                    heroTypewriterApplyStrikeVars(strikeTarget.el, config);
                }, 150);
            });
        }

        const cursor = document.createElement('span');
        cursor.className = 'hero-title__cursor';
        // курсор сразу ставим в начало заголовка — он должен мигать там до старта печати
        root.insertBefore(cursor, root.firstChild);

        // пауза с мигающим курсором перед началом набора текста
        await heroTypewriterSleep(config.initialCursorDelay);

        for (const part of parts) {
            for (const letter of part.letters) {
                letter.style.opacity = '1';
                letter.insertAdjacentElement('afterend', cursor);
                await heroTypewriterSleep(config.typeSpeed);
            }
            if (part.isStrikeTarget) {
                await heroTypewriterSleep(config.pauseBeforeStrike);
                part.el.classList.add('is-struck');
                await heroTypewriterSleep(config.strikeDuration);
                await heroTypewriterSleep(config.pauseAfterStrike);
            }
        }

        if (config.hideCursorAfterDone) {
            await heroTypewriterSleep(config.hideCursorDelay);
            cursor.classList.add('is-hidden');
        }
    }

    function initHeroTypewriter(selector, options) {
        const root = document.querySelector(selector || '[data-typewriter]');
        if (!root) return;

        const defaults = {
            typeSpeed: 55,
            initialCursorDelay: 1500,
            pauseBeforeStrike: 350,
            pauseAfterStrike: 250,
            strikeThickness: 4,
            strikeTop: 55,
            strikeInset: 6,
            strikeColor: null,
            strikeDuration: 450,
            hideCursorAfterDone: true,
            hideCursorDelay: 1200
        };

        const config = Object.assign({}, defaults, options || {});
        heroTypewriterRun(root, config);
    }

    //////////////////////////////////////////////////////////////////
    // [ Fancybox ]

    function initFancybox() {
        if (typeof Fancybox === 'undefined') return;

        Fancybox.bind('[data-fancybox]', {
            Thumbs: { type: 'classic' },
            Toolbar: {
                display: { left: [], middle: [], right: ['close'] },
            },
        });
    }

    //////////////////////////////////////////////////////////////////
    // [ Init All ]

    initFixedHeader();
    initBackToTop();
    initSwipers();
    initMasks();
    initFancybox();
    initHeroTypewriter('[data-typewriter]', {
        initialCursorDelay: 3000,
        strikeThickness: 4,
        strikeTop: 55,
        strikeInset: 4,
        // переопределения по брейкпоинтам (mobile-first: minWidth в px)
        responsive: [
            { minWidth: 1600, strikeThickness: 7, strikeInset: 6 },
            { minWidth: 1900, strikeThickness: 10, strikeInset: 6 },
        ],
    });

});