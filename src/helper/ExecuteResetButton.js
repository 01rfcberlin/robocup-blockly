import React, {useState} from "react";
import { Button } from 'reactstrap';

export default function ExecuteResetButton(props) {
  const [showing_execute_button, set_showing_execute_button] = useState(true);

  let text;
  if (showing_execute_button) {
    text = "Code Ausführen!";
  } else {
    text = "Reset!";
  }

  return (
    <React.Fragment>
      <Button onClick={() => {
        if (showing_execute_button) {
          set_showing_execute_button(false);
          props.execute();
        } else {
          set_showing_execute_button(true);
          props.reset();
        }
      }}>{text}</Button>
    </React.Fragment>
  );
}
