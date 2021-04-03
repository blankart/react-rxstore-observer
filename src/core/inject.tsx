import * as React from "react"
import { Action, RxStore } from "rxstore-observer"
import { InjectorConfig } from '../types'

/**
 * Consumer factory, used to connect existing
 * React Context to the store. The generated
 * consumer will subscribe to any actions dispatched
 * which can be used to perform side effects By doing 
 * this, the store would be able to control the context's 
 * value by dispatching certain action objects.
 * 
 * @example
 * ```jsx
 * import * as React from 'react'
 * import { inject } from 'react-rxstore-observer'
 * import ViewportContext, { Provider } from './viewport-context'
 * import { render } from 'react-dom'
 * import store, { useDispatch } from './store'
 * 
 * const ConnectedViewportContext = inject(store, {
 *      context: ViewportContext,
 *      type: "CHANGE_VIEWPORT",
 *      subscribe: (props, { payload: { width }}) => {
 *          props.changeViewport( width )
 *          return () => {
 *              // Cleanup function for every context value changes.
 *          }
 *      },
 *      setup: (props, getState, dispatch) => {
 *          // Do something before running the subscription.
 *      }
 * })
 * 
 * render(
 *      <Provider>
 *          <ConnectedViewportContext>
 *              <App/>
 *          </ConnectedViewportContext>
 *      </Provider>,
 *      document.getElementById('root')
 * )
 * 
 * ```
 * 
 * @param {RxStore<S, T>} store 
 * @param {InjectorConfig} injectorConfig 
 * @return {React.ComponentType} consumer component.
 */
const inject = <
    S extends Record<string, any>, 
    T extends Action, 
    U extends any
>( store: RxStore<S, T>, injectorConfig: InjectorConfig<S, T, U> ) => {
    if ( typeof injectorConfig !== 'object' ) {
        throw new Error( 'Parameter passed not a valid injector config. Make sure to return an object.' )
    }

    if ( ! injectorConfig.context ) {
        throw new Error( '`context` is not passed inside the injector config.' )
    }

    if ( ! injectorConfig.subscribe || typeof injectorConfig.subscribe !== 'function' ) {
        throw new Error( '`subscribe` must be of type function inside the injector config' )
    }

    if ( ! store.getState || ! store.dispatch ) {
        throw new Error( 'Parameter passed is not a valid store.' )
    }

    const ProviderWithInjectedContext = ( { children }: { children: React.ReactNode } ) => {
        const injectorContext = React.useContext( injectorConfig.context )
        React.useEffect( () => {
            let setup = () => true
            if ( injectorConfig.setup ) {
                setup = injectorConfig.setup( injectorContext, store.getState, store.dispatch )
            }

            const unsubscribe = store.subscribe( action => {
                if ( action.type && action.type !== injectorConfig.type ) {
                    return
                }

                injectorConfig.subscribe( injectorContext, action )
            } )

            return () => {
                unsubscribe()
                if ( typeof setup === 'function' ) {
                    setup()
                }
            }
        }, [ injectorContext ] )

        return <>{ children }</>
    }

    return ProviderWithInjectedContext
}

export default inject