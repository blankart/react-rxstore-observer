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
    type: ActionType<T>
    context: React.Context<P>
    subscribe: ( p: P, a: T ) => any
    setup?: ( p: P, g: RxStore<S, T>[ "getState" ], d: RxDispatch<T> ) => any
}