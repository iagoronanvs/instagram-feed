$(function () {
    function m(c) {
        var b = $.Deferred();
        f.length && f.length === c.count && c.account === l && !c.getMore ? b.resolve(f, f.length) : (l = c.account, $.get("https://www.instagram.com/" + c.account + "/", function (a) {
            try {
                a = a.split("window._sharedData = ")[1].split("\x3c/script>")[0]
            } catch (d) {
                console.error("It looks like the profile you are trying to fetch is age restricted.");
                b.reject();
                return
            }
            a = JSON.parse(a.substr(0, a.length - 1));
            a = a.entry_data.ProfilePage || a.entry_data.TagPage;
            if ("undefined" === typeof a) console.error("It looks like YOUR network has been temporary banned because of too many requests."),
                b.reject(); else if (a = a[0].graphql.user || a[0].graphql.hashtag, "undefined" !== typeof a.is_private && !0 === a.is_private) console.error("This profile is private"), b.reject(); else {
                var e = 0;
                c.getMore && f.length ? e = f.length : f = [];
                a = (a.edge_owner_to_timeline_media || a.edge_hashtag_to_media).edges;
                for (var g = a.length > c.count + e ? c.count + e : a.length, k = []; e < g; e++) k.push({
                    image: a[e].node.display_url,
                    url: "https://www.instagram.com/p/" + a[e].node.shortcode
                });
                f = f.concat(k);
                b.resolve(k, g)
            }
        }).fail(function (a) {
            console.error("Unable to fetch the given user. Instagram responded with the status code: ",
                a.status);
            b.reject()
        }));
        return b.promise()
    }

    function p(c, b) {
        return ['<div class="inst-card slide" style="padding: ' + b + 'px">', '   <a class="inst-card__link" href="' + c.url + '" target="_blank" style="background-image: url(' + c.image + ')"></a>', "</div>"].join("\n")
    }

    var q = $("html").hasClass("is-builder"), f = [], l = "";
    $(document).on("add.cards change.cards", function (c) {
        if ($(c.target).hasClass("mbr-instagram-feed")) {
            var b = function () {
                    d.$content.empty();
                    d.$content.append('<div class="inst__error">Error download Instagram data!</div>');
                    d.hideLoader()
                }, a = $(c.target), d = {
                    $loader: $('<div class="inst__loader-wrapper">\n   <div class="inst__loader">\n      <span></span>\n      <span></span>\n      <span></span>\n   </div>\n</div>'),
                    $content: a.find(".inst__content"),
                    $moreButton: a.find(".inst__more a"),
                    showLoader: function () {
                        $(".inst__loader-wrapper").length || a.append(this.$loader)
                    },
                    hideLoader: function () {
                        this.$loader.remove()
                    }
                }, e = a.attr("data-account"), g = a.attr("data-per-row-grid"), k = a.attr("data-rows"),
                n = a.attr("data-per-row-slider"), l =
                    a.attr("data-spacing");
            c = a.attr("data-full-width");
            var h;
            if (e && (g ? h = "grid" : n && (h = "slider"), h)) switch (c ? a.find(".container_toggle").addClass("container-fluid").removeClass("container") : a.find(".container_toggle").addClass("container").removeClass("container-fluid"), h) {
                case "grid":
                    d.showLoader();
                    m({account: e, count: g * k}).then(function (a) {
                        function c() {
                            var a = d.$content.find(".inst-card"), b;
                            b = 500 > $(window).width() ? 100 : 800 > $(window).width() ? 50 : 100 / g;
                            a.css({width: b + "%", "float": "left"});
                            a.css({height: d.$content.find(".inst-card").outerWidth()})
                        }

                        function h(a) {
                            for (var b = 0, e = a.length; b < e; b++) d.$content.find(".inst__images").append(p(a[b], l));
                            $(window).on("resize", function (a) {
                                c()
                            });
                            c();
                            !q && 12 <= f.length && d.$moreButton.remove()
                        }

                        d.hideLoader();
                        d.$content.empty();
                        d.$content.append('<div class="inst__images clearfix"></div>');
                        h(a);
                        d.$moreButton.on("click", function (a) {
                            q || (a.preventDefault(), d.showLoader(), m({
                                account: e,
                                count: g * k,
                                getMore: !0
                            }).done(function (a) {
                                h(a);
                                d.hideLoader()
                            }).fail(b))
                        })
                    }).fail(b);
                    break;
                case "slider":
                    d.showLoader(), m({
                        account: e,
                        count: 12
                    }).then(function (a) {
                        d.hideLoader();
                        d.$content.empty();
                        d.$content.append('<div class="inst__images"></div>');
                        for (var b = 0, c = a.length; b < c; b++) d.$content.find(".inst__images").append(p(a[b], l));
                        a = d.$content.find(".inst__images");
                        a.on("init, setPosition", function (a) {
                            a = $(this).find(".inst-card");
                            var b = a.css("width");
                            a.css("height", b);
                            return !0
                        });
                        a.slick({
                            infinite: !1,
                            slidesToShow: Number.parseInt(n),
                            slidesToScroll: Number.parseInt(n),
                            arrows: !0,
                            slide: ".slide",
                            responsive: [{
                                breakpoint: 800, settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 2, arrows: !1
                                }
                            }, {breakpoint: 500, settings: {slidesToShow: 1, slidesToScroll: 1, arrows: !1}}]
                        })
                    }).fail(b)
            }
        }
    })
});
