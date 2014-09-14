(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    var pluginName = "shoveoff",
        defaults = {
            navBarToggle : '.nav-toggle',
            menuWidth : '200',
            menuSpeed : '400'
        };

    function Plugin( element, options ) {
        this.element = element;
        // make sure it has our mobile navigation class since we use it in the plugin
        $(this.element).addClass('mobile-navigation');

        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.navBarToggleClass = this.options.navBarToggle;
        this.$navBarToggle = $(this.options.navBarToggle);

        // used for browsers that don't support css animations
        this.menuWidth = this.options.menuWidth;
        this.menuSpeed = this.options.menuSpeed;

        var that = this;
        // close menu when page resized if toggle goes away
        $(window).resize(function() {
            if (that.$navBarToggle.is(':hidden')) {
                that.closeMenu();
            }
        });

        this.init();
    }

    Plugin.prototype = {
        init: function() {
            this.$offCanvas = $(this.element);
            this.$body = $(document.body);

            // elements that will be pushed off the screen
            this.$shove = $('body > *').not('.mobile-navigation , .menu-blocker, script');

            // Overlay so if user touches/clicks off the menu the menu will close
            this.$siteOverlay = '<div class="menu-blocker"></div>';

            // set the menu to left 0 so we can transition. Menu is set to -80% via css so menu doesn't flicker on screen when site is loaded
            this.$offCanvas.css('left', '0%');

            // since we know what the menu is assign the offcanvas-left class to it. Probably could get rid of this class altogether
            this.$offCanvas.addClass('offcanvas-left');

            this.shoveOffClass = 'offcanvas-left offcanvas-open';
            this.shoveClass = 'shove';

            // tracks if the menu is opened or closed
            this.menuState = false;

            // checks if 3d transforms are supported
            this.cssTransforms3d = (function csstransforms3d() {
                var el = document.createElement('p'),
                    supported = false,
                    transforms = {
                        'webkitTransform': '-webkit-transform',
                        'OTransform': '-o-transform',
                        'msTransform': '-ms-transform',
                        'MozTransform': '-moz-transform',
                        'transform': 'transform'
                    };

                // Add it to the body to get the computed style
                document.body.insertBefore(el, null);

                for (var t in transforms) {
                    if (el.style[t] !== undefined) {
                        el.style[t] = 'translate3d(1px,1px,1px)';
                        supported = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                    }
                }

                document.body.removeChild(el);

                return (supported !== undefined && supported.length > 0 && supported !== 'none');
            })();

            var that = this;

            // open the menu
            this.$body.on('touch click', this.navBarToggleClass, function() {
                that.toggleMenu();
            });

            // if menu blocker is clicked the menu closes
            this.$body.on('touchstart mousedown', '.menu-blocker', function(e) {
                e.preventDefault();
                that.toggleMenu();
            });

            this.$offCanvas.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function() {
                // if the menu is being closed wait until the transition is over to remove the active class on body, and restore the users overflow-x
                if(!that.menuState){
                    that.$body.removeClass('shove-active');
                }
            });

            if (!this.cssTransforms3d) {
                //jQuery fallback
                this.$offCanvas.css({
                    left: '-' + this.menuWidth
                }); //hide menu by default
            } else {
                // assign animation transition classes
                this.$offCanvas.addClass('menu-transition-animation');
                this.$shove.addClass('menu-transition-animation');
            }
        },
        closeMenu: function() {
            if (this.menuState) {
                this.toggleMenu();
            }
        },
        toggleMenu: function(){
            // fallback to jq if 3d transforms aren't supported
            if (!this.cssTransforms3d) {
                if (!this.menuState) {
                    this.openFallback();
                } else {
                    this.closeFallback();
                }
            } else {
                this.$offCanvas.toggleClass(this.shoveOffClass);
                this.$shove.toggleClass(this.shoveClass);

                // If the menu is being opened add the active class to the body, which hides x overflow.
                if(!this.menuState){
                    this.$body.addClass('shove-active');
                }
            }

            // adds/removes site overlay
            if (!this.menuState) {
                this.$body.append($(this.$siteOverlay));
            } else {
                $('.menu-blocker').remove();
            }
            document.body.style.webkitTransform = 'scale(' + parseInt(this.menuState, 10) + ')';

            this.menuState = !this.menuState;
        },
        openFallback: function(){
            this.$body.addClass('shove-active');

            this.$offCanvas.css('z-index' , 1).animate({
                left: this.menuWidth
            }, this.menuSpeed);

            this.$shove.each(function() {
                if ($(this).css('position') !== 'fixed') {
                    $(this).css('position', 'relative');
                }
            });
            this.$shove.animate({
                left: this.menuWidth
            }, this.menuSpeed);
        },
        closeFallback: function(){
            var $body = this.$body;

            this.$offCanvas.animate({
                left: '-' + this.menuWidth
            }, this.menuSpeed);

            this.$shove.each(function() {
                if ($(this).css('position') === 'relative') {
                    $(this).css('position', '');
                }
            });

            this.$shove.animate({
                left: '0px'
            }, this.menuSpeed, function(){
                $body.removeClass('shove-active');
            });
        }
    };

    $.fn[pluginName] = function ( options ) {
        var args = arguments;

        if (options === undefined || typeof options === 'object') {
            return this.each(function () {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName,
                    new Plugin( this, options ));
                }
            });
        }else if(typeof options === 'string' && options[0] !== '_' && options !== 'init') {
             var returns;

            this.each(function () {
                var instance = $.data(this, 'plugin_' + pluginName);
                returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
            });
        }
    };

}));