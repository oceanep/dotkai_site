import { PortableText, PortableTextBlock } from '@portabletext/react';

import { customMarks } from '~/components/portableText/CustomMarks';
import styles from './ProjectsDisplay.module.scss'
import { IListItem } from '~/utils/types';

interface ListCardProps {
    title: string
    list: IListItem[]
}

const ListCard:React.FC<ListCardProps> = ({ title, list }) => {

    return (
        <div className={styles['description-card']}>
            <div className={styles['crt-text']}>
                <h3 className={styles['list-title']}>{title}</h3>
                <ul className={styles['list']}>
                    {list.map((item, index) => (
                        <li key={index}>
                            {item?.url 
                                ?
                                    <strong>
                                        <a href={item.url} className={styles['list-link']}>
                                            {item.title}
                                        </a>
                                    </strong>
                                :
                                    <span>{item.title}</span>
                            }
                            
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default ListCard;