import * as React from "react"
import { Action, RxStore } from "rxstore-watch"
import shallowEqual from '../utils/shallow-equal'

/** @internal */
const useStore = <
    S extends Record<string, any>,
    T extends Action,
    U extends ( a?: any ) => any
>( store: RxStore<S, T>, setter: React.Dispatch<React.SetStateAction<S>>, mapSelectorFunction: U ): void => {
    React.useEffect( () => {
        let current = mapSelectorFunction( store.getState() )
        const unsubscribe = store.subscribe( state => {
            const mutatedStore = mapSelectorFunction( state )
            if ( current !== mutatedStore && ! shallowEqual( current, mutatedStore ) ) {
                current = mutatedStore
                setter( mutatedStore )
            }
        } )

        return () => unsubscribe()
    }, [] )
}

export default useStore