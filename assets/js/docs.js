$(function() {


  // ------------------------ SIDENAV

  $('.docs-sidebar-block > h2').on('click', function() {
    $this  = $(this);
    $ul    = $this.next('ul');
    $block = $this.parent('.docs-sidebar-block');

    $ul.animate({
        opacity: 'toggle',
        height: 'toggle'
      }, 100, function() {
      if ($ul.css('display')=='none') {
        $block.addClass('closed');
      }
      else {
        $block.removeClass('closed');
      }
    });
  });


  // -- TOC scrolling
  var $toc              = $('<ul class="list-unstyled toc">'),
      $headerSelector   = $('#docs-page-title'),
      $h2s              = $('#docs-body > h2'),
      html;

  if ($headerSelector.length && $h2s.length) {
    $toc.append('<h2 id="toc-title">Table of Contents</h2>');
    $h2s.each(function() {
      $this = $(this);
      html  = '<li>';
      html += '<a href="#' + $this.attr('id') + '">' + $this.html() + '</a>';
      html += '</li>';
      $toc.append(html);
    });
    $headerSelector.after($toc);
  }

  $('.docs-page').localScroll({
    duration: 300,
    offset: -120,
    onAfter: function() {
    }
  });



  // ------------------------ SCROLL TO TOP BUTTON

  var scrolled = false,
      $docsBody = $('#docs-body'),
      $scroller = $('#scroll-top-button');


  // -- poll to display button
  $(window).scroll(function() {
    scrolled = true;
  });

  setInterval(function() {
    if (scrolled) {
      scrolled = false;
      if ($(window).scrollTop() > 100) {
        $scroller.addClass('on');
        positionScroller();
      }
      else {
        $scroller.removeClass('on');
      }
    }
  }, 250);


  // -- debounce window resize to reposition button
  $(window).resize(function() {
    clearTimeout(this.id);
    this.id = setTimeout(positionScroller, 50);
  });

  var positionScroller = function() {
    var pos = $docsBody.width() + $docsBody.offset().left + 100;
    $scroller.css('left', pos);
  }


});
