import * as React from "react"
import { Action, RxStore } from "rxstore-observer"
import shallowEqual from '../utils/shallow-equal'

/** @internal */
const useStore = <
    S extends Record<string, any>,
    T extends Action,
    U extends any
>( store: RxStore<S, T>, setter: React.Dispatch<React.SetStateAction<U>>, mapSelectorFunction: ( s: S ) => U  ): void => {
    React.useEffect( () => {
        let current = mapSelectorFunction( store.getState() )
        const unsubscribe = store.subscribe( () => {
            const mutatedStore = mapSelectorFunction( store.getState() )
            if ( current !== mutatedStore && ! shallowEqual( current as Record<string, any>, mutatedStore as Record<string, any> ) ) {
                current = mutatedStore
                setter( mutatedStore )
            }
        } )

        return () => unsubscribe()
    }, [] )
}

export default useStore