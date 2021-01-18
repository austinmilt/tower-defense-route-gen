/**
 * This event class allows components to (un)subscribe, giving a direct reference
 * to the event that can be used easily in multiple places. The usage pattern for subscribers
 * is like
 * 
 * ```
 * class MyClass extends React.Component {
 * 
 *  componentDidMoutn() {}
        Events.COLUMNS_SLIDER_VALUE_CHANGE.subscribe(this.updateColumns);
    }

    componentWillUnmount() {
        Events.COLUMNS_SLIDER_VALUE_CHANGE.unsubscribe(this.updateColumns);
    }
  }
 * ```
 *
 * The usage pattern for event firers is like
 * 
 * ```
 * ...
 *    myMethod() {
 *       Events.COLUMNS_SLIDER_VALUE_CHANGE.fire(3);
 *    }
 * ...
 * ```
 */
class Event<T> {
    private readonly subscribers : Set<Subscriber<T>> = new Set<Subscriber<T>>();

    constructor() {
        this.subscribe = this.subscribe.bind(this);
        this.unsubscribe = this.unsubscribe.bind(this);
        this.fire = this.fire.bind(this);
    }


    /**
     * Subscribe a callback to the event.
     * 
     * @param subscriber reference to callback subscriber method to be called when the event fires
     */
    public subscribe(subscriber : Subscriber<T>) {
        this.subscribers.add(subscriber);
    }


    /**
     * Unsubscribe a callback from the event.
     * 
     * @param subscriber reference to callback subscriber method to remove from event subscription
     */
    public unsubscribe(subscriber : Subscriber<T>) {
        this.subscribers.delete(subscriber);
    }


    /**
     * Send the event payload to all subscribers.
     * 
     * @param details event payload
     */
    public fire(details : T) : void {
        for (let subscriber of this.subscribers) {
            subscriber(details);
        }
    }
}


/**
 * Callback for events.
 */
interface Subscriber<T> {

    /**
     * @param eventDetails event payload
     */
    (eventDetails : T) : void;
}


/** Events, that can be fired by and/or subscribed to by components. */
class Events {

    /** Event for when the grid column size slider value changes. */
    public static readonly COLUMNS_SLIDER_VALUE_CHANGE : Event<number> = new Event<number>();

    /** Event for when the grid row size slider value changes. */
    public static readonly ROWS_SLIDER_VALUE_CHANGE : Event<number> = new Event<number>();

    /** Event for when the show labels checkbox state changes. */
    public static readonly SHOW_LABELS_CHECKBOX_CHANGE : Event<boolean> = new Event<boolean>();

    /** Event for when the animate routes checkbox state changes. */
    public static readonly ANIMATE_ROUTES_CHECKBOX_CHANGE : Event<boolean> = new Event<boolean>();

    /** Event for when a path generator submits a status message. */
    public static readonly GENERATOR_STATUS_INFO : Event<string> = new Event<string>();

    /** Event for when the selected path generation algorithm changes. */
    public static readonly GENERATOR_ALGORITHM_SELECT : Event<string> = new Event<string>();

    /** Event for when the grid paint mode changes. */
    public static readonly PAINT_MODE_SELECT : Event<string> = new Event<string>();

    /** Event for when the user clicks on the button to generate paths. */
    public static readonly GENERATE_BUTTON : Event<void> = new Event<void>();

    /** Event for when the user clicks on the button to clear routes from the grid. */
    public static readonly CLEAR_ROUTES_BUTTON : Event<void> = new Event<void>();

    /** Event for when the user clicks on the button to clear all states (paths, entrances, exits, etc) from the grid. */
    public static readonly RESET_GRID_BUTTON : Event<void> = new Event<void>();

    /** Event for when the user click on the download grid button. */
    public static readonly DOWNLOAD_GRID_BUTTON : Event<void> = new Event<void>();
}


export {Events, Event};
export type {Subscriber};