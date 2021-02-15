import React from "react";
import { Action, State } from "../App";

// @ts-ignore
const StateContext = React.createContext<{state: Readonly<State>, dispatch: React.Dispatch<Action>}>(null);

export default StateContext;