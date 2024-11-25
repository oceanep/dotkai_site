import styled from 'styled-components';

export const SceneContainer = styled.div`
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;

    > canvas: {
    }
    
`;

export const Inner3dPill = styled.div`
    font-family: Helvetica, Arial;
    position: absolute;
    background: #00000088;
    color: white;
    padding: 15px;
    white-space: nowrap;
    overflow: hidden;
    border-radius: 30px;
    user-select: none;
`;

export const CyberButton = styled.div`
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
    transform: scale(1);
    transition: 
        transform 0.2s ease-in-out, 
        background-color 0.1s ease-in,
        color 0.1s ease-in;

    &:hover {
        transform: scale(1.1);
        background-color: #000;
        color: #fff;
    }
`;