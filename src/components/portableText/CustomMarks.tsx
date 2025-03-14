import {PortableTextComponents} from '@portabletext/react'

import styles from './CustomMarks.module.css'

export const customMarks: PortableTextComponents = {
  marks: {
    em: ({children}) => <em className={styles['italic']}>{children}</em>,
    strong: ({children}) => <strong className={styles['bold']}>{children}</strong>,
    link: ({value, children}) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined
      return (
        <a
            href={value?.href}
            target={target}
            rel={target === '_blank' && 'noindex nofollow'}
            className={styles['link']}
        >
          {children}
        </a>
      )
    },
  },
}