# React RxStore Watch

This is the official React bindings for [RxStore Watch](https://github.com/blankart/rxstore-watch).

This project is currently in development.

### Usage:
```jsx
import { createStoreHooks } from 'react-rxstore-watch'
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