import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import promiseMiddleware from "redux-promise";
import reducers from "./module_dal/reducers/index";
import { writeState } from "./module_dal/middleware/storage";

const middlewares = applyMiddleware(
    thunkMiddleware,
    promiseMiddleware,
    writeState
);
let finalCreateStore;

finalCreateStore = createStore(
    reducers,
    compose(
        middlewares
    )
)

export default finalCreateStore;
