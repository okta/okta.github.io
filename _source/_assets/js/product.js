$(function() {
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


  var _isIE = ($("html[class*=ie]").length > 0);

  $(".tabber").fbTabber({

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
}());
