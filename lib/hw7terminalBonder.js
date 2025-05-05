const { Publisher } = require('./Publisher.js');

class TerminalBonder {
    #value = 0; //final message from cancellation stored here

    get value() {
        return this.#value;
    }

    //bind calculation to event sources
    //store value, and return the source publisher
    bind(source, calculation) {
        let self = this;

        source.subscribe(function(eventProperties) {
            self.#value = calculation(eventProperties);
            console.log(self.#value);
        });

        return source; //returns the source publisher (better than NULL...)
    }
}

module.exports = {
    TerminalBonder
}