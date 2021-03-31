import * as React from "react"
import { RxStore, Action, RxDispatch } from "rxstore-observer"
import useStore from "./use-store"

/**
 * Hook creator which is used for generating two hooks:
 * (1): Hook for subscribing to the store.
 * (2): Hook for accessing the dispatch function of the store.
 * 
 * @example
 * ```
 * 
 * import { createStoreHooks } from 'react-rxstore-observer'
 * import store from '../store'
 * 
 * const [useSelector, useDispatch] = createStoreHooks( store );
 * 
 * const AwesomeComponent = () => {
 *      const counter = useSelector(store => store.counter)
 *      const dispatch = useDispatch();
 *      const increment = () => dispatch({ type: "INCREMENT" })
 *      const decrement = () => dispatch({ type: "DECREMENT" })
 *      return (
 *          <>
 *              <div>{ counter }</div>
 *              <button onClick={ increment }>+</button>
 *              <button onClick={ decement }>-</button>
 *          </>
 *      )
 * }
 * ```
 * 
 * @param {RxStore<S, T} store 
 * @return store and dispatch hooks.
 */
const createStoreHooks = <
    S extends Record<string, any>,
    T extends Action,
>(
    store: RxStore<S, T>
) => {
    const useSelector = <U>( mapSelectorFunction: ( s: S ) => U ): U => {
        const [ state, setState ] = React.useState( mapSelectorFunction( store.getState() ) )
        useStore( store, setState, mapSelectorFunction )
        return state
    }

    const useDispatch = (): RxDispatch<T> => {
        return store.dispatch
    }

    return [ useSelector, useDispatch ] as [ typeof useSelector, typeof useDispatch ]
}

export default createStoreHooks