$(function() {

  var jqxhr = $.ajax( 'http://api.stackexchange.com/2.2/search/advanced?order=desc&sort=votes&title=okta&site=stackoverflow' )
    .done(function(data) {
      listTopics(data, $('#stack-overflow'));
    })
    .fail(function() {
      showNone($('#stack-overflow'));
    })
    .always(function() {
  });

  var listTopics = function(data, container) {
    var $ul = $('<ul class="recent-list">');
    $.each(data.items, function(item, idx) {
      var $li = $('<li>' + idx),
          $a = $('<a>');
      $a.attr({
          'href': this.link,
          'target': '_blank'
        })
        .html(this.title);
      $li.append($a);
      $ul.append($li);
    });
    $(container).append($ul);
  }

  var showNone = function(container) {
    $(container).html('<div class="jumbotron"><h2>Sorry, no Stack Overflow threads available</h2><p>Please try again later</p></div>');
  }

});
