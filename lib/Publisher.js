class Publisher {
    #subscribers;

    constructor() {
        this.#subscribers = new Set(); //makes sure subscriber is only subscribed once
    }

    subscribe(handlerFn) {
        this.#subscribers.add(handlerFn); //add subscriber to channel 
    }

    unsubscribe(handlerFn) {
        return this.#subscribers.delete(handlerFn); //take off subscriber 
    }

    publish(eventProperties) {
        this.#subscribers.forEach(
            handlerFn => handlerFn(eventProperties)  //publish message to all subscribers
        );
    }
}

module.exports = {
    Publisher
}