$(function() {

  var fixedNavHeight = 160;

	var linkify = function() {
		var anchorForId = function (id) {
			var anchor = document.createElement("a");
			anchor.className = "header-link";
			anchor.href      = "#" + id;
			anchor.innerHTML = "<i class=\"fa fa-link\"></i>";
			return anchor;
		};

		var linkifyAnchors = function (level, container) {

			var headers = container.getElementsByTagName("h" + level);
			for (var h = 0; h < headers.length; h++) {
				var header = headers[h];

				if (typeof header.id !== "undefined" && header.id !== "" && header.className.indexOf("no-link") !== 0) {
					header.appendChild(anchorForId(header.id), header);
				}
			}
		};

		var body = document.getElementById('docs-body');
		for (var level = 1; level <= 6; level++) {
			linkifyAnchors(level, body);
		}
	}();

	$('a[href*="#"]:not([href="#"])').click(function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {

			window.location.hash = this.hash;
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
				$('html,body').scrollTop(target.offset().top - fixedNavHeight);
				return false;
			}
		}
	});

	if ($(location.href.split("#")[1])) {
		var target = $('#' + location.href.split("#")[1]);
		if (target.length) {
			$('html,body').scrollTop(target.offset().top - fixedNavHeight);
		}
	};
	
	
	$(document).ready(function() {
		
		var offset     = 140;
		var headerData = [];
		
		var $window    = $(window);
		var $body      = $('html, body');
		var $footer    = $('.footer');
		var $header    = $('#header');
		var $page      = $('.PageContent');
		var $sidebar   = $('.Sidebar');
		var $content   = $('.PageContent-main');
		var $headers   = [];
		var $toc       = $('<div>').addClass('TableOfContents').appendTo($page);
		var $tocItems  = [];
		var $indicator = $('<div>').addClass('TableOfContents-indicator').appendTo($toc);
		
		var buildTOC = function() {
			
			var $items   = $('h1, h2, h3, h4, h5, h6', $content);
			var pageEle  = $page[0];
			var pageRect = pageEle.getBoundingClientRect();
			
			$.each($items, function(index, value) {
				
				var $this = $items.eq(index);
				var level = $this.prop('tagName').substr(1, 2);
				var text = $this.text();
				var thisEle = $this[0];
				var thisRect = thisEle.getBoundingClientRect();
				var sectionHeight = 0;
				var $menuItem;
				
				if (index < $items.length - 1) {
					var nextEle = $items.eq(index + 1)[0];
					var nextRect = nextEle.getBoundingClientRect();
					sectionHeight = nextRect.top - thisRect.top;
				} else {
					sectionHeight = pageRect.bottom - thisRect.top;
				}
				
				if (level == 1) {
					$menuItem = $('<div>');
				} else {
					$menuItem = $('<a>').attr('href', '#' + $this.attr('id'));
				}
				
				$menuItem
					.data('level', level)
					.addClass('TableOfContents-item')
					.addClass('is-level' + level)
					.text(text);
				
				$toc.append($menuItem);
				
				if (level > 1) {
					$menuItem.on('click', goToSection.bind($this[0]));
					
					if ($headers.length) {
						$headers = $headers.add($this);
						$tocItems = $tocItems.add($menuItem);
					} else {
						$headers = $this;
						$tocItems = $menuItem;
					}
				}
				
				headerData.push({
					'headerEle': $this[0],
					'menuItemEle': $menuItem[0],
					'height': sectionHeight
				});
				
			});
			
		};
		
		var init = function() {
			$page.addClass('has-tableOfContents');
		};
		
		var goToSection = function() {
			$body.animate({
				scrollTop: $(this).offset().top - offset
			});
		};
		
		var onScroll = function() {
			
			var sectionOffset = 0;
			
			for (var i = 0; i < headerData.length; i++) {
				var ele = headerData[i].headerEle;
				var rect = ele.getBoundingClientRect();
				
				if (rect.top >= offset) {
					setActiveItem(i);
					break;
				}
				
				sectionOffset += headerData[i].height;
			}
			
		};
		
		var setActiveItem = function(i) {
			
			var $activeItem = $($tocItems[i]);
			var nextClasses = [];
			
			for (var i = $activeItem.data('level'); i > 0; i--) {
				nextClasses.push('.is-level' + i);
			}
			
			var $nextItem = $activeItem.nextAll(nextClasses.join(', ')).eq(0);
			
			var firstEle = $tocItems[0];
			var firstRect = firstEle.getBoundingClientRect();
			
			var activeEle = $activeItem[0];
			var activeRect = activeEle.getBoundingClientRect();
			
			var tocEle = $toc[0];
			var tocRect = tocEle.getBoundingClientRect();
			
			var tocOffset = activeRect.top - tocRect.top;
			var maxOffset = (tocRect.bottom - tocRect.top) - ($window.height() - $header.outerHeight() - $footer.outerHeight() - 120);
			
			if (tocOffset > maxOffset) {
				tocOffset = maxOffset;
			}
			
			var nextEle;
			var nextRect;
			var scale;
			var marginTop = 0;
			var indicatorOffset = (activeRect.top - firstRect.top);
			
			if ($nextItem.length) {
				nextEle = $nextItem[0];
				nextRect = nextEle.getBoundingClientRect();
				scale = (nextRect.top - activeRect.top);
			} else {
				scale = (activeRect.bottom - activeRect.top);
			}
			
			if ($('.is-level1:nth-child(2)', $toc).length == 1) {
				marginTop = 25;
			}
			
			$indicator.css({
				'height': scale + 'px',
				'marginTop': marginTop,
				'transform': 'translate(0, ' + indicatorOffset + 'px)'
			});
			
			$tocItems.removeClass('is-active');
			$activeItem.addClass('is-active');
			
			$toc.css({
				transform: 'translateY(-' + tocOffset + 'px)'
			});
			
		};
		
		$(window).on('scroll', onScroll);
		$(window).on('resize', onScroll);
		
		buildTOC();
		init();
		onScroll();
		
	});
}());
