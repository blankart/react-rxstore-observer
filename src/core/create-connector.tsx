import * as React from "react"
import { RxStore, Action } from "rxstore-observer"
import { RxDispatch } from "rxstore-observer/types/types"
import { WithConnectProps } from "../types"
import useStore from "./use-store"

/**
 * Higher-order creator for generating a components 
 * connected to the store.
 * 
 * @example
 * ```jsx
 * import { createConnector } from 'react-rxstore-observer'
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
    S,
    T extends Action 
>( 
    store: RxStore<S, T>,
) => {
    return <P, M  = Record<string, any>>( mapSelectorFunction: ( s: S ) => M ) => {
        return <D extends Record<string, any>>( mapDispatchFunction: ( dispatch: RxDispatch<T> ) => D ) => {
            return ( Component: React.ComponentType<WithConnectProps<P, M, D>> ) => {
                const NewComponent: React.FC<P> = props => {
                    const [ state, setState ] = React.useState( mapSelectorFunction( store.getState() ) )
                    useStore( store, setState, mapSelectorFunction )
                    return <Component { ...props } { ...state } { ...mapDispatchFunction( store.dispatch ) }/> 
                }

                return NewComponent as React.ComponentType<P>
            }
        }
    }
}

export default createConnector