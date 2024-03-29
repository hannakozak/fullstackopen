import React from "react";
import Notification from "../components/Notification";
import { useDispatch, useSelector } from "react-redux";
import { logout, userSelector } from "../features/userSlice";
import {
  addNotification,
  removeNotification,
} from "../features/notificationSlice";
import { v4 as uuidv4 } from "uuid";
import { Navigation } from "./Navigation";

export const Header = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector(userSelector);

  const notify = (message, type = "info") => {
    const id = uuidv4();
    dispatch(addNotification({ message, type, id }));
    setTimeout(() => dispatch(removeNotification(id)), 3000);
  };

  const logoutHandler = () => {
    dispatch(logout());
    notify("good bye!");
  };

  return (
    <>
      <Notification />
      <Navigation />
      <div>
        {authUser.name} logged in
        <button onClick={logoutHandler}>logout</button>
      </div>
      <h2>blogs</h2>
    </>
  );
};
