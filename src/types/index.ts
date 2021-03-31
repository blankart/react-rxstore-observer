import { ActionType, Action, RxDispatch, RxStore } from 'rxstore-observer'

/**
 * Combined props from original component
 * props, store map, and dispatch map.
 */
export type WithConnectProps<
    M extends Record<string, any>,
    D extends Record<string, any>,
    P extends Record<string, any>
> = M & D & P

export interface InjectorConfig<S, T extends Action, P extends any> {
    /**
     * Action type in
     * which the store will subscribe to.
     * If not specified, the injector
     * will subscribe to any action changes.
     */
    type?: ActionType<T>
    /**
     * An instance of React Context.
     */
    context: React.Context<P>
    /**
     * Subscribe function which will
     * run on every action dispatched in
     * store.
     * 
     * The first argument is the value of the
     * Context. Take note that the value is not
     * reactive. It only gets the initial
     * value of the context.
     * 
     * The second argument is the latest action dispatched.
     * If the `type` property is specified, the subscribe
     * function will only run everytime it matches the current action
     * type.
     * 
     */
    subscribe: ( p: P, a: T ) => any
    /**
     * Setup function which will run when the
     * consumer is mounted. 
     * 
     * The first argument is the value of the
     * Context. Take note that the value is not
     * reactive. It only gets the initial
     * value of the context.
     * 
     * The second argument is the `getState` function of the
     * store. It returns the latest state of the store.
     * 
     * The third argument is the `dispatch` function of the
     * store. It is used to dispatch an action.
     */
    setup?: ( p: P, g: RxStore<S, T>[ "getState" ], d: RxDispatch<T> ) => any
}