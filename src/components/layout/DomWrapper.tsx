import { useRef, useState } from "react";
import ThreeLoader from "../loaders/ThreeLoader";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface DomProps {
  children: React.ReactNode;
  studio?: boolean;
  initialLoad?: boolean;
  routeChange?: boolean;
}

const Dom = ({ children, studio = false, initialLoad = false, routeChange = false }: DomProps) => {
  const ref = useRef(null);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  useEffect(() => {
    // console.log("Initial Load:", initialLoad);
    // console.log("Route Change:", routeChange);
    // console.log("Loading Complete:", isLoadingComplete)
  }, [initialLoad, routeChange, isLoadingComplete]);

  // const router = useRouter();

  // useEffect(() => {
  //   const handleRouteChange = () => {
  //     setIsLoadingComplete(false);
  //   };

  //   router.events.on("routeChangeStart", handleRouteChange);

  //   return () => {
  //     router.events.off("routeChangeStart", handleRouteChange);
  //   };
  // }, [router]);

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
          {(initialLoad) && (
            <ThreeLoader
              setLoadingComplete={(s) => setIsLoadingComplete(s)}
              loadingComplete={isLoadingComplete}
            />
          )}
          {(!initialLoad) && (
            <ThreeLoader
              setLoadingComplete={(s) => setIsLoadingComplete(s)}
              loadingComplete={isLoadingComplete}
              noBg={!initialLoad}
              noPrep={!initialLoad}
              invert={!initialLoad}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Dom;