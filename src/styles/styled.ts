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