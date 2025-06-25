import React from 'react';
import classes from './Loader.module.scss';

const timingFunction = `cubic-bezier(0.85, 0, 0.15, 1)`

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
            transform: scaleX(0.98) translateX(0);
        }
        25% {
            width: 20.5em; /* 12.5 em is 200px converted to em (assuming 16px base font size), add 1 em to compensate for 0% state */
            transform: translateX(-9.75em); /* 100px converted to em, add .5em for padding */
        }
        48% {
            width: 1em; /* add 2% buffers to make up for css engines shit rendering performance with the brackets */
            transform: translateX(0);
        }
        50% {
            width: 1em;
            transform: translateX(0);
        }
        75% {
            width: 20.5em; /* 12.5 em is 200px converted to em, add 1 em to compensate for 0% state */
            transform: translateX(-9.75em); /* 100px converted to em, add .5em for padding */
        }
        98% { 
            width: 1em; /* add 2% buffers to make up for css engines shit rendering performance with the brackets */
            transform: translateX(0);
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
        animationDuration: '5s',
        animationTimingFunction: timingFunction,
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
        animationName: 'expandWidth',
        animationDuration: '5s',
        // animationDelay: '0.1s',
        animationTimingFunction: timingFunction,
        animationIterationCount: 'infinite',
    },
    iosOverlay : {
        width: '20.5em',
        transform: 'translateX(-9.75em)',
    }
};

interface iBracketLoader {
    children?: React.ReactNode,
    invert?: boolean,
    isIOS?: boolean
}

const BracketLoader: React.FC<iBracketLoader> = ({
    children,
    invert = false,
    isIOS = false
}) => {
    
    return (
        <>
            <style>{moveBoxesLeft}</style>
            <style>{moveBoxesRight}</style>
            <style>{expandWidth}</style>
            <div style={styles.loaderContainer}>
                <div 
                    style={{ ...styles.box, ...styles.boxLeft }} 
                    className={`${classes['boxLeft']} ${invert ? classes['invert'] : ''}`}
                ></div>
                <div 
                    style={{ ...styles.box, ...styles.boxRight }} 
                    className={`${classes['boxRight']} ${invert ? classes['invert'] : ''}`}
                ></div>
                {children && (
                    <div 
                        style={isIOS ? styles.iosOverlay : styles.overlay} 
                        className={`${classes['overlay']} ${isIOS ? classes['ios'] : ''} ${invert ? classes['invert'] : ''}`}
                    >
                        {children}
                    </div>
                )}
            </div>
        </>
    );
};

export default BracketLoader;