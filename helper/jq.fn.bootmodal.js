/*
 *
 * $.bootModal("Enter Title Here","Enter Body Text HERE",options);
 * options is an object like:
 * {
 *  footer -> bool //Decides if the footer is shown
 *  header -> bool //Decides if the header is shown
 *  primaryText -> string //Displayed on primary btn.
 *  secondaryText -> string // If present, secondary button is show and text is the value provided.
 *  primaryCallback -> function //Called when user clicks primary btn.
 *  secondaryCallback -> function //Called when user clicks secondary btn.
 * }
 *
 */

(function($) {

  "use strict";
  var defaultOptions = {
    footer: false,
    header: true,
    headerText:"Warning!",
    primaryCallback: $.noop,
    secondaryCallback: $.noop,
    dismissCallback: $.noop,
    onShown: $.noop,
    onShow: $.noop,
    primaryText: "Ok",
    secondaryText: "Cancel",
    // close - will handle cross icon display + Hide on Esc key
    close : true,
    // hideOnBgClick - will handle any hide on clicking bg-overlay.
    hideOnBgClick: true
  };
  
  $.bootModal = function(title, body, options) {
    options = $.extend(true, {}, defaultOptions, options);

    var close = '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true" class="hem-icon close-icon"></span><span class="sr-only">Close</span></button>'
        ,backdrop = options.hideOnBgClick ? true : 'static'

    var footer = '<div class="modal-footer">' +
            '<button type="button" class="btn btn-default" data-dismiss="modal">' + options.primaryText + '</button>';
    if (options.secondaryText != '')
      footer += '<button type="button" class="btn btn-secondary" data-dismiss="modal">' + options.secondaryText + '</button>';
    footer += '</div>';

    if (!options.footer)
      footer = '';

    close = options.close ? close : '';
    
    return $('<div class="modal fade bootModal"' + 'data-backdrop="' + backdrop + '" data-keyboard="' + options.close +'">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            '<div class="modal-header" style="border: 0">' +
             close +
            '<h4 class="modal-title heading-2">'+options.headerText+'</h4>' +
            '</div>' +
            '<div class="modal-body text-1">' +
            '<p></p>' +
            '</div>' +
            footer +
            '</div>' +
            '</div>' +
            '</div>')

            .find('.modal-title')
            .html(title).end()
            .find('.modal-body')
            .html(body).end()
            .find('.modal-footer .btn-default')
            .click( function(){
                options.primaryCallback();
            $(this).closest('.modal').data('callback','primary');
            }).end()
            .find('.modal-footer .btn-secondary')
            .click( function(){
                options.secondaryCallback();
            $(this).closest('.modal').data('callback','secondary');
            }).end()
            .appendTo($('body'))
            .on('show.bs.modal', options.onShow)
            .on('shown.bs.modal', function(e) {
                /*
                        while calculating height we were taking half the height of the element. [ trying to place the modal exactly in screen center]
                        this was breaking for claim invite modal which is 505px in height :  taking it to center hidec the modal from top and bottom
                */
                var applicableMarginTop = $(window).height() < $('.modal-dialog', $(this)).height() ? -$(window).height()/2 : -$('.modal-dialog', $(this)).height()/2 ;
                
                $('.modal-header', $(this)).css({
                    padding: '30px 15px 15px 30px'
                });
                $('.modal-body', $(this)).css({
                    padding: '15px 30px 40px 30px'
                });
                $('.modal-dialog', $(this)).css({
                    position: 'absolute',
                    left: '50%',
                    width: $('.modal-dialog', $(this)).width(),
                    'margin-left': -$('.modal-dialog', $(this)).width()/2
                });

                $('.modal-dialog', $(this)).animate({
                    top: '50%',
                    'margin-top': applicableMarginTop
                });
                $('.modal-header', $(this)).css({
                    padding: '30px 15px 15px 30px'
                });
                $('.modal-body', $(this)).css({
                    padding: '15px 30px 40px 30px'
                });
                options.onShown.apply($(this), arguments);
            })
            .modal('show')
            .on('hidden.bs.modal', function(e) {
                var callbackValue = $(this).data("callback");
                if(callbackValue != "primary" && callbackValue != "secondary"){
                    options.dismissCallback();
                }
                $(this).remove();
            });
  };
}(jQuery));
