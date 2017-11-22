define([
    "jquery",
    "skylarkjs",
], function($, skylarkjs) {
    var spa = skylarkjs.spa,
        langx = skylarkjs.langx,
        Service = langx.klass({
            klassName: "SpaService",
            memory: {},
            init: function(config) {
                this.memory = {
                    products: {},
                    users: {},
                    warranties: {},
                    dealers: {},
                    cities: {},
                    provinces: {}
                };
            },

            start: function(callback) {
                if (this.memory.data) {
                    return langx.Deferred.when(this.memory.data);
                } else {
                    var deferred = new langx.Deferred(),
                        self = this,
                        backendApi = spa().getConfig("backendApi"),
                        tokenApi = spa().getConfig("tokenApi");
                    // $.get(tokenApi, function(token) {
                    // $.get(backendApi + "?private_token=" + token.token, function(data) {
                    $.get(backendApi, function(data) {
                        self.memory.data = data;
                        deferred.resolve(data);
                        // });
                    });
                    return deferred.promise;
                }
            },

            getProvinces: function() {
                var self = this;
                if (this.memory.provinces.index) {
                    return langx.Deferred.when(this.memory.provinces.index);
                }
                return this.connect("provinces", "get", "index").then(function(data) {
                    self.memory.provinces.index = data;
                    return data;
                });
            },

            getProvincesByCity: function(cityId) {
                var city = this.memory.cities.index.filter(function(c) { return c.id === cityId })[0];
                return city ? this.memory.provinces.filter(function(p) { return p.id === city.provinceId })[0] : null;
            },

            getCities: function(provinceId, cs) {
                cs.empty();
                return this.connect("cities", "get", "index?provinceId=" + provinceId).then(function(cities) {
                    $('<option value="0" class="--i18n--" data-i18n-key="select">选择</option>').appendTo(cs);
                    cities.forEach(function(c) {
                        $("<option>").attr({
                            class: "--i18n--",
                            "data-i18n-key": c.pinyin,
                            value: c.id
                        }).html(c.name).appendTo(cs);
                    });
                });
            },

            startServer: function() {
                var deferred = new langx.Deferred();
                $.get("/api/start", function(data) {
                    deferred.resolve(data);
                });
                return deferred.promise;
            },

            connect: function(name, method, action, args) {
                var main = $("#main")[0],
                    self = this,
                    deferred = new langx.Deferred(),
                    throb = window.addThrob(main, function() {
                        if (args) {
                            $[method]("/api/" + name + "/" + action, args, function(data) {
                                self.memory[name][action] = data;
                                throb.remove();
                                main.style.opacity = 1;
                                deferred.resolve(data);
                            });
                        } else {
                            $[method]("/api/" + name + "/" + action, function(data) {
                                if (self.memory[name]) self.memory[name][action] = data;
                                throb.remove();
                                main.style.opacity = 1;
                                if (data.status == false) {
                                    deferred.resolve(null);
                                } else {
                                    deferred.resolve(data);
                                }
                            });
                        }
                    });
                return deferred.promise;
            }
        });

    var server;
    var serverFunc = function(config) {
        if (!server) {
            window.spaServer = server = new Service(config);
        }
        return server;
    }
    return serverFunc;
});
