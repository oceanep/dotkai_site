import React from 'react';
import classes from './Loader.module.scss';

const moveBoxesLeft = `
    @keyframes moveBoxesLeft {
        0% {
            transform: translateX(0);
        }
        25% {
            transform: translateX(-100px);
        }
        50% {
            transform: translateX(0);
        }
        75% {
            transform: translateX(-100px);
        }
        100% {
            transform: translateX(0);
        }
    }
`;

const moveBoxesRight = `
    @keyframes moveBoxesRight {
        0% {
            transform: translateX(0);
        }
        25% {
            transform: translateX(100px);
        }
        50% {
            transform: translateX(0);
        }
        75% {
            transform: translateX(100px);
        }
        100% {
            transform: translateX(0);
        }
    }
`;

const styles = {
    loaderContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1em',
    },
    box: {
        width: '0.5em',
        height: '2em',
        backgroundColor: 'black',
        animationDuration: '3s',
        animationTimingFunction: 'cubic-bezier(0.8, 0, 0.2, 1)',
        animationIterationCount: 'infinite',
        position: 'relative' as 'relative',
    },
    boxLeft: {
        animationName: 'moveBoxesLeft',
    },
    boxRight: {
        animationName: 'moveBoxesRight',
    },
};

const BracketLoader: React.FC = () => {
    return (
        <>
            <style>{moveBoxesLeft}</style>
            <style>{moveBoxesRight}</style>
            <div style={styles.loaderContainer}>
                <div style={{ ...styles.box, ...styles.boxLeft }} className={classes['boxLeft']}></div>
                <div style={{ ...styles.box, ...styles.boxRight }} className={classes['boxRight']}></div>
            </div>
        </>
    );
};

export default BracketLoader;