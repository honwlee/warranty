define([
    "jquery",
    "skylarkjs"
], function($, skylarkjs) {
    var spa = skylarkjs.spa,
        noder = skylarkjs.noder,
        langx = skylarkjs.langx,
        router = skylarkjs.router;

    return spa.PluginController.inherit({
        klassName: "AppController",
        _showProcessing: function() {
            if (!this._throbber) {
                this._throbber = noder.throb(document.body);
            }

        },
        _hideProcessing: function() {
            if (this._throbber) {
                this._throbber.remove();
                this._throbber = null;
            }
        },

        preparing: function(e) {
            var deferred = new langx.Deferred();
            window._goTop = function(time) {
                time = time || 200;
                $([document.body, document.documentElement]).animate({
                    "scrollTop": 0
                }, time, function() {
                    goTopShown = false;
                });
                $(".go-top-btn").css({
                    opacity: 0
                }).hide();
            };
            window.addThrob = function(node, callback, opacity) {
                opacity = opacity === 0 ? 0 : opacity || 0.5;
                $(node).css("opacity", opacity);
                var throb = noder.throb(node, {});
                callback();
                return throb;
            };
            var goTop = function(selector) {
                var goTopShown = false;
                selector.css({
                    opacity: 0
                }).on("click", function() {
                    window._goTop();
                });

                $(window).scroll(function() {
                    if (goTopShown && window.scrollY > 0) return;
                    if (window.scrollY > 100) {
                        selector.css({
                            opacity: 1
                        }).show();
                        goTopShown = true;
                    } else {
                        selector.css({
                            opacity: 0
                        }).hide();
                        goTopShown = false;
                    }
                });
            };
            var main = skylarkjs.finder.find("#mainWrapper");
            if (main) {
                throb = window.addThrob(main, function() {
                    require(["bootstrap"], function() {
                        main.style.opacity = 1;
                        throb.remove();
                        deferred.resolve();
                    });
                });
            }
            goTop($(".go-top-btn"));
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                $("#sk-navbar").delegate(".nav-item", "click", function(e) {
                    $('#sk-navbar').collapse('hide');
                });
                $(".logo-nav").on("click", function() {
                    $('#sk-navbar').collapse('hide');
                })
                $(".navbar").addClass("navbar-default");
            }
            e.result = deferred.promise;
        },

        starting: function(e) {
            this._showProcessing();
        },
        started: function(e) {
            this._hideProcessing();
        }
    });
});