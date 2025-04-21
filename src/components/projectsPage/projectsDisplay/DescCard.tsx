import { TypedObject } from 'sanity';
import { PortableText, PortableTextBlock } from '@portabletext/react';

import { customMarks } from '~/components/portableText/CustomMarks';
import styles from './ProjectsDisplay.module.scss'

interface DescCardProps {
    text: PortableTextBlock | PortableTextBlock[]
}

const DescCard:React.FC<DescCardProps> = ({text}) => {

    return (
        <div className={styles['description-wrapper']}>
            <div className={styles['description-card']}>
                <div className={styles['crt-text']}>
                    <PortableText value={text} components={customMarks} />
                </div>
            </div>
        </div>
    )
}

export default DescCard;