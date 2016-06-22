(function( $ ) {

    $.fn.tiltViewer = function( options ) {

        if (typeof window.addEventListener === 'undefined' || typeof window.DeviceOrientationEvent === 'undefined') {
            return this;
        }

        var settings = $.extend({
            slide: "> *",
            maxGamma: 20.0
        }, options );

        var elementWidth = 0;
        var innerElementWidth = 0;

        var $this = this;
        var $inner = this.find(settings.slide).first();

        $this.css({
            overflow: 'hidden'
        });

        $inner.css({
            display: 'block'
        });

        var gammaArray = [0];
        var avgGamma = 0.0;
        var percent = 0.0;
        var delta = 0.0;

        var redraw = function() {
            avgGamma = gammaArray.reduce(function(a, b) { return a + b; }) / gammaArray.length;

            percent = Math.min(settings.maxGamma, Math.abs(avgGamma)) / settings.maxGamma;
            if (avgGamma < 0) {
                percent = -percent;
            }

            delta = (innerElementWidth - elementWidth) / 2.0;
            if (delta > 0) {
                $inner.css({transform: 'translateX(' + Math.round(delta * percent - delta) + 'px)'});
            }
        };

        window.addEventListener('deviceorientation', function(event) {
            if (gammaArray.length > 8) {
                gammaArray.shift();
            }

            gammaArray.push(event.gamma || 0);
            redraw();
        });

        var onResize = function() {
            elementWidth = $this.width();
            innerElementWidth = $inner.outerWidth(true);
            redraw();
        };

        onResize();
        $(document).ready(onResize);
        $(document).resize(onResize);

        if ($inner.is('img')) {
            $inner.on('load', onResize);
        }

        return this;
    };

}(jQuery));
