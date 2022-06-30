
let subTabs = document.querySelectorAll("._sub-tabs");
for (let index = 0; index < subTabs.length; index++) {
	let subTab = subTabs[index];
	let subTabs_items = subTab.querySelectorAll("._sub-tabs-item");
	let subTabs_blocks = subTab.querySelectorAll("._sub-tabs-block");
	for (let index = 0; index < subTabs_items.length; index++) {
		let subTabs_item = subTabs_items[index];
		subTabs_item.addEventListener("click", function (e) {
			for (let index = 0; index < subTabs_items.length; index++) {
				let subTabs_item = subTabs_items[index];
				subTabs_item.classList.remove('_active');
				subTabs_blocks[index].classList.remove('_active');
			}
			subTabs_item.classList.add('_active');
			subTabs_blocks[index].classList.add('_active');
			e.preventDefault();
		});
	}
}
/*----------------------------------------*/
let anchors = document.querySelectorAll('a[href*="#"]');
for (let anchor of anchors) {
	anchor.addEventListener('click', function (event) {
		event.preventDefault();
		const blockID = anchor.getAttribute('href');
		document.querySelector('' + blockID).scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	});
};

/*----------------------------------------*/
function showAnchor() {
	window.addEventListener('scroll', scroll_scroll);
	function scroll_scroll() {
		let src_value = currentScroll = pageYOffset;
		let anchor = document.querySelector('.anchor-footer');
		if (anchor !== null) {
			if (src_value > 250) {
				anchor.classList.add('_active');
			} else {
				anchor.classList.remove('_active');
			}
		}
	}
}
showAnchor();
// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle

"use strict";


function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();
function email_test(input) {
	return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
}
var ua = window.navigator.userAgent;
var msie = ua.indexOf("MSIE ");
var isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };
function isIE() {
	ua = navigator.userAgent;
	var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
	return is_ie;
}
if (isIE()) {
	document.querySelector('html').classList.add('ie');
}
if (isMobile.any()) {
	document.querySelector('html').classList.add('_touch');
}

//======================

//testWebp
function testWebP(callback) {
	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
testWebP(function (support) {
	if (support === true) {
		document.querySelector('html').classList.add('_webp');
	} else {
		document.querySelector('html').classList.add('_no-webp');
	}
});

//======================

//_ibg
function ibg() {
	if (isIE()) {
		let ibg = document.querySelectorAll("._ibg");
		for (var i = 0; i < ibg.length; i++) {
			if (ibg[i].querySelector('img') && ibg[i].querySelector('img').getAttribute('src') != null) {
				ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
			}
		}
	}
}
ibg();

//======================

//wrapper_loaded
window.addEventListener("load", function () {
	if (document.querySelector('.wrapper')) {
		setTimeout(function () {
			document.querySelector('.wrapper').classList.add('_loaded');
		}, 0);
	}
});

let unlock = true;

//=====================

//Menu
let iconMenu = document.querySelector(".top-header__icon");
if (iconMenu != null) {
	let delay = 200;
	let menuBody = document.querySelector(".top-header__menu");
	iconMenu.addEventListener("click", function (e) {
		if (unlock) {
			body_lock(delay);
			iconMenu.classList.toggle("_active");
			menuBody.classList.toggle("_active");
		}
	});
};

//=====================

//BodyLock
function body_lock(delay) {
	let body = document.querySelector("body");
	if (body.classList.contains('_lock')) {
		body_lock_remove(delay);
	} else {
		body_lock_add(delay);
	}
}
function body_lock_remove(delay) {
	let body = document.querySelector("body");
	if (unlock) {
		let lock_padding = document.querySelectorAll("._lp");
		setTimeout(() => {
			for (let index = 0; index < lock_padding.length; index++) {
				const el = lock_padding[index];
				el.style.paddingRight = '0px';
			}
			body.style.paddingRight = '0px';
			body.classList.remove("_lock");
		}, delay);

		unlock = false;
		setTimeout(function () {
			unlock = true;
		}, delay);
	}
}
function body_lock_add(delay) {
	let body = document.querySelector("body");
	if (unlock) {
		let lock_padding = document.querySelectorAll("._lp");
		for (let index = 0; index < lock_padding.length; index++) {
			const el = lock_padding[index];
			el.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
		}
		body.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
		body.classList.add("_lock");

		unlock = false;
		setTimeout(function () {
			unlock = true;
		}, delay);
	}
}

//=====================

//Tabs
let tabs = document.querySelectorAll("._tabs");
for (let index = 0; index < tabs.length; index++) {
	let tab = tabs[index];
	let tabs_items = tab.querySelectorAll("._tabs-item");
	let tabs_blocks = tab.querySelectorAll("._tabs-block");
	for (let index = 0; index < tabs_items.length; index++) {
		let tabs_item = tabs_items[index];
		tabs_item.addEventListener("click", function (e) {
			for (let index = 0; index < tabs_items.length; index++) {
				let tabs_item = tabs_items[index];
				tabs_item.classList.remove('_active');
				tabs_blocks[index].classList.remove('_active');
			}
			tabs_item.classList.add('_active');
			tabs_blocks[index].classList.add('_active');
			e.preventDefault();
		});
	}
}
//=====================

// Spollers custom
const spollersArray = document.querySelectorAll('[data-spollers]');
if (spollersArray.length > 0) {
	//получение обычных спойлеров
	const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
		return !item.dataset.spollers.split(",")[0];
	});

	//инициализаця обычных слайдеров
	if (spollersRegular.length > 0) {
		initSpollers(spollersRegular);
	}

	// получение слайдеров с медиа запросом
	const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
		return item.dataset.spollers.split(",")[0];
	});


	//инициализация слайдеров с медиа запросом
	if (spollersMedia.length > 0) {
		const breakpointsArray = [];
		spollersMedia.forEach(item => {
			const params = item.dataset.spollers;
			const breakpoint = {};
			const paramsArray = params.split(",");
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		});


		//Получаем уникальные брекпоинты
		let mediaQueries = breakpointsArray.map(function (item) {
			return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
		});
		mediaQueries = mediaQueries.filter(function (item, index, self) {
			return self.indexOf(item) === index;
		});


		//Работаем с каждым брикпоинтом
		mediaQueries.forEach(breakpoint => {
			const paramsArray = breakpoint.split(",");
			const mediaBreakpoint = paramsArray[1];
			const mediaType = paramsArray[2];
			const matchMedia = window.matchMedia(paramsArray[0]);

			//Обекты с нужними условиями
			const spollersArray = breakpointsArray.filter(function (item) {
				if (item.value === mediaBreakpoint && item.type === mediaType) {
					return true;
				}
			});
			//Cобытия
			matchMedia.addListener(function () {
				initSpollers(spollersArray, matchMedia);
			});
			initSpollers(spollersArray, matchMedia)
		});
	}


	//Инициализация
	function initSpollers(spollersArray, matchMedia = false) {
		spollersArray.forEach(spollersBlock => {
			spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
			if (matchMedia.matches || !matchMedia) {
				spollersBlock.classList.add('_init');
				initSpollerBody(spollersBlock);
				spollersBlock.addEventListener("click", setSpollerAction);
			} else {
				spollersBlock.classList.remove('_init');
				initSpollerBody(spollersBlock, false);
				spollersBlock.removeEventListener("click", setSpollerAction);
			}
		});
	}


	//Робота с контентом
	function initSpollerBody(spollersBlock, hideSpollerBody = true) {
		const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
		if (spollerTitles.length > 0) {
			spollerTitles.forEach(spollerTitle => {
				if (hideSpollerBody) {
					spollerTitle.removeAttribute('tabindex');
					if (!spollerTitle.classList.contains('_active')) {
						spollerTitle.nextElementSibling.hidden = true;
					};
				} else {
					spollerTitle.setAttribute('tabindex', '-1');
					spollerTitle.nextElementSibling.hidden = false;
				}
			});
		}
	}


	//Выполняется когда мы кликаем на стрелку либо заголовок
	function setSpollerAction(e) {
		const el = e.target;
		if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
			const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
			const spollersBlock = spollerTitle.closest('[data-spollers]');
			const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
			//Условие нужно ли добавлять акардеон
			if (!spollersBlock.querySelectorAll('._slide').length) {
				if (oneSpoller && !spollerTitle.classList.contains('_active')) {
					hideSpollersBody(spollersBlock);
				}
				spollerTitle.classList.toggle('_active');
				_slideToggle(spollerTitle.nextElementSibling, 500);
			}
			e.preventDefault();
		}
	}
	function hideSpollersBody(spollersBlock) {
		const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
		if (spollerActiveTitle) {
			spollerActiveTitle.classList.remove('_active');
			_slideUp(spollerActiveTitle.nextElementSibling, 500);
		}
	}
}

//=====================

// SlideToggle custom
// Анимирует скрытие
let _slideUp = (target, duration = 100) => {
	target.style.transitionProperty = 'height, margin, padding';
	target.style.transitionDuration = duration + 'ms';
	target.style.height = target.offsetHeight + 'px';
	target.offsetHeight;
	target.style.overflow = 'hidden';
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	window.setTimeout(() => {
		target.style.display = 'none';
		target.style.removeProperty('height');
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		target.style.removeProperty('overflow');
		target.style.removeProperty('transition-duration');
		target.style.removeProperty('transition-property');
		target.classList.remove('_slide');
	}, duration);
}
// Анимирует показ
let _slideDown = (target, duration = 100) => {
	target.style.removeProperty('display');
	let display = window.getComputedStyle(target).display;
	if (display === 'none')
		display = 'block';

	target.style.display = display;
	let height = target.offsetHeight;
	target.style.overflow = 'hidden';
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	target.offsetHeight;
	target.style.transitionProperty = "height, margin, padding";
	target.style.transitionDuration = duration + 'ms';
	target.style.height = height + 'px';
	target.style.removeProperty('padding-top');
	target.style.removeProperty('padding-bottom');
	target.style.removeProperty('margin-top');
	target.style.removeProperty('margin-bottom');
	window.setTimeout(() => {
		target.style.removeProperty('height');
		target.style.removeProperty('overflow');
		target.style.removeProperty('transition-duration');
		target.style.removeProperty('transition-property');
		target.classList.remove('_slide');
	}, duration);
}
// Комдинация двох функций
let _slideToggle = (target, duration = 100) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		if (window.getComputedStyle(target).display === 'none') {
			return _slideDown(target, duration);
		} else {
			return _slideUp(target, duration);
		}
	}
}

//=====================

//IsHidden
function _is_hidden(el) {
	return (el.offsetParent === null)
}

//=====================

//Полифилы
(function () {
	// проверяем поддержку
	if (!Element.prototype.closest) {
		// реализуем
		Element.prototype.closest = function (css) {
			var node = this;
			while (node) {
				if (node.matches(css)) return node;
				else node = node.parentElement;
			}
			return null;
		};
	}
})();
(function () {
	// проверяем поддержку
	if (!Element.prototype.matches) {
		// определяем свойство
		Element.prototype.matches = Element.prototype.matchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector;
	}
})();
window.onload = function () {
	if (document.querySelector('.discounts__slider')) {
		new Swiper('.discounts__slider', {
			slidesPerView: 1,
			slidesPerGroup: 1,
			initialSlide: 0,
			parallax: true,

			simulateTouch: true,
			touthRadio: 1,
			touthAngle: 45,
			grabCursor: true,

			observer: true,
			observeParents: true,
			autoHeight: false,
			speed: 800,


			pagination: {
				el: '.discounts__pagination',
				clickable: true,
			},

			keyboard: {
				//включить выкльучит
				//возможность управления
				enabled: true,
				//включить выкльучит
				//стрелками
				//только когда слайдер
				//в пределах вьюпорта
				onlyInViewport: true,
				//включить выкльучит
				//управление клавишами
				//pageUP, pageDown
				pageUpDown: true,
			},

			navigation: {
				nextEl: '.discounts__button-next',
				prevEl: '.discounts__button-prev',
			},
		});
	}
	if (document.querySelector('.promotions__slider')) {
		new Swiper('.promotions__slider', {
			slidesPerView: 3,
			slidesPerGroup: 1,
			initialSlide: 0,
			parallax: true,

			simulateTouch: true,
			touthRadio: 1,
			touthAngle: 45,
			grabCursor: true,

			observer: true,
			observeParents: true,
			autoHeight: false,
			speed: 800,

			breakpoints: {
				320: {
					slidesPerView: 1.6,
					spaceBetween: 19,
				},
				650: {
					slidesPerView: 2,
					spaceBetween: 23,
				},
				991.98: {
					slidesPerView: 3,
					spaceBetween: 30,
				},
			},

			pagination: {
				el: '.control-slider__pagination_1',
				clickable: true,
			},

			keyboard: {
				//включить выкльучит
				//возможность управления
				enabled: true,
				//включить выкльучит
				//стрелками
				//только когда слайдер
				//в пределах вьюпорта
				onlyInViewport: true,
				//включить выкльучит
				//управление клавишами
				//pageUP, pageDown
				pageUpDown: true,
			},

			navigation: {
				nextEl: '.control-slider__button-next_1',
				prevEl: '.control-slider__button-prev_1',
			},
		});
	}
	if (document.querySelector('.stories__slider')) {
		new Swiper('.stories__slider', {
			slidesPerView: 6,
			slidesPerGroup: 1,
			initialSlide: 0,
			parallax: true,
			spaceBetween: 35,

			simulateTouch: true,
			touthRadio: 1,
			touthAngle: 45,
			grabCursor: true,

			observer: true,
			observeParents: true,
			autoHeight: false,
			speed: 600,

			breakpoints: {
				320: {
					slidesPerView: 2,
					spaceBetween: 15,
				},
				479: {
					slidesPerView: 3,
					spaceBetween: 19,
				},
				650: {
					slidesPerView: 4,
				},
				800: {
					slidesPerView: 5,
					spaceBetween: 30,
				},
				1100: {
					slidesPerView: 6,
					spaceBetween: 35,
				},
			},

			pagination: {
				el: '.control-slider__pagination_2',
				clickable: true,
			},

			keyboard: {
				//включить выкльучит
				//возможность управления
				enabled: true,
				//включить выкльучит
				//стрелками
				//только когда слайдер
				//в пределах вьюпорта
				onlyInViewport: true,
				//включить выкльучит
				//управление клавишами
				//pageUP, pageDown
				pageUpDown: true,
			},

			navigation: {
				nextEl: '.control-slider__button-next_2',
				prevEl: '.control-slider__button-prev_2',
			},
		});
	}
	if (document.querySelector('.banner-one__slider')) {
		new Swiper('.banner-one__slider', {
			slidesPerView: 2,
			slidesPerGroup: 1,
			initialSlide: 0,
			parallax: true,
			spaceBetween: 30,

			simulateTouch: true,
			touthRadio: 1,
			touthAngle: 45,
			grabCursor: true,

			observer: true,
			observeParents: true,
			autoHeight: false,
			speed: 600,

			breakpoints: {
				320: {
					spaceBetween: 20,
				},
				767: {
					spaceBetween: 30,
				},
			},

			pagination: {
				el: '.control-slider__pagination_3',
				clickable: true,
			},

			keyboard: {
				//включить выкльучит
				//возможность управления
				enabled: true,
				//включить выкльучит
				//стрелками
				//только когда слайдер
				//в пределах вьюпорта
				onlyInViewport: true,
				//включить выкльучит
				//управление клавишами
				//pageUP, pageDown
				pageUpDown: true,
			},

			navigation: {
				nextEl: '.control-slider__button-next_3',
				prevEl: '.control-slider__button-prev_3',
			},
		});
	}
	if (document.querySelector('.recommendation__slider')) {
		new Swiper('.recommendation__slider', {
			slidesPerView: 4,
			slidesPerGroup: 1,
			initialSlide: 0,
			parallax: true,
			spaceBetween: 30,

			simulateTouch: true,
			touthRadio: 1,
			touthAngle: 45,
			grabCursor: true,

			observer: true,
			observeParents: true,
			autoHeight: false,
			speed: 600,

			breakpoints: {
				320: {
					spaceBetween: 20,
					slidesPerView: 1,
				},
				400: {
					spaceBetween: 20,
					slidesPerView: 2,
				},
				620: {
					spaceBetween: 30,
					slidesPerView: 3,
				},
				767: {
					slidesPerView: 4,
					spaceBetween: 30,
				},
			},

			pagination: {
				el: '.control-slider__pagination_4',
				clickable: true,
			},

			keyboard: {
				//включить выкльучит
				//возможность управления
				enabled: true,
				//включить выкльучит
				//стрелками
				//только когда слайдер
				//в пределах вьюпорта
				onlyInViewport: true,
				//включить выкльучит
				//управление клавишами
				//pageUP, pageDown
				pageUpDown: true,
			},

			navigation: {
				nextEl: '.control-slider__button-next_4',
				prevEl: '.control-slider__button-prev_4',
			},
		});
	}
	if (document.querySelector('.banner-two__slider')) {
		new Swiper('.banner-two__slider', {
			slidesPerView: 2,
			slidesPerGroup: 1,
			initialSlide: 0,
			parallax: true,
			spaceBetween: 30,

			simulateTouch: true,
			touthRadio: 1,
			touthAngle: 45,
			grabCursor: true,

			observer: true,
			observeParents: true,
			autoHeight: false,
			speed: 600,

			breakpoints: {
				320: {
					spaceBetween: 20,
				},
				767: {
					spaceBetween: 30,
				},
			},

			pagination: {
				el: '.control-slider__pagination_5',
				clickable: true,
			},

			keyboard: {
				//включить выкльучит
				//возможность управления
				enabled: true,
				//включить выкльучит
				//стрелками
				//только когда слайдер
				//в пределах вьюпорта
				onlyInViewport: true,
				//включить выкльучит
				//управление клавишами
				//pageUP, pageDown
				pageUpDown: true,
			},

			navigation: {
				nextEl: '.control-slider__button-next_5',
				prevEl: '.control-slider__button-prev_5',
			},
		});
	}
	if (document.querySelector('.brands__slider')) {
		new Swiper('.brands__slider', {
			slidesPerView: 6,
			slidesPerGroup: 1,
			initialSlide: 0,
			parallax: true,
			spaceBetween: 30,

			simulateTouch: true,
			touthRadio: 1,
			touthAngle: 45,
			grabCursor: true,

			observer: true,
			observeParents: true,
			autoHeight: false,
			speed: 600,

			breakpoints: {
				320: {
					spaceBetween: 20,
					slidesPerView: 2,
				},
				375: {
					spaceBetween: 20,
					slidesPerView: 3,
				},
				570: {
					spaceBetween: 20,
					slidesPerView: 4,
				},
				767: {
					spaceBetween: 30,
					slidesPerView: 5,
				},
				991: {
					slidesPerView: 6,
					spaceBetween: 30,
				},
			},

			pagination: {
				el: '.control-slider__pagination_6',
				clickable: true,
			},

			keyboard: {
				//включить выкльучит
				//возможность управления
				enabled: true,
				//включить выкльучит
				//стрелками
				//только когда слайдер
				//в пределах вьюпорта
				onlyInViewport: true,
				//включить выкльучит
				//управление клавишами
				//pageUP, pageDown
				pageUpDown: true,
			},

			navigation: {
				nextEl: '.control-slider__button-next_6',
				prevEl: '.control-slider__button-prev_6',
			},
		});
	}
	if (document.querySelector('.news__slider')) {
		new Swiper('.news__slider', {
			slidesPerView: 3,
			slidesPerGroup: 1,
			initialSlide: 0,
			parallax: true,
			spaceBetween: 30,

			simulateTouch: true,
			touthRadio: 1,
			touthAngle: 45,
			grabCursor: true,

			observer: true,
			observeParents: true,
			autoHeight: false,
			speed: 600,

			breakpoints: {
				320: {
					slidesPerView: 1,
					spaceBetween: 20,
				},
				575: {
					spaceBetween: 20,
					slidesPerView: 2,
				},
				767: {
					slidesPerView: 2,
					spaceBetween: 30,
				},
				991: {
					slidesPerView: 3,
					spaceBetween: 30,

				},
			},

			pagination: {
				el: '.control-slider__pagination_7',
				clickable: true,
			},

			keyboard: {
				//включить выкльучит
				//возможность управления
				enabled: true,
				//включить выкльучит
				//стрелками
				//только когда слайдер
				//в пределах вьюпорта
				onlyInViewport: true,
				//включить выкльучит
				//управление клавишами
				//pageUP, pageDown
				pageUpDown: true,
			},

			navigation: {
				nextEl: '.control-slider__button-next_7',
				prevEl: '.control-slider__button-prev_7',
			},
		});
	}
}







//let btn = document.querySelectorAll('button[type="submit"],input[type="submit"]');
let forms = document.querySelectorAll('form');
if (forms.length > 0) {
	for (let index = 0; index < forms.length; index++) {
		const el = forms[index];
		el.addEventListener('submit', form_submit);
	}
}
async function form_submit(e) {
	let btn = e.target;
	let form = btn.closest('form');
	let error = form_validate(form);
	if (error == 0) {
		let formAction = form.getAttribute('action') ? form.getAttribute('action').trim() : '#';
		let formMethod = form.getAttribute('method') ? form.getAttribute('method').trim() : 'GET';
		const message = form.getAttribute('data-message');
		const ajax = form.getAttribute('data-ajax');
		const test = form.getAttribute('data-test');

		//SendForm
		if (ajax) {
			e.preventDefault();
			let formData = new FormData(form);
			form.classList.add('_sending');
			let response = await fetch(formAction, {
				method: formMethod,
				body: formData
			});
			if (response.ok) {
				let result = await response.json();
				form.classList.remove('_sending');
				if (message) {
					popup_open(message + '-message');
				}
				form_clean(form);
			} else {
				alert("Ошибка");
				form.classList.remove('_sending');
			}
		}
		// If test
		if (test) {
			e.preventDefault();
			popup_open(message + '-message');
			form_clean(form);
		}
	} else {
		let form_error = form.querySelectorAll('._error');
		if (form_error && form.classList.contains('_goto-error')) {
			_goto(form_error[0], 1000, 50);
		}
		e.preventDefault();
	}
}
function form_validate(form) {
	let error = 0;
	let form_req = form.querySelectorAll('._req');
	if (form_req.length > 0) {
		for (let index = 0; index < form_req.length; index++) {
			const el = form_req[index];
			if (!_is_hidden(el)) {
				error += form_validate_input(el);
			}
		}
	}
	return error;
}
function form_validate_input(input) {
	let error = 0;
	let input_g_value = input.getAttribute('data-value');

	if (input.getAttribute("name") == "email" || input.classList.contains("_email")) {
		if (input.value != input_g_value) {
			let em = input.value.replace(" ", "");
			input.value = em;
		}
		if (email_test(input) || input.value == input_g_value) {
			form_add_error(input);
			error++;
		} else {
			form_remove_error(input);
		}
	} else if (input.getAttribute("type") == "checkbox" && input.checked == false) {
		form_add_error(input);
		error++;
	} else {
		if (input.value == '' || input.value == input_g_value) {
			form_add_error(input);
			error++;
		} else {
			form_remove_error(input);
		}
	}
	return error;
}
function form_add_error(input) {
	input.classList.add('_error');
	input.parentElement.classList.add('_error');

	let input_error = input.parentElement.querySelector('.form__error');
	if (input_error) {
		input.parentElement.removeChild(input_error);
	}
	let input_error_text = input.getAttribute('data-error');
	if (input_error_text && input_error_text != '') {
		input.parentElement.insertAdjacentHTML('beforeend', '<div class="form__error">' + input_error_text + '</div>');
	}
}
function form_remove_error(input) {
	input.classList.remove('_error');
	input.parentElement.classList.remove('_error');

	let input_error = input.parentElement.querySelector('.form__error');
	if (input_error) {
		input.parentElement.removeChild(input_error);
	}
}
function form_clean(form) {
	let inputs = form.querySelectorAll('input,textarea');
	for (let index = 0; index < inputs.length; index++) {
		const el = inputs[index];
		el.parentElement.classList.remove('_focus');
		el.classList.remove('_focus');
		el.value = el.getAttribute('data-value');
	}
	let checkboxes = form.querySelectorAll('.checkbox__input');
	if (checkboxes.length > 0) {
		for (let index = 0; index < checkboxes.length; index++) {
			const checkbox = checkboxes[index];
			checkbox.checked = false;
		}
	}
	let selects = form.querySelectorAll('select');
	if (selects.length > 0) {
		for (let index = 0; index < selects.length; index++) {
			const select = selects[index];
			const select_default_value = select.getAttribute('data-default');
			select.value = select_default_value;
			select_item(select);
		}
	}
}

//Placeholers
let inputs = document.querySelectorAll('input[data-value],textarea[data-value]');
inputs_init(inputs);

function inputs_init(inputs) {
	if (inputs.length > 0) {
		for (let index = 0; index < inputs.length; index++) {
			const input = inputs[index];
			const input_g_value = input.getAttribute('data-value');
			input_placeholder_add(input);
			if (input.value != '' && input.value != input_g_value) {
				input_focus_add(input);
			}
			input.addEventListener('focus', function (e) {
				if (input.value == input_g_value) {
					input_focus_add(input);
					input.value = '';
				}
				if (input.getAttribute('data-type') === "pass") {
					input.setAttribute('type', 'password');
				}
				if (input.classList.contains('_date')) {
					/*
					input.classList.add('_mask');
					Inputmask("99.99.9999", {
						//"placeholder": '',
						clearIncomplete: true,
						clearMaskOnLostFocus: true,
						onincomplete: function () {
							input_clear_mask(input, input_g_value);
						}
					}).mask(input);
					*/
				}
				if (input.classList.contains('_phone')) {
					//'+7(999) 999 9999'
					//'+38(999) 999 9999'
					//'+375(99)999-99-99'
					input.classList.add('_mask');
					Inputmask("+375 (99) 9999999", {
						//"placeholder": '',
						clearIncomplete: true,
						clearMaskOnLostFocus: true,
						onincomplete: function () {
							input_clear_mask(input, input_g_value);
						}
					}).mask(input);
				}
				if (input.classList.contains('_digital')) {
					input.classList.add('_mask');
					Inputmask("9{1,}", {
						"placeholder": '',
						clearIncomplete: true,
						clearMaskOnLostFocus: true,
						onincomplete: function () {
							input_clear_mask(input, input_g_value);
						}
					}).mask(input);
				}
				form_remove_error(input);
			});
			input.addEventListener('blur', function (e) {
				if (input.value == '') {
					input.value = input_g_value;
					input_focus_remove(input);
					if (input.classList.contains('_mask')) {
						input_clear_mask(input, input_g_value);
					}
					if (input.getAttribute('data-type') === "pass") {
						input.setAttribute('type', 'text');
					}
				}
			});
			if (input.classList.contains('_date')) {
				const calendarItem = datepicker(input, {
					customDays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
					customMonths: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
					overlayButton: 'Применить',
					overlayPlaceholder: 'Год (4 цифры)',
					startDay: 1,
					formatter: (input, date, instance) => {
						const value = date.toLocaleDateString()
						input.value = value
					},
					onSelect: function (input, instance, date) {
						input_focus_add(input.el);
					}
				});
				const dataFrom = input.getAttribute('data-from');
				const dataTo = input.getAttribute('data-to');
				if (dataFrom) {
					calendarItem.setMin(new Date(dataFrom));
				}
				if (dataTo) {
					calendarItem.setMax(new Date(dataTo));
				}
			}
		}
	}
}
function input_placeholder_add(input) {
	const input_g_value = input.getAttribute('data-value');
	if (input.value == '' && input_g_value != '') {
		input.value = input_g_value;
	}
}
function input_focus_add(input) {
	input.classList.add('_focus');
	input.parentElement.classList.add('_focus');
}
function input_focus_remove(input) {
	input.classList.remove('_focus');
	input.parentElement.classList.remove('_focus');
}
function input_clear_mask(input, input_g_value) {
	input.inputmask.remove();
	input.value = input_g_value;
	input_focus_remove(input);
}
