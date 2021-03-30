import * as React from "react"
import { RxStore, Action } from "rxstore-watch"
import { RxDispatch } from "rxstore-watch/types/types"
import useStore from "./use-store"

/**
 * Hook creator which is used for generating two hooks:
 * (1): Hook for subscribing to the store.
 * (2): Hook for accessing the dispatch function of the store.
 * 
 * @example
 * ```
 * 
 * import { createStoreHooks } from 'react-rxstore-watch'
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
    T extends Action
>(
    store: RxStore<S, T>
): [( f: ( s: S ) => any ) => any, () => RxDispatch<T>] => {
    const useSelector = ( mapSelectorFunction: ( s: S ) => any ) => {
        const [ state, setState ] = React.useState( mapSelectorFunction( store.getState() ) )
        useStore( store, setState, mapSelectorFunction )
        return state
    }

    const useDispatch = (): RxStore<S, T>["dispatch"] => {
        return store.dispatch
    }

    return [ useSelector, useDispatch ]
}

export default createStoreHooks