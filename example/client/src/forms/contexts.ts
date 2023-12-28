import React from "react";

// This context is used to allow form widgets to notify their forms that data has changed
export const FormWidgetChangeNotificationContext = React.createContext(
  () => {}
);

// This context is used to notify components within a form if the form is currently submitting
// This is used to display spinners in submit buttons
export const FormSubmissionStatus = React.createContext(false);
