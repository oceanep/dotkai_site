import LanguageSwitcher from "./LanguageSwitcher"

import classes from '@/styles/overlay.module.scss'

const DomOverlay = () => {
    return (
        <div className={`${classes['layout-container']}`}>
            <LanguageSwitcher/>
            <div className={`${classes['plus-container']}`}>
                <span>+</span>
                <span>+</span>
            </div>
            <div className={`${classes['version-container']}`}>
                <span className={`${classes['accent']}`}> &mdash; &nbsp; </span>
                <span>&copy;Kai.World 2025</span>
                <span className={`${classes['accent']}`}>&nbsp; | &nbsp;</span>
                <span> Version: 1.0.5</span>
                <span className={`${classes['accent']}`}> &nbsp; &mdash; </span>
            </div>
        </div>
    )
}
export default DomOverlay