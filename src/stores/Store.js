import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
// import { AuthReducer } from "../reducers/AuthReducer";
// import { nominaReducer } from "../reducers/NominaReducer";

const reducers = combineReducers({
  //   auth: AuthReducer,
  //   nomina: nominaReducer,
});

const composeEnhancers =
  (typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

export const Store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(thunk))
);
