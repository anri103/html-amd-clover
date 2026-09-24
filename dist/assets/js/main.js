'use strict';

document.addEventListener('DOMContentLoaded', function () {

    //////////////////////////////////////////////////////////////////
    // [ WOW Animation ]

    function initWow() {
        const wow = new WOW({
            boxClass: 'wow',
            animateClass: 'animated',
            offset: 100,
            mobile: false,
            live: true
        });

        wow.init();
    }

    //////////////////////////////////////////////////////////////////
    // [ Fixed Header ]

    function initFixedHeader() {
        const header = document.querySelector('.header');
        if (!header) return;

        window.addEventListener('scroll', function () {
            header.classList.toggle('js-fixed', window.scrollY > 50);
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

        if (document.querySelector('.swiperMedia')) {

            const mediaSlider = document.querySelector('.swiperMedia');
            const mediaArea = mediaSlider.closest('.swiperMedia-area');

            const swiper = new Swiper(mediaSlider, {
                slidesPerView: 1,
                spaceBetween: 4,
                loop: true,

                breakpoints: {
                    768: { slidesPerView: 3 },
                    1200: { slidesPerView: 4 },
                    1900: { slidesPerView: 5 },
                },
            });

            mediaArea.querySelectorAll('.btn-swiper-prev').forEach(button => {
                button.addEventListener('click', () => swiper.slidePrev());
            });

            mediaArea.querySelectorAll('.btn-swiper-next').forEach(button => {
                button.addEventListener('click', () => swiper.slideNext());
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
    // [ Mobile Accordion Scroll ]

    function initAccordionScroll() {
        const mobileBreakpoint = 991;

        document.addEventListener('shown.bs.collapse', function (event) {
            const accordionItem = event.target.closest('.accordion-item');

            if (!accordionItem) return;

            const scrollOffset = window.matchMedia(
                `(max-width: ${mobileBreakpoint}px)`
            ).matches
                ? 80
                : 120;

            requestAnimationFrame(() => {
                const top =
                    accordionItem.getBoundingClientRect().top +
                    window.scrollY -
                    scrollOffset;

                window.scrollTo({
                    top: Math.max(0, top),
                    behavior: 'smooth'
                });
            });
        });
    }

    //////////////////////////////////////////////////////////////////
    // [ Landing Close Offcanvas after click link mobile menu ]

    function initCloseOffcanvas() {
        const scrollToTarget = (target) => {
            const y = target.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: y, behavior: 'smooth' });
        };

        const offcanvasEl = document.getElementById('offcanvasMobileMenu');

        document.addEventListener('click', (e) => {
            const link = e.target.closest(
                '#desktopNav a[href*="#"], #mobileNav a[href*="#"]'
            );
            if (!link) return;

            const hash = link.hash;
            if (!hash) return;

            let target;
            try {
                target = document.querySelector(hash);
            } catch {
                return;
            }
            if (!target) return;

            e.preventDefault();

            const offcanvas = offcanvasEl && bootstrap.Offcanvas.getInstance(offcanvasEl);

            if (offcanvas && offcanvasEl.classList.contains('show')) {
                offcanvasEl.addEventListener('hidden.bs.offcanvas', () => {
                    scrollToTarget(target);
                }, { once: true });

                offcanvas.hide();
            } else {
                scrollToTarget(target);
            }
        });
    }

	//////////////////////////////////////////////////////////////////
	// [ Animation Helpers ]

	/**
	 * Преобразует значение времени из CSS-формата в миллисекунды.
	 *
	 * Поддерживает:
	 *  "500ms"
	 *  "0.5s"
	 *  "500"
	 */
	function parseTime(value) {
		if (!value) {
			return 0;
		}

		value = value.trim();

		if (value.endsWith('ms')) {
			return parseFloat(value);
		}

		if (value.endsWith('s')) {
			return parseFloat(value) * 1000;
		}

		return parseFloat(value) || 0;
	}


	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}


	/**
	 * Возвращает общие настройки анимации элемента.
	 *
	 * Например:
	 *
	 * data-animation-delay="0.5s"
	 * data-animation-duration="1s"
	 */
	function getAnimationConfig(element) {
		return {
			delay: parseTime(
				element.dataset.animationDelay
			),

			duration: parseTime(
				element.dataset.animationDuration
			)
		};
	}


	//////////////////////////////////////////////////////////////////
	// [ Strike Animation ]

	function initStrikeAnimations() {

		document.querySelectorAll('[data-strike]').forEach(element => {

			const {
				delay,
				duration
			} = getAnimationConfig(element);


			/*
			 * Передаём duration в CSS.
			 *
			 * JS не знает, как именно выглядит
			 * анимация зачёркивания.
			 */
			element.style.setProperty(
				'--strike-duration',
				`${duration}ms`
			);


			/*
			 * Запускаем анимацию после указанной задержки.
			 */
			setTimeout(() => {

				element.classList.add('is-struck');

			}, delay);

		});
	}


	//////////////////////////////////////////////////////////////////
	// [ Typewriter Animation ]

	function initTypewriterAnimations() {

		document.querySelectorAll('[data-typewriter]').forEach(element => {

			const {
				delay,
				duration
			} = getAnimationConfig(element);


			/*
			 * Запускаем печать после указанной задержки.
			 */
			setTimeout(() => {

				typeText(element, duration);

			}, delay);

		});
	}


	/**
	 * Печатает текст элемента за указанную duration.
	 */
	async function typeText(element, duration) {
        const letters = splitLetters(element);

        if (!letters.length) {
            return;
        }

        element.classList.add('is-typing');

        const cursor = document.createElement('span');
        cursor.className = 'hero-title__cursor';

        element.prepend(cursor);

        const speed = duration / letters.length;

        for (const letter of letters) {
            letter.classList.add('is-visible');
            letter.after(cursor);

            await sleep(speed);
        }

        cursor.classList.add('is-hidden');
    }


	/**
	 * Разбивает текстовые узлы на отдельные буквы.
	 *
	 * Вложенные элементы сохраняются.
	 */
	function splitLetters(element) {

		const letters = [];

		const walker = document.createTreeWalker(
			element,
			NodeFilter.SHOW_TEXT
		);

		const textNodes = [];


		/*
		 * Сначала собираем все текстовые узлы.
		 *
		 * Нельзя изменять DOM непосредственно во время
		 * обхода TreeWalker.
		 */
		while (walker.nextNode()) {
			textNodes.push(walker.currentNode);
		}


		textNodes.forEach(node => {

			const fragment = document.createDocumentFragment();


			[...node.textContent].forEach(character => {

				const letter = document.createElement('span');

				letter.className = 'js-letter';
				letter.textContent = character;

				fragment.appendChild(letter);
				letters.push(letter);

			});


			node.replaceWith(fragment);

		});


		return letters;
	}

    //////////////////////////////////////////////////////////////////
    // [ Decor Videos ]

        function initDecorVideos() {
        const videos = document.querySelectorAll('[data-decor-video]');

        if (!videos.length) {
            return;
        }

        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    const video = entry.target;
                    const type = video.dataset.decorVideo;

                    if (!entry.isIntersecting) {
                        return;
                    }

                    // --------------------------------------------------
                    // Loop

                    if (type === 'loop') {
                        video.play().catch(function (error) {
                            console.warn('Video play failed:', error);
                        });

                        return;
                    }

                    // --------------------------------------------------
                    // Once

                    if (type === 'once') {
                        if (video.dataset.played === 'true') {
                            return;
                        }

                        const playVideo = function () {
                            video.play()
                                .then(function () {
                                    video.dataset.played = 'true';
                                })
                                .catch(function (error) {
                                    console.warn('Video play failed:', error);
                                });
                        };

                        // Если видео уже готово к воспроизведению
                        if (video.readyState >= 3) {
                            playVideo();
                        } else {
                            // Ждём, пока браузер сможет его воспроизвести
                            video.addEventListener(
                                'canplay',
                                playVideo,
                                { once: true }
                            );
                        }
                    }
                });
            },
            {
                threshold: 0.3
            }
        );

        videos.forEach(function (video) {
            video.controls = false;
            video.muted = true;
            video.playsInline = true;

            observer.observe(video);
        });
    }

    //////////////////////////////////////////////////////////////////
    // [ Decor Videos ]

    function initCardMagneticPlayBtn() {
        const magneticCards = document.querySelectorAll('.cardMedia');

        const desktopMedia = window.matchMedia('(min-width: 1200px)');

        if (desktopMedia.matches) {
        magneticCards.forEach((card) => {
            const button = card.querySelector('.card-play');

            if (!button) {
            return;
            }

            const distance = Number(
            button.dataset.magneticDistance || 50
            );

            const strength = Number(
            button.dataset.magneticStrength || 0.35
            );

            let animationFrame;

            card.addEventListener('mousemove', (event) => {
            cancelAnimationFrame(animationFrame);

            animationFrame = requestAnimationFrame(() => {
                const rect = button.getBoundingClientRect();

                const closestX = Math.max(
                rect.left,
                Math.min(event.clientX, rect.right)
                );

                const closestY = Math.max(
                rect.top,
                Math.min(event.clientY, rect.bottom)
                );

                const diffX = event.clientX - closestX;
                const diffY = event.clientY - closestY;

                const currentDistance = Math.sqrt(
                diffX * diffX + diffY * diffY
                );

                if (currentDistance > distance) {
                button.style.setProperty('--magnetic-x', '0px');
                button.style.setProperty('--magnetic-y', '0px');

                return;
                }

                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const moveX = (event.clientX - centerX) * strength;
                const moveY = (event.clientY - centerY) * strength;

                button.style.setProperty(
                '--magnetic-x',
                `${moveX}px`
                );

                button.style.setProperty(
                '--magnetic-y',
                `${moveY}px`
                );
            });
            });

            card.addEventListener('mouseleave', () => {
            cancelAnimationFrame(animationFrame);

            button.style.setProperty('--magnetic-x', '0px');
            button.style.setProperty('--magnetic-y', '0px');
            });
        });
        }
    }


    //////////////////////////////////////////////////////////////////
    // [ Init All ]

    initWow();
    initFixedHeader();
    initBackToTop();
    initSwipers();
    initMasks();
    initFancybox();
    initAccordionScroll();
    initCloseOffcanvas();

    initStrikeAnimations();
    initTypewriterAnimations();
    initDecorVideos();
    initCardMagneticPlayBtn();

});