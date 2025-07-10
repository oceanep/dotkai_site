import styles from './ProjectsDisplay.module.scss'

interface TextCardProps {
    text: string
    isTitle?: boolean
    isSecondaryTitle?: boolean
    isSubtitle?: boolean
    flip?: boolean
    isJp?: boolean
}

const TextCard:React.FC<TextCardProps> = ({
    text, 
    isTitle = false, 
    isSecondaryTitle = false,
    isSubtitle = false, 
    flip = false,
    isJp = false
}) => {
    const classString = `${
        styles['title-card']} 
        ${isTitle ? styles['title-wrapper'] : ''} 
        ${isSecondaryTitle ? styles['secondaryTitle-wrapper'] : ''} 
        ${isSubtitle ? styles['subtitle-wrapper'] : ''} 
        ${flip ? styles['flip'] : ''}
        ${isJp ? styles['jp-title'] : ''}
    `.replace(/\s+/g, ' ').trim();
    
    return (
        <div className={classString}>
            <div className={styles['crt-text']}>
                { isTitle 
                    ? <h1>{text}</h1>
                    : isSecondaryTitle
                        ? <h2>{text}</h2>
                        : <span>{text}</span>
                }
            </div>
        </div>
    )
}

export default TextCard;