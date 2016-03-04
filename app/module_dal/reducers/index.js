import { combineReducers } from "redux";
import application from "./application";
import user from "./user";
import collections from "./collections";
import advices from "./advices";
import topics from "./topics";
import settings from "./settings";
import questions from "./questions";

let reducers = combineReducers({
  questions,
  application,
  settings,
  collections,
  advices,
  topics,
  user
});


export default reducers;


