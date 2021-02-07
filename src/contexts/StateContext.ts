import React from "react";
import { Action, State } from "../App";

// @ts-ignore
const StateContext = React.createContext<{state: State, dispatch: React.Dispatch<Action>}>(null);

export default StateContext;