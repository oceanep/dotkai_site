import React from 'react';
import classes from './Loader.module.scss';

const moveBoxesLeft = `
    @keyframes moveBoxesLeft {
        0% {
            transform: translateX(0);
        }
        25% {
            transform: translateX(-9.75em); /* 6.25 em 100px converted to em (assuming 16px base font size), add .5em for padding */
        }
        50% {
            transform: translateX(0);
        }
        75% {
            transform: translateX(-9.75em); /* 6.25 em 100px converted to em, add .5em for padding*/
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
            transform: translateX(9.75em); /* 6.25 em is 100px converted to em (assuming 16px base font size) , add .5em for padding*/
        }
        50% {
            transform: translateX(0);
        }
        75% {
            transform: translateX(9.75em); /* 6.25 em 100px converted to em, add .5em for padding */
        }
        100% {
            transform: translateX(0);
        }
    }
`;

const expandWidth = `
    @keyframes expandWidth {
        0% {
            width: 1em;
            transform: translateX(0);
        }
        25% {
            width: 20.5em; /* 12.5 em is 200px converted to em (assuming 16px base font size), add 1 em to compensate for 0% state */
            transform: translateX(-9.75em); /* 100px converted to em, add .5em for padding */
        }
        50% {
            width: 1em;
            transform: translateX(0);
        }
        75% {
            width: 20.5em; /* 12.5 em is 200px converted to em, add 1 em to compensate for 0% state */
            transform: translateX(-9.75em); /* 100px converted to em, add .5em for padding */
        }
        100% {
            width: 1em;
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
        position: 'relative' as 'relative',
    },
    box: {
        width: '0.5em',
        height: '3em',
        backgroundColor: 'black',
        animationDuration: '5s',
        animationTimingFunction: 'cubic-bezier(1, 0, 0, 1)',
        animationIterationCount: 'infinite',
        position: 'relative' as 'relative',
    },
    boxLeft: {
        animationName: 'moveBoxesLeft',
    },
    boxRight: {
        animationName: 'moveBoxesRight',
    },
    overlay: {
        position: 'absolute' as 'absolute',
        top: '1em', // absolute sizing starts from the edge of padding, so 1em is 0 for inner content
        left: '1em', // see above
        height: '3em',
        animationName: 'expandWidth',
        animationDuration: '5s',
        animationTimingFunction: 'cubic-bezier(1, 0, 0, 1)',
        animationIterationCount: 'infinite',
    },
};

const BracketLoader: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return (
        <>
            <style>{moveBoxesLeft}</style>
            <style>{moveBoxesRight}</style>
            <style>{expandWidth}</style>
            <div style={styles.loaderContainer}>
                <div style={{ ...styles.box, ...styles.boxLeft }} className={classes['boxLeft']}></div>
                <div style={{ ...styles.box, ...styles.boxRight }} className={classes['boxRight']}></div>
                {children && <div style={styles.overlay} className={classes['overlay']}>{children}</div>}
            </div>
        </>
    );
};

export default BracketLoader;