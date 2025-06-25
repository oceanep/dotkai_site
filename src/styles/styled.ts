import styled from 'styled-components';

interface CyberButtonProps {
    $mobile?: number;
  } 

export const SceneContainer = styled.div`
    height: 100vh; /* fallback */
    height: 100dvh;
    width: 100vw; /* fallback */
    width: 100dvw;
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
    margin: 0;
    padding: 0;
    overscroll-behavior: none;

    & > canvas {
        /* height: 100%;
        width: 100%; */
        display: block;
    }
    
`;

export const CyberButton = styled.div<CyberButtonProps>`
    cursor: nw-resize;
    background-color: #fff;
    font-family: Crude;
    font-size: 28px;
    letter-spacing: 0.1em;
    color: #000;
    border: 1px solid #000;
    border-radius: 6px;
    padding: 11px 50px 7px;
    text-decoration: none;
    display: inline-block;
    display: inline-block;
    transform: ${({ $mobile }) => ($mobile ? 'scale(3)' : 'scale(1)')};
    transition: 
        transform 0.2s ease-in-out, 
        background-color 0.1s ease-in,
        color 0.1s ease-in;

    &:hover {
        transform: ${({ $mobile }) => ($mobile ? 'scale(3.3)' : 'scale(1.1)')};
        background-color: #000;
        color: #fff;
    }
`;