import { PortableText, PortableTextBlock } from '@portabletext/react';

import { customMarks } from '~/components/portableText/CustomMarks';
import styles from './ProjectsDisplay.module.scss'

interface DescCardProps {
    text: PortableTextBlock | PortableTextBlock[]
    noImage?: boolean
}

const DescCard:React.FC<DescCardProps> = ({ text, noImage = false }) => {

    return (
        <div className={`${styles['description-wrapper']} ${noImage ? styles['no-image'] : ''}`}>
            <div className={styles['description-card']}>
                <div className={styles['crt-text']}>
                    <PortableText value={text} components={customMarks} />
                </div>
            </div>
        </div>
    )
}

export default DescCard;