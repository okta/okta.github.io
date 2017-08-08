/**
 * jQUery version downgraded to 2.x for compatibility with swiftype library ($.ajax.success dependency)
 */

//= require vendor/jquery-2.2.4.min
//= require vendor/jquery.ba-hashchange.min
//= require vendor/jquery.swiftype.autocomplete
//= require vendor/jquery.swiftype.search

var oktaCustomRenderFunction = function(document_type, item) {
    var out = '<a href="' + item['url'] + '" class="st-search-result-link"><div class="st-result autocomplete-item"><p class="title">' + item['title'] + '</p></div></a>';
    return out;
};

(function($) {
  $('.scrollTo, .PrimaryNav > ul.menu a').click(function(e) {
      if(this.hash && $(this.hash).length) {
          e.preventDefault()
          $('html, body').animate({
              scrollTop: $(this.hash).offset().top - 80
          }, 500)
      }
  })


  $('.Header nav .SearchIcon').on('click', function(event) {
      event.stopPropagation();
      event.preventDefault();
      $('.Header').toggleClass('search-active');
      $('.Header nav #st-search-input-auto').focus();
  });

  $('.PrimaryNav-toggle').on('click', function(event){
      event.stopPropagation();
      event.preventDefault();
      $('.Header').toggleClass('is-active');
      $('.PrimaryNav').toggleClass('is-active');
  });

  $('#form_search #st-search-input-auto').on('keyup', function(){
      if ($(this).val().length > 0) {
          $(this).parent().addClass('button-active');
      }
      else {
          $(this).parent().removeClass('button-active');
      }
  });

  $('#form_search').on('click', function(event){
      event.stopPropagation();
  });

  $(window).on('click', function() {
      $('.search-active').removeClass('search-active');
  });

  $(window).on('resize', function(event){
      $('.search-active').removeClass('search-active');
  });

  $(window).on('scroll', function(event){
      if ($(document).scrollTop() > 0) {
          $('.Page--docs-page').addClass('scrolling');
      }
      else {
          $('.Page--docs-page').removeClass('scrolling');
      }
  });

  $(".st-search-input").swiftype({
      renderFunction: oktaCustomRenderFunction,
      engineKey: 'VoUosPoJvtAtkm68Cd-_',
      perPage: 40
  });

  $('.Sidebar-toggle').on('click', function(e) {
    e.stopPropagation();
    $(this).parent().toggleClass('Sidebar-active');
  });

  $('header, .Sidebar').bind('click', function() {
    $('.Sidebar.Sidebar-active').removeClass('Sidebar-active');
  });

})(jQuery);

