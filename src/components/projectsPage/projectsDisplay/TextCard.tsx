import styles from './ProjectsDisplay.module.scss'

interface TextCardProps {
    text: string
    isTitle?: boolean
    flip?: boolean
}

const TextCard:React.FC<TextCardProps> = ({ text, isTitle = false, flip = false}) => {
    const classString = `${styles['title-card']} ${isTitle ? styles['title-wrapper'] : ''} ${flip ? styles['flip'] : ''}`
    return (
        <div className={classString}>
            <div className={styles['crt-text']}>
            { isTitle ? 
                <h1>{text}</h1>
                :
                <span>{text}</span>
            }
            </div>
        </div>
    )
}

export default TextCard;