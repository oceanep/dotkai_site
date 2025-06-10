import { useRef } from "react";
import ThreeLoader from "../loaders/ThreeLoader";

const Dom = ({ children }) => {
  const ref = useRef(null);

  return (
    <div
      className="dom"
      style={{
        position: "absolute",
        width: "100vw",
        top: 0,
        left: 0,
        zIndex: 10,
        overflow: "hidden",
      }}
      ref={ref}
    >
      {children}
      <ThreeLoader/>
    </div>
  );
};

export default Dom;