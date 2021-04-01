# React RxStore Observer

This is the official React bindings for [RxStore Observer](https://github.com/blankart/rxstore-observer).

This project is currently in development.

### Usage:
```jsx
import { createStoreHooks } from 'react-rxstore-observer'
import store from './store'

const [useStore, useDispatch] = createStoreHooks(store);

const AwesomeComponent = () => {
    const name = useStore(store => store.name)
    const dispatch = useDispatch()
    return (
        <div>
            Hello { name } 
            <button onClick={() => dispatch({ type: 'DO_SOMETHING_AWESOME' })}>Do something awesome!</button>
        </div>
    )
}
```