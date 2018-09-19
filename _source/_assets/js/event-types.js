$(document).ready(function () {
  function debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      }, wait);
      if (immediate && !timeout) func.apply(context, args);
    };
  }

  var $search = $("#event-type-search");
  var $eventTypes = $(".event-type");
  var $eventTypeCount = $("#event-type-count");

  $search.keyup(debounce(function () {
    var count = 0;
    var filter = $(this).val().trim();
    var regex = new RegExp(filter, "i");

    $eventTypes.each(function () {
      var $eventType = $(this);
      if ($eventType.text().search(regex) < 0) {
        $eventType.hide();
      } else {
        $eventType.show();
        count++;
      }
    });

    $eventTypeCount.html("Found <b>" + count + "</b> matches");
  }, 100));
});

