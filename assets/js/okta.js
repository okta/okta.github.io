//Tabber
(function($)  {
	
	$.fn.extend({
		
		fbTabber: function(_options) {
			
			var options = _options;
		
			return this.each(function() {
				
				var index = 0;
				var $tabs = $("a", this);
				var $currentTab = $tabs.eq(0);
				var $previousTab = $tabs.eq(0);
				
				$tabs.each(function() {
					
					$(this).data("index", ++index);
					
				});
			
				$tabs.click(function(e) {
					
					e.preventDefault();
			
					$previousTab = $currentTab;
					$currentTab = $(this);
			
					if ($previousTab !== $currentTab) {
						
						$tabs.removeClass("active");
						$(this).addClass("active");
						
						if (typeof options.onClick === "function") {
							
							options.onClick($currentTab, $previousTab);
							
						}
						
					}
			
				});
				
			});
		
		}
		
	});
	
})(jQuery);



// Forms
(function($) {

    $('#cors-test').delegate(':button', "click", function(e) {
        e.preventDefault();
        var orgUrl = $('#input-orgUrl').val();
        if (orgUrl.indexOf('http://') !== 0 && orgUrl.indexOf('https://') !== 0) {
            orgUrl = 'https://' + orgUrl;
        }

        $.ajax({
            url: orgUrl + '/api/v1/users/me',
            type: 'GET',
            accept: 'application/json',
            xhrFields: { withCredentials: true }
        }).done(function(data) {
            var output = _.template($('#template-profile').html(), { user: data });
            $('#cors-test-result').html(output);
        }).fail(function(xhr, textStatus, error) {
            var title, message;
            switch (xhr.status) {
                case 0 :
                    title = 'Cross-Origin Request Blocked';
                    message = 'You must explictly add this site (' + window.location.origin + ') to the list of allowed websites in your Okta Admin Dashboard';
                    break;
                case 403 :
                    title = xhr.responseJSON.errorSummary;
                    message = 'Please login to your Okta organization before running the test';
                    break;
                default :
                    title = xhr.responseJSON ? xhr.responseJSON.errorSummary : xhr.statusText;
                    break;
            }
            $('#cors-test-result').html($('<div>', {
                'class': 'alert alert-danger',
                'html': '<strong>' + title + ':</strong> ' + message || ''
            }));
        });
    });

})(jQuery);



// Navigation
(function($) {

    // Mobile Nav Open
    $(".mobile-toggle").click(function () {
        $('body').toggleClass('mobile-nav-active');
        return false;
    });

    // Search Open
    $("#top-nav .SearchIcon").on('click', function(e){
        $(this).parent().toggleClass("search-active");
        $('#top-nav #q').focus();
    });

    // Support Dropdown Nav Open
    $("#top-nav .has-dropdown > a").on("click", function(e) {
        e.preventDefault();
        e.stopPropagation();

        $(this).parent().toggleClass("dropdown-active");
    });

    // Mobile Sidebar Open/Close
    $(".Sidebar-toggle").on("click", function(e){
        e.stopPropagation();
        $(this).parent().toggleClass("is-active");
    });

    $("#top-nav .has-dropdown > .dropdown-window, #top-nav #q, .Sidebar h2").on("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
    });

    $("#top-nav .has-dropdown > .dropdown-window a, #top-nav .SearchIcon, .Sidebar a").on("click", function(e) {
        e.stopPropagation();
    });

    $(window).bind("click", function() {
        $("#top-nav .has-dropdown").removeClass("dropdown-active");
        $("#top-nav.search-active").removeClass("search-active");
    });

    $('header, .Sidebar').bind("click", function() {
        $(".Sidebar.is-active").removeClass("is-active");
    });

})(jQuery);



// Product
;(function($) {

	var _isIE = ($("html[class*=ie]").length > 0);

	$('.tabber').each(function() {
		
		$(this).fbTabber({	
			onClick: function($current, $previous) {
		
				var prevIndex = $previous.data("index");
				var currentIndex = $current.data("index");
		
				var $prevTarget = $($previous.attr("href"));
				var $currentTarget = $($current.attr("href"));
		
				if (!_isIE)
				{
					$prevTarget
					.removeClass("fadeInLeft")
					.removeClass("fadeInRight")
					.removeClass("fadeOutLeft")
					.removeClass("fadeOutRight")
					.removeClass("animated");
		
					$currentTarget
					.removeClass("fadeInLeft")
					.removeClass("fadeInRight")
					.removeClass("fadeOutLeft")
					.removeClass("fadeOutRight")
					.removeClass("animated");
				}
		
				$prevTarget.css({
					display: "block",
					position: "relative",
					zIndex: 5
				});
		
				$currentTarget.css({
					display: "block",
					position: "relative",
					zIndex: 10
				});
		
				if (!_isIE)
				{
					if (currentIndex > prevIndex)
					{
						$currentTarget.addClass("fadeInRight");
						$prevTarget.addClass("fadeOutLeft");
					}
					else if (currentIndex < prevIndex)
					{
						$currentTarget.addClass("fadeInLeft");
						$prevTarget.addClass("fadeOutRight");
					}
		
					$currentTarget.addClass("animated");
					$prevTarget.addClass("animated");
				}
		
				if (_isIE)
				{
					$prevTarget.css({
						display: "none"
					});
				}
		
			}
		});
	
	});

})(jQuery);