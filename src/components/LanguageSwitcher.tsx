import { useLanguage } from '@/utils/contexts/LanguageContext'
import classes from '@/styles/overlay.module.scss'

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage()

  return (
    <div className={`${classes['switch-container']}`}>
      <span className={`${classes['accent']}`}> &mdash; &nbsp; </span>
      <button
        onClick={() => setLanguage('en')} 
        disabled={language === 'en'}
      >
        EN
      </button>
      <span className={`${classes['accent']}`}>&nbsp; | &nbsp;</span>
      <button 
        onClick={() => setLanguage('jp')}
        disabled={language === 'jp'}
      >
        JP
      </button>
      <span className={`${classes['accent']}`}> &nbsp; &mdash; </span>
    </div>
  )
}

export default LanguageSwitcher