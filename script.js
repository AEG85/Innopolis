
//Реализация store
const createStore = (reducer) => {
    let state = reducer(undefined, { type: '__INIT' })
    let subscribers = [

    ]
    return {
        getState: () => state,
        dispatch: action => {
            state = reducer(state, action)
            subscribers.forEach((callback) => callback())
        },
        subscribe: (callback) => subscribers.push(callback)
    }
}


const ACTIONS = {
    ADD_EVENT: 'ADD_EVENT',
    REMOVE_EVENT: 'REMOVE_EVENT',
    UPDATE_EVENT: 'UPDATE_EVENT',
    SORT_EVENT: 'SORT_EVENT',

    SUCCESS_LOGIN: 'SUCCESS_LOGIN'
}

//actionCreator
const actionCreatorAddEvetn = (eventInfo) => {
    // const eventInfoFull = fetch('запрос на получение данных')
    const eventInfoFull = eventInfo
    return {
        type: ACTIONS.ADD_EVENT,
        payload: eventInfoFull
    }
}

const initialStateEvents = {
    eventsWorld: [
        'Событие 8'
    ]
}
//Чистая функция 
//1. Не должно быть сайд эффестов(асинхронне запросы)
//2. При передачи одних и тех же данных несколько раз, при вызове редюсера получаем один и тот же результат
//immotable
const reducerEvetns = (state = initialStateEvents, action) => {
    switch (action.type) {
        case ACTIONS.ADD_EVENT:
            const newPartState = [...state.eventsWorld]
            newPartState.push(action.payload.text)
            const newState = {
                ...action.state,
                eventsWorld: newPartState
            }
            return newState
        case ACTIONS.UPDATE_EVENT:
            const updatedStateEvents = [...state.eventsWorld]
            const indexUpdated = updatedStateEvents.indexOf(action.payload.text);
            updatedStateEvents[indexUpdated] = 'Событие 8*'
            const updatedState = {
                ...action.state,
                eventsWorld: updatedStateEvents
            }
            return updatedState
        case ACTIONS.REMOVE_EVENT:
            const removedStateEvents = [...state.eventsWorld]
            const indexDeleted = removedStateEvents.indexOf(action.payload.text);
            removedStateEvents.splice(indexDeleted, 1)
            const removedState = {
                ...action.state,
                eventsWorld: removedStateEvents
            }
            return removedState
        case ACTIONS.SORT_EVENT:
            const sorderStateEvents = [...state.eventsWorld]
            sorderStateEvents.sort((a, b) => a.localeCompare(b))
            const sortedState = {
                ...action.state,
                eventsWorld: sorderStateEvents
            }
            return sortedState
        default:
            return {
                ...state
            }
    }
}

const combineReducers = (reducersMap) => {
    return (state, action) => {
        const nextState = {}
        Object.entries(reducersMap).forEach(([key, reducer]) => {
            nextState[key] = reducer(state ? state[key] : state, action)

        })
        return nextState
    }
}

const rootReducer = combineReducers({
    reducerEventsState: reducerEvetns
})

const logger = (store) => dispatch => action => {
    // логироваине действий пользователей
    console.log('TYPE_ACTION', action.type)
}

const applyMiddleware = (middleware) => {
    return (createStore) => {
        return (reducer) => {
            const store = createStore(reducer)
            return {
                dispatch: action => middleware(store)(store.dispatch)(action),
                getState: store.getState
            }
        }
    }
}

const createStoreMiddleware = applyMiddleware(logger)(createStore)
const storeMiddleware = createStoreMiddleware(rootReducer)

const store = createStore(reducerEvetns)
store.dispatch(actionCreatorAddEvetn({ text: 'Событие 2' }))
store.dispatch(actionCreatorAddEvetn({ text: 'Событие 3' }))
console.log('store после добавления', store.getState())
console.log('-----------------------------------------')
store.dispatch({ type: ACTIONS.UPDATE_EVENT, payload: { text: 'Событие 8' } })
console.log('store после обновления События 8', store.getState())
console.log('-----------------------------------------')
store.dispatch({ type: ACTIONS.REMOVE_EVENT, payload: { text: 'Событие 2' } })
console.log('store после удаления События 2', store.getState())
console.log('-----------------------------------------')
store.dispatch({ type: ACTIONS.SORT_EVENT, undefined })
console.log('store после сортировки', store.getState())

// storeMiddleware.dispatch(actionCreatorAddEvetn({text: 'Событие 88'}))
// console.log('storeMiddleware = ', storeMiddleware.getState())
// store.subscribe(() => console.log('Изменение события..'))
// console.log('store до', store.getState())
// store.dispatch({ type: ACTIONS.ADD_EVENT, payload: { text: 'Событие 2' } })
// store.dispatch({ type: ACTIONS.ADD_EVENT, payload: { text: 'Событие 3' } })
// store.dispatch({ type: ACTIONS.ADD_EVENT, payload: { text: 'Событие 4' } })
// store.dispatch(actionCreatorAddEvetn({ text: 'Событие 2' }))
// console.log('store после', store.getState())