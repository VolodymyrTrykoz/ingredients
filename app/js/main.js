$(document).ready(function () {
    const $window = $(window);
    const $nav = $('.products__nav');
    const $menuLarge = $('.menu__large');
    const $largeMenuWrapper = $('.wrapper');
    const $mainMenuLinks = $('.wrapper__nav .nav__item');
    const navOffsetTop = $('.products__nav').offset().top;
    const $secondSectionStart = $('.explained').offset().top;
    const $lastSectionStart = $('.shop').offset().top;
    const $lastSectionHeight = $('.shop').height();
    const $path1 = $('.svgPath1');
    const $path2 = $('.svgPath2');
    const $path3 = $('.svgPath3');
    let menuOpened = false;


    $window.on("mouseup", closeMenuDesktop);
    $window.on('scroll', handleWindowScroll);


    $(document).on('mousemove','.products__link, .shop__link' ,dynamicGradient );
    $(document).on('click', '.footer .nav__item, .footer a, .shop__link', (e)=>{e.preventDefault()});
    $(document).on("click", '.products__link, .scroll a', goToLink);
    $(document).on("click", '.products__link, .scroll a', navActiveClass);
    $('.header__link').on("click", animateMenuOpen);


    let smoothScroll = () => {
        let scrollTime = 0.7;
        let scrollDistance = 300;
        $window.on("mousewheel DOMMouseScroll", (e) => {
            e.preventDefault();
            let delta = e.originalEvent.wheelDelta / 120 || -e.originalEvent.detail / 3;
            let scrollTop = $window.scrollTop();
            let finalScroll = scrollTop - parseInt(delta * scrollDistance);

            TweenMax.to($window, scrollTime, {
                scrollTo: {y: finalScroll, autoKill: true},
                ease: Power1.easeOut,
                autoKill: true,
                overwrite: 5
            });
        });
    };
    smoothScroll();

    //Tracking mouse position on element hover I change dynamically position of gradient
    //in conjunction with css variables
    function dynamicGradient(e) {
        const elLeft = $(this).offset().left;
        const elTop = $(this).offset().top;
        const x = e.pageX - elLeft;
        const y = e.pageY - elTop;
        $(this).css({'--x': `${ x }px`,
                     '--y': `${ y }px`});
    }

    function goToLink(e) {
        e.preventDefault();
        const navHeight = $('.products__nav').height();
        const id = $(this).attr('href');
        const top = $(id).offset().top;
        $('body,html').stop(true).animate({scrollTop: top - navHeight}, 500);
    }

    function closeMenuDesktop(e){
        if(menuOpened && $menuLarge.is(e.target)){
            animateMenuClose();
        }
    }

    function animateMenuOpen() {
        $menuLarge.addClass('active');
        menuOpened = true;
        let tlMenu = new TimelineMax();
            tlMenu
                .to($largeMenuWrapper, .3, {left: '0%', ease: Power3.easeOut})
                .staggerTo( $mainMenuLinks, 0.5, {x: '0%', opacity:1}, 0.1)
                .to($path1, 0.7, { strokeDashoffset : 0,  ease: Power1.easeInOut})
                .to($path1, 0.4, { fill : '#fff'}, '-=0.3')
                .to($path2, 0.7, { strokeDashoffset : 0,  ease: Power1.easeInOut})
                .to($path2, 0.4, { fill : '#fff'}, '-=0.3')
                .to($path3, 1, { strokeDashoffset : 0,  ease: Power1.easeInOut})
                .to($path3, 0.4, { fill : '#fff', onComplete: ()=> {
                    $('.wrapper__svgText').addClass('active');
                }}, '-=0.3');
        trackSwipe();
    }

    function animateMenuClose(){
        let tlMenu = new TimelineMax();
        tlMenu
            .staggerTo( $mainMenuLinks, .3, {x: '-30%', opacity:0}, 0.1)
            .set($path1, { strokeDashoffset : 493.69})
            .set($path1, { fill : 'transparent'})
            .set($path2, { strokeDashoffset : 303.76})
            .set($path2, { fill : 'transparent'}, '-=0.3')
            .set($path3, { strokeDashoffset : 3457.30})
            .set($path3, { fill : 'transparent'}, '-=0.3')
            .to('.wrapper', .1, {left: '-30%', ease: Power3.easeOut, onComplete:()=>{
                $('.wrapper__svgText').removeClass('active');
                $menuLarge.removeClass('active');
                menuOpened = false;
            }}, '-=.3');
    }

    function navActiveClass() {
        $('.navPosition').each(function(i, el){
        const winOffTop = $(window).scrollTop();
        const elOffTop = $(el).offset().top;
        const $menuLink1 = $('.products__link:first-child');
        const $menuLink4 = $('.products__link:last-child');

        if($secondSectionStart >= $(window).scrollTop()){
          $menuLink1.addClass('active');
        }
        if(elOffTop <= winOffTop + 100){
          $('.products__link').removeClass('active');
          $('.products__link[data-name="' + $(el).attr('id') + '"]').addClass('active');
        }
        if((winOffTop + $(window).height()) >= ($lastSectionStart + $lastSectionHeight)){
          $menuLink4.addClass('active');
        }
        if($('.products__link').hasClass('active')){
          $('.products__link.active').prev().removeClass('active');
        }

    });
    }

    function stickyNavigation() {
        const winOffTop = $(window).scrollTop();
        const sticky = winOffTop >= navOffsetTop;
            if(sticky){
                $nav.addClass('sticky');
            }
            else {
                $nav.removeClass('sticky');
            }
    }

    //you can close menu either by clicking outside the menu wrapper area or
    //by swiping left inside the menu wrapper area (mobile phones and tablets only)
    //for this purpose I track X-axis on touch-start and touch-end events
    //I have also included 50px gap to ensure micro swipes will never close the menu
    function trackSwipe() {
        if(menuOpened){
            let swipeStart = '';
            $largeMenuWrapper.on("touchstart", (e)=>{
                swipeStart = e.changedTouches[0].pageX;
            });
            $largeMenuWrapper.on("touchend", (e)=>{
                let swipeEnd = e.changedTouches[0].pageX;
                if((swipeEnd - swipeStart) < (-50)){
                    animateMenuClose();
                }
            });
        }
    }

    function handleWindowScroll(){
        stickyNavigation();
        navActiveClass();
    }
    navActiveClass();

});

