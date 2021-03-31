import * as React from 'react'
import { createRxStore } from 'rxstore-observer'
import { reducer } from '../../templates/mock-store'
import createConnector from '../create-connector'
import { act, render } from '@testing-library/react'

describe( 'createConnector', () => {
    test( 'Render counts and store values', () => {
        const dummyStore = createRxStore( reducer )
        const connect = createConnector( dummyStore )
        const mockFunctionChildComponent1 = jest.fn()
        const mockFunctionChildComponent2 = jest.fn()
        const mockFunctionChildComponent3 = jest.fn()

        const ConnectedChildComponent1 = connect( ( { dummyField1 } ) => ( { dummyField1 } ) )( () => ( {} ) )( ( { dummyField1 } ) => {
            mockFunctionChildComponent1()
            return (
                <div data-testid="dummyField1">{ dummyField1 }</div>
            )
        } )

        interface ChildComponent2Props {
            value: string
            dummyField2?: string
        }

        const ChildComponent2: React.FC<ChildComponent2Props> = ( { dummyField2, value } ) => {
            mockFunctionChildComponent2()
            return (
                <>
                    <div data-testid="dummyField2">{ dummyField2 }</div>
                    <div>{ value }</div>
                </>
            )
        }

        const ConnectedChildComponent2 = connect<ChildComponent2Props>( ( { dummyField2 } ) => ( { dummyField2 } ) )( () => ( {} ) )( ChildComponent2 )

        const ConnectedChildComponent3 = connect( ( { dummyField3 } ) => ( { dummyField3 } ) )( () => ( {} ) )( ( { dummyField3 } ) => {
            mockFunctionChildComponent3()
            return (
                <div data-testid="dummyField3">{ dummyField3 }</div>
            )
        } )

        const ParentComponent = () => {
            return (
                <>
                    <ConnectedChildComponent1/>
                    <ConnectedChildComponent2 value={ 'value' }/>
                    <ConnectedChildComponent3/>
                </>
            )
        }

        const { getByTestId } = render( <ParentComponent/> )

        expect( mockFunctionChildComponent1 ).toBeCalledTimes( 1 )
        expect( mockFunctionChildComponent2 ).toBeCalledTimes( 1 )
        expect( mockFunctionChildComponent3 ).toBeCalledTimes( 1 )

        act( () => {
            dummyStore.dispatch( { type: 'CHANGE_DUMMY_FIELD_1', payload: 'Changed value' } )
            dummyStore.dispatch( { type: 'CHANGE_DUMMY_FIELD_2', payload: 'Changed value' } )
            dummyStore.dispatch( { type: 'CHANGE_DUMMY_FIELD_3', payload: 'Changed value' } )
        } )

        expect( getByTestId( 'dummyField1' ).innerHTML ).toBe( 'Changed value' )
        expect( getByTestId( 'dummyField2' ).innerHTML ).toBe( 'Changed value' )
        expect( getByTestId( 'dummyField3' ).innerHTML ).toBe( 'Changed value' )

        expect( mockFunctionChildComponent1 ).toBeCalledTimes( 2 )
        expect( mockFunctionChildComponent2 ).toBeCalledTimes( 2 )
        expect( mockFunctionChildComponent3 ).toBeCalledTimes( 2 )

        act( () => {
            dummyStore.dispatch( { type: 'CHANGE_DUMMY_FIELD_3', payload: 'Changed value 2' } )
            dummyStore.dispatch( { type: 'CHANGE_DUMMY_FIELD_3', payload: 'Changed value 2' } )
            dummyStore.dispatch( { type: 'CHANGE_DUMMY_FIELD_3', payload: 'Changed value 2' } )
            dummyStore.dispatch( { type: 'CHANGE_DUMMY_FIELD_3', payload: 'Changed value 2' } )
        } )

        expect( getByTestId( 'dummyField3' ).innerHTML ).toBe( 'Changed value 2' )
        expect( mockFunctionChildComponent1 ).toBeCalledTimes( 2 )
        expect( mockFunctionChildComponent2 ).toBeCalledTimes( 2 )
        expect( mockFunctionChildComponent3 ).toBeCalledTimes( 3 )
    } )
} )