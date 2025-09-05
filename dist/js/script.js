// Ширина окна для ресайза
WW = window.innerWidth || document.clientWidth || document.getElementsByTagName('body')[0].clientWidth
WH = window.innerHeight || document.clientHeight || document.getElementsByTagName('body')[0].clientHeight
BODY = document.getElementsByTagName('body')[0]
OVERLAY = document.querySelector('.overlay')

document.addEventListener('DOMContentLoaded', function () {
	// Основной слайдер на главной
	let first_section = document.querySelector('.first_section .swiper')

	if (first_section) {
		new Swiper('.first_section .swiper', {
			loop: true,
			speed: 500,
			watchSlidesProgress: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			spaceBetween: 17,
			slidesPerView: 'auto',
			scrollbar: {
				el: '.swiper-scrollbar',
				draggable: true,
			},
			breakpoints: {
				0: {
					centeredSlides: true,
				},
				480: {
					centeredSlides: false
				}
			}
		})
	}


	// Галерея
	const gallerySliders = [],
		gallery = document.querySelectorAll('.gallery .swiper')

	gallery.forEach(function (el, i) {
		el.classList.add('gallery_s' + i)

		let options = {
			loop: true,
			speed: 500,
			watchSlidesProgress: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev'
			},
			preloadImages: false,
			lazy: {
				enabled: true,
				checkInView: true,
				loadOnTransitionStart: true,
				loadPrevNext: true
			},
			spaceBetween: 20,
			slidesPerView: 1
		}

		gallerySliders.push(new Swiper('.gallery_s' + i, options))
	})


	// Карусель товаров
	const starsSliders = [],
		stars = document.querySelectorAll('.stars .swiper')

	stars.forEach(function (el, i) {
		el.classList.add('stars_s' + i)

		let options = {
			loop: true,
			speed: 500,
			watchSlidesProgress: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			preloadImages: false,
			lazy: {
				enabled: true,
				checkInView: true,
				loadOnTransitionStart: true,
				loadPrevNext: true
			},
			scrollbar: {
				el: '.swiper-scrollbar',
				draggable: true,
			},
			breakpoints: {
				0: {
					centeredSlides: true,
					spaceBetween: 19,
					slidesPerView: 'auto'
				},
				480: {
					centeredSlides: false,
					spaceBetween: 19,
					slidesPerView: 2
				},
				768: {
					spaceBetween: 19,
					slidesPerView: 3
				},
				1024: {
					spaceBetween: 19,
					slidesPerView: 4
				}
			}
		}

		starsSliders.push(new Swiper('.stars_s' + i, options))
	})


	// Fancybox
	Fancybox.defaults.autoFocus = false
	Fancybox.defaults.trapFocus = false
	Fancybox.defaults.dragToClose = false
	Fancybox.defaults.placeFocusBack = false
	Fancybox.defaults.l10n = {
		CLOSE: "Закрыть",
		NEXT: "Следующий",
		PREV: "Предыдущий",
		MODAL: "Вы можете закрыть это модальное окно нажав клавишу ESC"
	}

	Fancybox.defaults.template = {
		closeButton: '<svg><use xlink:href="images/sprite.svg#ic_close"></use></svg>',
		spinner: '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="25 25 50 50" tabindex="-1"><circle cx="50" cy="50" r="20"/></svg>',
		main: null
	}


	// Всплывающие окна
	const modalBtns = document.querySelectorAll('.modal_btn')

	if (modalBtns) {
		modalBtns.forEach(el => {
			el.addEventListener('click', e => {
				e.preventDefault()

				$("#order_modal2 input[name='type']").val(el.getAttribute('data-title'))

				Fancybox.close()

				Fancybox.show([{
					src: document.getElementById(el.getAttribute('data-modal')),
					type: 'inline'
				}])
			})
		})
	}


	$('.modal .close_btn').click(function (e) {
		e.preventDefault()

		Fancybox.close()
	})


	// Увеличение картинки
	Fancybox.bind('.fancy_img', {
		Image: {
			zoom: false,
		},
		Thumbs: {
			autoStart: false,
		}
	})


	// Моб. меню
	const mobMenuBtn = document.querySelector('.mob_header .mob_menu_btn'),
		mobMenu = document.querySelector('header')

	if (mobMenuBtn) {
		mobMenuBtn.addEventListener('click', e => {
			e.preventDefault()

			mobMenuBtn.classList.toggle('active')
			BODY.classList.toggle('menu_open')
			mobMenu.classList.toggle('show')
		})
	}

	if ($(window).width() < 1279) {
		$('body').on('click', 'header .menu_item > a', function (e) {
			mobMenuBtn.classList.toggle('active')
			BODY.classList.toggle('menu_open')
			mobMenu.classList.toggle('show')
		});
	}




	// Табы
	var locationHash = window.location.hash

	$('body').on('click', '.tabs button', function (e) {
		e.preventDefault()

		if (!$(this).hasClass('active')) {
			const $parent = $(this).closest('.tabs_container'),
				activeTab = $(this).data('content'),
				$activeTabContent = $(activeTab),
				level = $(this).data('level')

			$parent.find('.tabs:first button').removeClass('active')
			$parent.find('.tab_content.' + level).removeClass('active')

			$(this).addClass('active')
			$activeTabContent.addClass('active')
		}
	})

	$('body').on('change', '.mob_select select', function (e) {
		e.preventDefault()

		const $parent = $(this).closest('.tabs_container'),
			activeTab = $(this).val(),
			$activeTabContent = $(activeTab),
			level = "level1"


		//$parent.find('.tabs:first button').removeClass('active')
		$parent.find('.tab_content.' + level).removeClass('active')
		//$(this).addClass('active')
		$activeTabContent.addClass('active')

	})

	if (locationHash && $('.tabs_container').length) {
		const $activeTab = $(`.tabs button[data-content="${locationHash}"]`),
			$activeTabContent = $(locationHash),
			$parent = $activeTab.closest('.tabs_container'),
			level = $activeTab.data('level')

		$parent.find('.tabs:first button').removeClass('active')
		$parent.find('.tab_content.' + level).removeClass('active')

		$activeTab.addClass('active')
		$activeTabContent.addClass('active')

		$('html, body').stop().animate({ scrollTop: $activeTabContent.offset().top }, 1000)
	}


	// Маска ввода
	const phoneInputs = document.querySelectorAll('input[type=tel]')

	if (phoneInputs) {
		phoneInputs.forEach(el => {
			IMask(el, {
				mask: '+{7} (000) 000-00-00',
				lazy: true
			})
		})
	}


	// Фокус при клике на название поля
	const formLabels = document.querySelectorAll('form .label')

	if (formLabels) {
		formLabels.forEach(el => {
			el.addEventListener('click', e => {
				e.preventDefault()

				el.closest('.line').querySelector('.input, textarea').focus()
			})
		})
	}


	// Отправка квиза
	$('.submit_btn').click(function (e) {
		e.preventDefault()

		// Убираем предыдущие ошибки
		$('.field-error').remove();

		// Валидация обязательных полей
		const nameInput = $('input[name="text-946"]');
		const phoneInput = $('input[name="tel-1"]');
		const agreeCheckbox = $('input[name="agree[]"]');

		let isValid = true;

		// Проверяем имя
		if (!nameInput.val() || nameInput.val().trim() === '') {
			isValid = false;
			nameInput.addClass('error');
			// Добавляем ошибку под полем имени
			nameInput.closest('.field').append('<div class="field-error">Пожалуйста, введите ваше имя</div>');
		} else {
			nameInput.removeClass('error');
		}

		// Проверяем телефон
		if (!phoneInput.val() || phoneInput.val().trim() === '' || phoneInput.val().includes('_')) {
			isValid = false;
			phoneInput.addClass('error');
			// Добавляем ошибку под полем телефона
			phoneInput.closest('.field').append('<div class="field-error">Пожалуйста, введите корректный номер телефона</div>');
		} else {
			phoneInput.removeClass('error');
		}

		// Проверяем чекбокс согласия
		if (!agreeCheckbox.is(':checked')) {
			isValid = false;
			agreeCheckbox.closest('.wpcf7-form-control-wrap').addClass('error');
			// Добавляем ошибку под чекбоксом
			agreeCheckbox.closest('.agree').append('<div class="field-error">Необходимо согласиться с условиями</div>');
		} else {
			agreeCheckbox.closest('.wpcf7-form-control-wrap').removeClass('error');
		}

		// Если форма не валидна, прерываем отправку
		if (!isValid) {
			console.log('not valid');
			return false;
		}

		// Если все поля заполнены корректно, закрываем модал и показываем успех
		Fancybox.close()

		Fancybox.show([{
			src: '#success_modal',
			type: 'inline'
		}])
	})

	// Убираем ошибки при вводе в поля
	$('input[name="text-946"], input[name="tel-1"]').on('input', function () {
		$(this).removeClass('error');
		$(this).closest('.field').find('.field-error').remove();
	});

	// Убираем ошибки при изменении чекбокса
	$('input[name="agree[]"]').on('change', function () {
		$(this).closest('.wpcf7-form-control-wrap').removeClass('error');
		$(this).closest('.agree').find('.field-error').remove();
	});


	// Кастомный select
	const selects = document.querySelectorAll('select')

	if (selects) {
		selects.forEach(el => NiceSelect.bind(el))
	}


	// Квиз
	var currentStep = 1,
		totalSteps = 5

	$('.quiz .head .count .total').text(4)


	let quizStep1Slider = document.querySelector('.quiz .step1 .swiper')

	if (quizStep1Slider) {
		new Swiper('.quiz .step1 .swiper', {
			loop: false,
			speed: 500,
			watchSlidesProgress: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			preloadImages: false,
			lazy: {
				enabled: true,
				checkInView: true,
				loadOnTransitionStart: true,
				loadPrevNext: true
			},
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev'
			},
			scrollbar: {
				el: '.swiper-scrollbar',
				draggable: true,
			},
			breakpoints: {
				0: {
					spaceBetween: 15,
					slidesPerView: 'auto'
				},
				480: {
					spaceBetween: 15,
					slidesPerView: 2
				},
				768: {
					spaceBetween: 15,
					slidesPerView: 3
				},
				1248: {
					spaceBetween: 15,
					slidesPerView: 3
				}
			}
		})
	}


	$heightRange = $('.quiz #height_range').ionRangeSlider({
		min: 120,
		max: 210,
		from: 168,
		step: 1,
		postfix: ' см'
	}).data("ionRangeSlider")


	$('.quiz .next_btn').click(function (e) {
		e.preventDefault()

		currentStep++

		$('.quiz .step').hide()
		$('.quiz .step' + currentStep).fadeIn(500)

		$('.quiz .head .count .current').text(currentStep)
		$('.quiz .head .progress div').width(currentStep / totalSteps * 100 + '%')

		/*$('.quiz .manager .text').hide()
		$('.quiz .manager .text' + currentStep).fadeIn(300)*/

		currentStep > 1
			? $('.quiz .prev_btn').removeClass('disabled')
			: $('.quiz .prev_btn').addClass('disabled')

		if (currentStep == totalSteps) {
			$('.quiz .head').hide()
			$('.quiz .next_btn').addClass('disabled')
		} else {
			$('.quiz .head').show()
			$('.quiz .next_btn').removeClass('disabled')
		}

		$('.quiz .manager .text').html($('.quiz .step' + currentStep).data("text"))

		/*if((currentStep == 2 && $(".wpcf7 input[name='checkbox-3[]']:checked" ).length<=0) || (currentStep == 3 && $(".wpcf7 input[name='checkbox-4[]']:checked" ).length<=0)) {
			$('.quiz .next_btn').addClass('disabled')
		}*/
	})


	$('.quiz .prev_btn').click(function (e) {
		e.preventDefault()

		currentStep = currentStep - 1

		$('.quiz .step').hide()
		$('.quiz .step' + currentStep).fadeIn(500)

		$('.quiz .head .count .current').text(currentStep)
		$('.quiz .head .progress div').width(currentStep / totalSteps * 100 + '%')

		$('.quiz .manager .text').hide()
		$('.quiz .manager .text' + currentStep).fadeIn(300)

		currentStep > 1
			? $('.quiz .prev_btn').removeClass('disabled')
			: $('.quiz .prev_btn').addClass('disabled')

		if (currentStep == totalSteps) {
			$('.quiz .head').hide()
			$('.quiz .next_btn').addClass('disabled')
		} else {
			$('.quiz .head').show()
			$('.quiz .next_btn').removeClass('disabled')
		}
	})

	$('.quiz .next_btn').addClass('disabled')

	$(document).on('change', ".wpcf7 input[name='check-1[]']", function (e) {
		$('.quiz .next_btn').addClass('disabled')
		$(".wpcf7 input[name='check-1[]']:checked").each(function () {
			$('.quiz .next_btn').removeClass('disabled')
		});
	});

	$(document).on('change', ".wpcf7 input[name='checkbox-3[]']", function (e) {
		$('.quiz .next_btn').addClass('disabled')
		$(".wpcf7 input[name='checkbox-3[]']:checked").each(function () {
			$('.quiz .next_btn').removeClass('disabled')
		});
	});

	$(document).on('change', ".wpcf7 input[name='checkbox-4[]']", function (e) {
		console.log(123);
		$('.quiz .next_btn').addClass('disabled')
		$(".wpcf7 input[name='checkbox-4[]']:checked").each(function () {
			$('.quiz .next_btn').removeClass('disabled')
		});
	});


	/*$('.all_link').click(function (e) {
		e.preventDefault()
		$(this).prev().find("hide").removeClass("hide");
		$(this).hide();
	});*/

	$(".all_link").click(function (e) {
		e.preventDefault();
		//$(".object_items .object_item").removeClass("hide");
		let products = $(this).prev().find(".hide");
		products.each(function (i, elem) {
			if (i == 6) {
				return false;
			}
			$(elem).removeClass("hide");
		});

		if (products.length < 6) {
			$(this).hide();
		}
	});

	$(".wpcf7 input[type='checkbox']:not(input[name='agree[]'])").on('change', function (e) {
		//$(this).closest(".wpcf7").find(".wpcf7-form-control-wrap:not(span[data-name='agree'])").removeClass("checked");
		$(this).closest(".wpcf7-form-control-wrap").toggleClass("checked");
	});

	$(".wpcf7 input[type='radio']:not(input[name='agree[]'])").on('change', function (e) {
		//$(this).closest(".wpcf7").find(".wpcf7-form-control-wrap:not(span[data-name='agree'])").removeClass("checked");
		$(this).closest("label").parent().find(".wpcf7-form-control-wrap").removeClass("checked");
		$(this).closest(".wpcf7-form-control-wrap").toggleClass("checked");
	});

	$(".contact label input:checked").each(function (index) {
		$(this).parent().parent().parent().addClass("checked");
	});

	$(document).on('change', ".wpcf7 input[name='agree[]']", function (e) {
		if ($(this).closest(".wpcf7-form-control-wrap").hasClass("checked")) {
			$(this).closest(".wpcf7-form-control-wrap").removeClass("checked");
		}
		else {
			$(this).closest(".wpcf7-form-control-wrap").addClass("checked");
		}
	});

	document.addEventListener('wpcf7mailsent', function (event) {
		Fancybox.close()
		Fancybox.show([{
			src: '#success_modal',
			type: 'inline'
		}])
	}, false);
})



window.addEventListener('load', function () {
	// Отзывы
	initReviewsSliders()
})



window.addEventListener('resize', function () {
	WH = window.innerHeight || document.clientHeight || document.getElementsByTagName('body')[0].clientHeight

	let windowW = window.outerWidth

	if (typeof WW !== 'undefined' && WW != windowW) {
		// Перезапись ширины окна
		WW = window.innerWidth || document.clientWidth || document.getElementsByTagName('body')[0].clientWidth


		// Отзывы
		initReviewsSliders()


		// Моб. версия
		if (!fakeResize) {
			fakeResize = true
			fakeResize2 = false

			document.getElementsByTagName('meta')['viewport'].content = 'width=device-width, initial-scale=1, maximum-scale=1'
		}

		if (!fakeResize2) {
			fakeResize2 = true

			if (windowW < 360) document.getElementsByTagName('meta')['viewport'].content = 'width=360, user-scalable=no'
		} else {
			fakeResize = false
			fakeResize2 = true
		}
	}
})



// Отзывы
reviewsSliders = []

function initReviewsSliders() {
	if ($(window).width() < 768) {
		if ($('.reviews .row').length) {
			$('.reviews .row > *').addClass('swiper-slide')
			$('.reviews .row').addClass('swiper-wrapper').removeClass('row')

			$('.reviews .swiper').each(function (i) {
				$(this).addClass('reviews_s' + i)

				let options = {
					loop: false,
					speed: 500,
					watchSlidesProgress: true,
					slideActiveClass: 'active',
					slideVisibleClass: 'visible',
					slidesPerView: 1,
					spaceBetween: 13,
					navigation: {
						nextEl: '.swiper-button-next',
						prevEl: '.swiper-button-prev'
					}
				}

				reviewsSliders.push(new Swiper('.reviews_s' + i, options))
			})
		}
	} else {
		reviewsSliders.forEach(element => element.destroy(true, true))

		reviewsSliders = []

		$('.reviews .swiper-wrapper').addClass('row').removeClass('swiper-wrapper')
		$('.reviews .row > *').removeClass('swiper-slide')
	}
}