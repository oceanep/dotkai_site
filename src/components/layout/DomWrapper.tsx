import { useRef } from "react";
// import HtmlLoader from "../HtmlLoader";
import ThreeLoader from "../ThreeLoader";

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
      {/* <HtmlLoader/> */}
    </div>
  );
};

export default Dom;