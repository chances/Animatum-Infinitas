import Events = require('./Bridge');
import Application = require('./Application');

var services: {
    events: Events.Bridge;
} = {
    events: new Events.Bridge()
};

//$.fn.hasAttr = function(name: string): boolean {
//    var attr = this.attr(name);
//    return attr !== undefined && attr !== false;
//    //return this.attr(name) !== undefined;
//};

var app = new Application();

app.debug();
