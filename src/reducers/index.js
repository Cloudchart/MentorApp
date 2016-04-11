import { combineReducers } from "redux";
import application from "./application";
import user from "./user";
import collections from "./collections";
import insights from "./insights";
import topics from "./topics";
import settings from "./settings";
import questions from "./questions";

let reducers = combineReducers({
  questions,
  application,
  settings,
  collections,
  insights,
  topics,
  user
});


export default reducers;


