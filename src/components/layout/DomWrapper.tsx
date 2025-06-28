import { useRef } from "react";
import ThreeLoader from "../loaders/ThreeLoader";

interface DomProps {
  children: React.ReactNode;
  studio?: boolean;
  initialLoad?: boolean;
  routeChange?: boolean;
}

const Dom = ({ children, studio = false, initialLoad = false }: DomProps) => {
  const ref = useRef(null);

  return (
    <>
      {!studio && (
        <div
          className="dom"
          style={{
            position: "absolute",
            width: "100vw",
            top: 0,
            left: 0,
            zIndex: 10,
            overflow: "hidden",
            pointerEvents: "none",
          }}
          ref={ref}
        >
          {children}
          <ThreeLoader
            noPrep={!initialLoad}
            invert={!initialLoad}
          />
        </div>
      )}
      {studio && children}
    </>
  );
};

export default Dom;