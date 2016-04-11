import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import promiseMiddleware from "redux-promise";
import reducers from "./reducers/index";

const middlewares = applyMiddleware(
    thunkMiddleware,
    promiseMiddleware
);
let finalCreateStore;

finalCreateStore = createStore(
    reducers,
    compose(
        middlewares
    )
)

export default finalCreateStore;
