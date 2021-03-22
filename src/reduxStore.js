// store.js
import { applyMiddleware, createStore, compose } from "redux";
import promise from "redux-promise-middleware";
import thunk from "redux-thunk";
import reducer from "./reducers";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middleware = composeEnhancers(applyMiddleware(promise(), thunk));
const createdStore = createStore(reducer, middleware);

export default createdStore;

