pluralize = function(n, thing, options) {
    var plural = thing;
    if (_.isUndefined(n)) {
        return thing;
    } else if (n !== 1) {
        if (thing.slice(-1) === 's')
            plural = thing + 'es';
        else
            plural = thing + 's';
    }

    if (options && options.hash && options.hash.wordOnly)
        return plural;
    else
        return n + ' ' + plural;
}

Handlebars.registerHelper('pluralize', pluralize);


UI.registerHelper('activePage', function() {
    // includes Spacebars.kw but that's OK because the route name ain't that.
    var routeNames = arguments;

    return _.include(routeNames, Router.current().route.name) && 'active';
});

UI.registerHelper("formatTime", function(time) {
    return moment(time).fromNow();
})

UI.registerHelper("getRelated", function() {
    return Activities.find({
        userId: Router.current().params['_id']
    }).fetch()
})

UI.registerHelper("debug", function(optionalValue) {
    console.log("Current Context");
    console.log("====================");
    console.log(this);
    if (optionalValue) {
        console.log("Value");
        console.log("====================");
        console.log(optionalValue);
    }
});

UI.registerHelper("equal", function(a, b) {
    return a === b;
});

UI.registerHelper("formatSizeUnits", function(bytes) {
    if (bytes >= 1000000000) {
        bytes = (bytes / 1000000000).toFixed(2) + ' GB';
    } else if (bytes >= 1000000) {
        bytes = (bytes / 1000000).toFixed(2) + ' MB';
    } else if (bytes >= 1000) {
        bytes = (bytes / 1000).toFixed(2) + ' KB';
    } else if (bytes > 1) {
        bytes = bytes + ' bytes';
    } else if (bytes == 1) {
        bytes = bytes + ' byte';
    } else {
        bytes = '0 byte';
    }
    return bytes;
});
