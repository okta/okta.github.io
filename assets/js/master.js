(function($) {

	var _isIE = ($("html[class*=ie]").length > 0);

	// $(".tabber").fbTabber({

	// 	onClick: function($current, $previous) {

	// 		var prevIndex = $previous.data("index");
	// 		var currentIndex = $current.data("index");

	// 		var $prevTarget = $($previous.attr("href"));
	// 		var $currentTarget = $($current.attr("href"));

	// 		if (!_isIE)
	// 		{
	// 			$prevTarget
	// 			.removeClass("fadeInLeft")
	// 			.removeClass("fadeInRight")
	// 			.removeClass("fadeOutLeft")
	// 			.removeClass("fadeOutRight")
	// 			.removeClass("animated");

	// 			$currentTarget
	// 			.removeClass("fadeInLeft")
	// 			.removeClass("fadeInRight")
	// 			.removeClass("fadeOutLeft")
	// 			.removeClass("fadeOutRight")
	// 			.removeClass("animated");
	// 		}

	// 		$prevTarget.css({
	// 			display: "block",
	// 			position: "relative",
	// 			zIndex: 5
	// 		});

	// 		$currentTarget.css({
	// 			display: "block",
	// 			position: "relative",
	// 			zIndex: 10
	// 		});

	// 		if (!_isIE)
	// 		{
	// 			if (currentIndex > prevIndex)
	// 			{
	// 				$currentTarget.addClass("fadeInRight");
	// 				$prevTarget.addClass("fadeOutLeft");
	// 			}
	// 			else if (currentIndex < prevIndex)
	// 			{
	// 				$currentTarget.addClass("fadeInLeft");
	// 				$prevTarget.addClass("fadeOutRight");
	// 			}

	// 			$currentTarget.addClass("animated");
	// 			$prevTarget.addClass("animated");
	// 		}

	// 		if (_isIE)
	// 		{
	// 			$prevTarget.css({
	// 				display: "none"
	// 			});
	// 		}

	// 	}

	// });

	// $("#primary-nav").pacNav({
	// 	childSelector: "> ul > li",
	// 	offsetWidth: 50
	// });

	$("#primary-nav").on("click", ".has-dropdown > a", function(e) {
		e.preventDefault();
		e.stopPropagation();

		$(this).parent().toggleClass("dropdown-active");
	});

	$("#primary-nav").on("click", ".has-dropdown > .dropdown-window", function(e) {
		e.preventDefault();
		e.stopPropagation();
	});

	$("#primary-nav").on("click", ".has-dropdown > .dropdown-window a", function(e) {
		e.stopPropagation();
	});

	$(window).bind("click", function() {
		$("#primary-nav .has-dropdown").removeClass("dropdown-active");
	});

	$(window).on('resize', function(){
		var win = $(this);
		var navWidth = $('#primary-nav').width();
		var searchInput = $('.gsc-input-focus');
		$(searchInput).width(navWidth);
	});

	var initSearch = function() {
		var cx = '005121479574088032773:mmh_vhv8uns';
		var gcse = document.createElement('script');
		gcse.type = 'text/javascript';
		gcse.async = true;
		gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') +
		'//cse.google.com/cse.js?cx=' + cx;
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(gcse, s);
	}

	initSearch();

})(jQuery);

