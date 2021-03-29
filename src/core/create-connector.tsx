import * as React from "react"
import { RxStore, Action } from "rxstore-watch"
import { RxDispatch } from "rxstore-watch/types/types"
import shallowEqual from "../utils/shallow-equal"

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
        const [ mapSelector, setMapSelector ] = React.useState(
            mapSelectorFunction( store.getState() )
        )
        const [ mapDispatch ] = React.useState( mapDispatchFunction( store.dispatch ) )
        React.useEffect( () => {
            let current = mapSelectorFunction( store.getState() )
            const unsubscribe = store.subscribe( state => {
                const mutatedStore = mapSelectorFunction( state )
                if ( current !== mutatedStore && ! shallowEqual( current, mutatedStore ) ) {
                    current = mutatedStore
                    setMapSelector( mutatedStore )
                }
            } )

            return () => unsubscribe()
        }, [] )

        return <Component { ...props } { ...mapSelector } { ...mapDispatch } />
    }
}

export default createConnector