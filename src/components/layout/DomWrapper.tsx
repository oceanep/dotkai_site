import { useRef } from "react";
import ThreeLoader from "../loaders/ThreeLoader";

interface DomProps {
  children: React.ReactNode;
  studio?: boolean;
}
const Dom = ({ children, studio = false }: DomProps) => {
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
      {!studio && <ThreeLoader />}
    </div>
  );
};

export default Dom;