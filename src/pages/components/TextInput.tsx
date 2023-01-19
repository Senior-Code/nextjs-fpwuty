import { DetailedHTMLProps, InputHTMLAttributes, useState } from "react";
import styles from "../../../styles/Home.module.css";

interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {}

const TextInput = (props: Props) => {
  const [inputFocus, setInputFocus] = useState(false);
  return (
    <div
      className={styles.nameWrapper}
      style={{
        boxShadow: inputFocus ? "0px 0px 0px 2px #0070f3" : undefined,
        backgroundColor: inputFocus ? "white" : undefined,
      }}
      onClick={() => setInputFocus(true)}
    >
      <input
        {...props}
        autoFocus
        style={{
          backgroundColor: inputFocus ? "white" : undefined,
        }}
        onBlur={() => setInputFocus(false)}
      />
    </div>
  );
};
export default TextInput;
