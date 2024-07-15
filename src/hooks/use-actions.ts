import { useDispatch } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { actionCreator } from "../state/state";

export const useActions = () => {
  const dispatch = useDispatch();

  return bindActionCreators(actionCreator, dispatch);
};
