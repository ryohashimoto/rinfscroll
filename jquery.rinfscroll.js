(function($) {
  $.rinfscroll = function(options) {
    var opts = $.extend($.rinfscroll.defaults, opts);

    init();

    function init() {
      _.templateSettings = {
        interpolate : /\{\{(.+?)\}\}/g
      };

      getNextPage();
      $(document).scroll(observeScroll);
    };

    function getFirstPage() {
      $.getJSON(nextPageWithJSON(), {}, updateContent).
        complete(function() { opts.loadingPage-- });
    };

    function loadItems(items) {
      var itemTemplate = _.template($(opts.itemTemplate).html());
      _.each(items, function(item) {
        $(opts.itemListElement).append(itemTemplate(item));
      });
      if (items.length == 0) $('#nextPageSpinner').hide();
    };

    function nextPageWithJSON() {
      opts.currentPage += 1;
      var newURL = opts.itemsUrl + '?' + opts.pageParameterKey + '=' + opts.currentPage;
      var splitHref = document.URL.split('?');
      var parameters = splitHref[1];
      if (parameters) {
        parameters = parameters.replace(/[?&]page=[^&]*/, '');
        newURL += '&' + parameters;
      }
      return newURL;
    };

    function getNextPage() {
      if (opts.loadingPage != 0) return;
  
      opts.loadingPage++;
      $.getJSON(nextPageWithJSON(), {}, updateContent).
        complete(function() { opts.loadingPage-- });
    };

    function updateContent(response) {
      loadItems(response);
    };
    
    function readyForNextPage() {
      if (!$('#nextPageSpinner').is(':visible')) return;

      var threshold = 200;
      var bottomPosition = $(window).scrollTop() + $(window).height();
      var distanceFromBottom = $(document).height() - bottomPosition;
      
      return distanceFromBottom <= threshold;
    };

    function observeScroll(event) {
      if (readyForNextPage()) getNextPage();
    }
  };

  // plugin defaults
  $.rinfscroll.defaults = {
    currentPage: 0,
    loadingPage: 0,
    itemListElement: 'div#products',
    itemTemplate: '#productTemplate',
    itemsUrl: 'http://localhost:8080/products.json',
    pageParameterKey: 'page'
  };
})(jQuery);
