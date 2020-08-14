!function (e) {
    var n = {};

    function t(r) {
        if (n[r]) return n[r].exports;
        var o = n[r] = {i: r, l: !1, exports: {}};
        return e[r].call(o.exports, o, o.exports, t), o.l = !0, o.exports
    }

    t.m = e, t.c = n, t.d = function (e, n, r) {
        t.o(e, n) || Object.defineProperty(e, n, {enumerable: !0, get: r})
    }, t.r = function (e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {value: "Module"}), Object.defineProperty(e, "__esModule", {value: !0})
    }, t.t = function (e, n) {
        if (1 & n && (e = t(e)), 8 & n) return e;
        if (4 & n && "object" == typeof e && e && e.__esModule) return e;
        var r = Object.create(null);
        if (t.r(r), Object.defineProperty(r, "default", {
            enumerable: !0,
            value: e
        }), 2 & n && "string" != typeof e) for (var o in e) t.d(r, o, function (n) {
            return e[n]
        }.bind(null, o));
        return r
    }, t.n = function (e) {
        var n = e && e.__esModule ? function () {
            return e.default
        } : function () {
            return e
        };
        return t.d(n, "a", n), n
    }, t.o = function (e, n) {
        return Object.prototype.hasOwnProperty.call(e, n)
    }, t.p = "./dist/", t(t.s = 0)
}([function (e, n) {
    const t = "offline-fallback";

    function r(e) {
        return caches.open(t).then((function (n) {
            return n.match(e).then((function (e) {
                return e || Promise.reject("request-not-in-cache")
            }))
        }))
    }

    self.addEventListener("install", (function (e) {
        e.waitUntil(function () {
            const e = [{
                'revision': 'ff4906587ef7fe8f1f69b8c602fae09b',
                'url': './dist/../index.html'
            }, {
                'revision': '23071710d50091e88b8726744a64646c',
                'url': './dist/192.png'
            }, {
                'revision': 'd34dba39209f88ed6353a25ae9104da7',
                'url': './dist/512.png'
            }, {
                'revision': 'ad885fccff1ed0c3f0d5fe52a30ea7ba',
                'url': './dist/bloop.mp3'
            }, {
                'revision': 'ed8ab97d6afa6ee4c0fc0a81a74234b5',
                'url': './dist/boat.svg'
            }, {
                'revision': 'd4afdadc891111e4f9806af1a61bfc58',
                'url': './dist/boat2.svg'
            }, {
                'revision': 'c613f991fa44ff046341d86f9a975efa',
                'url': './dist/boat3.svg'
            }, {
                'revision': 'a6dd4bb18face67c651cefcde8342729',
                'url': './dist/boat4.svg'
            }, {
                'revision': 'c63512961fe7dc41e9749b843ee3cefe',
                'url': './dist/boat5.svg'
            }, {
                'revision': '4f2da3c4adf360ea6fc7701819680be6',
                'url': './dist/boat6.svg'
            }, {
                'revision': '7cdeed812cd36d4c6dbf8d4ce826b20f',
                'url': './dist/boat7.svg'
            }, {
                'revision': '09c2dc967913156897e977497eb7affa',
                'url': './dist/main.bec2a214e68b074d5959.css'
            }, {
                'revision': 'a2bed5e27466d74f2acb30321258d4a8',
                'url': './dist/main.e5057635f91c52b6ded5.js'
            }, {'revision': '29426e94eda462af1431675347a5e456', 'url': './dist/maskable_icon.png'}].map(e => e.url);
            return caches.open(t).then((function (n) {
                return n.addAll(["./", ...e])
            }))
        }().then((function () {
            return self.skipWaiting()
        })))
    })), self.addEventListener("activate", (function (e) {
        e.waitUntil(self.clients.claim())
    })), self.addEventListener("fetch", (function (e) {
        var n;
        e.respondWith((n = e.request, fetch(n).then((function (e) {
            return e.ok ? e : r(n)
        })).catch((function () {
            return r(n)
        }))).catch((function () {
            return caches.open(t).then((function (e) {
                return e.match("./")
            }))
        })))
    }))
}]);