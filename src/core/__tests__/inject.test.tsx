import * as React from 'react'
import { combineReducers, createRxStore } from 'rxstore-observer'
import { reducer, Action, State } from '../../templates/mock-store'
import createConnector from '../create-connector'
import { act, render } from '@testing-library/react'
import inject from '../inject'

describe( 'inject', () => {
    test( 'Add custom observer from Context', () => {
        interface ValueAction {
            type: "CHANGE_PROVIDER_VALUE",
            payload: string
        }
        const mockFunction1 = jest.fn()
        const mockFunction2 = jest.fn()
        const mockFunction3 = jest.fn()

        const valueReducer = ( state = "", action: ValueAction ) => {
            switch ( action.type ) {
            case "CHANGE_PROVIDER_VALUE": {
                return action.payload
            }
            default: return state
            }
        }

        const dummyStore = createRxStore( combineReducers<{ main: State, value: string }, ValueAction | Action>( { main:reducer, value: valueReducer } ) )
        const connect = createConnector( dummyStore ) 
        const DummyContext = React.createContext<{value: string, setValue: React.Dispatch<string>}>( { value: '', setValue: ( a: any ) => a } )

        const DummyProvider = ( { children }: { children: JSX.Element[] | JSX.Element } ) => {
            const [ value, setValue ] = React.useState( "" )
            return <DummyContext.Provider value={ { value, setValue } }>{ children }</DummyContext.Provider>
        }

        const InjectedDummyProvider = inject( dummyStore, {
            type: "CHANGE_PROVIDER_VALUE", 
            context: DummyContext, 
            subscribe: ( props, action ) => {
                props.setValue( action.payload )
            },
            setup: ()  => {
                mockFunction3()
            }
        } )

        const DummyContextConsumer = () => {
            const { value } = React.useContext( DummyContext )
            mockFunction1()
            return <div data-testid="valueFromConsumer">{ value }</div>
        }

        const ConnectedComponent = connect( store => store )( () => ( {} ) )( ( { main: { dummyField1, dummyField2, dummyField3 }, value } ) => {
            mockFunction2()
            return (
                <>
                    <div data-testid="dummyField1">{ dummyField1 }</div>
                    <div data-testid="dummyField2">{ dummyField2 }</div>
                    <div data-testid="dummyField3">{ dummyField3 }</div>
                    <div data-testid="value">{ value }</div>
                </>
            )
        } )

        const { getByTestId } = render( 
            <DummyProvider>
                <InjectedDummyProvider>
                    <DummyContextConsumer/>
                    <ConnectedComponent/>
                </InjectedDummyProvider>
            </DummyProvider> 
        )

        act( () => {
            dummyStore.dispatch( { type: "CHANGE_DUMMY_FIELD_1", payload: "Changed value" } )
            dummyStore.dispatch( { type: "CHANGE_DUMMY_FIELD_2", payload: "Changed value" } )
            dummyStore.dispatch( { type: "CHANGE_DUMMY_FIELD_3", payload: "Changed value" } )
            dummyStore.dispatch( { type: "CHANGE_PROVIDER_VALUE", payload: "Changed value" } )
        } )

        expect( mockFunction2 ).toBeCalledTimes( 2 )
        expect( mockFunction1 ).toBeCalledTimes( 2 )
        expect( mockFunction3 ).toBeCalledTimes( 1 )
        expect( getByTestId( 'dummyField1' ).innerHTML ).toBe( 'Changed value' )
        expect( getByTestId( 'dummyField2' ).innerHTML ).toBe( 'Changed value' )
        expect( getByTestId( 'dummyField3' ).innerHTML ).toBe( 'Changed value' )
        expect( getByTestId( 'value' ).innerHTML ).toBe( 'Changed value' )
        expect( getByTestId( 'valueFromConsumer' ).innerHTML ).toBe( 'Changed value' )
    } )
} )