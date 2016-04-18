import { combineReducers } from "redux";
import application from "./application";
import user from "./user";
import reactions from "./reactions";
import collections from "./collections";

let reducers = combineReducers({
  application,
  collections,
  user,
  reactions
});


export default reducers;


