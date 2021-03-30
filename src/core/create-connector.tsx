import * as React from "react"
import { RxStore, Action } from "rxstore-watch"
import { RxDispatch } from "rxstore-watch/types/types"
import useStore from "./use-store"

/**
 * Higher-order creator for generating a components 
 * connected to the store.
 * 
 * @example
 * ```jsx
 * import { createConnector } from 'react-rxstore-watch'
 * import store from '../store'
 * 
 * const withStore = createConnector( store );
 * 
 * const AwesomeComponent = ({ increment, decrement, counter }) => {
 *      return (
 *          <>
 *              <div>{ counter }</div>
 *              <button onClick={ increment }>+</button>
 *              <button onClick={ decement }>-</button>
 *          </>
 *      )
 * }
 * 
 * const storeMapper = (store) => ({ counter: store.counter })
 * const dispatchMapper = (dispatch) => ({ 
 *      increment: () => dispatch({ type: "INCREMENT" }),
 *      decrement: () => dispatch({ type: "DECREMENT" })
 * })
 * 
 * export default withStore(storeMapper)(dispatchMapper)(AwesomeComponent);
 * ```
 * 
 * @param {RxStore<S, T>} store 
 * @return Higher Order Component with store.
 */
const createConnector = <
    S extends Record<string, any>,
    T extends Action
>(
    store: RxStore<S, T>
) => ( mapSelectorFunction: ( s: S ) => Record<string, any> ) => (
    mapDispatchFunction: (
        dispatch: RxDispatch<T> 
    ) => Record<string, ( a?: any ) => any>
) => <T extends Record<string, any>>( Component: React.ComponentType<T> ) => {
    return function NewComponent( props: T ): JSX.Element  {
        const [ state, setState ] = React.useState( mapSelectorFunction( store.getState() ) )
        useStore( store, setState, mapSelectorFunction )
        return <Component { ...props } { ...state } { ...mapDispatchFunction( store.dispatch ) } />
    }
}

export default createConnector