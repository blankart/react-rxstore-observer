import * as React from "react"
import { RxStore, Action } from "rxstore-watch"
import { RxDispatch } from "rxstore-watch/types/types"
import shallowEqual from "../utils/shallow-equal"

const createStoreHooks = <
    S extends Record<string, any>,
    T extends Action
>(
    store: RxStore<S, T>
): [( f: ( s: S ) => any ) => any, () => RxDispatch<T>] => {
    const useSelector = ( selectorFunction: ( s: S ) => any ) => {
        const [ state, setState ] = React.useState(
            selectorFunction( store.getState() )
        )
        React.useEffect( () => {
            let current = selectorFunction( store.getState() )
            const unsubscribe = store.subscribe( state => {
                const mutatedStore = selectorFunction( state )
                if ( current !== mutatedStore && ! shallowEqual( current, mutatedStore )  ) {
                    current = mutatedStore
                    setState( mutatedStore )
                }
            } )

            return () => unsubscribe()
        }, [] )

        return state
    }

    const useDispatch = (): RxStore<S, T>["dispatch"] => {
        return store.dispatch
    }

    return [ useSelector, useDispatch ]
}

export default createStoreHooks