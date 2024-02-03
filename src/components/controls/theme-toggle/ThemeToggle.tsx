import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import useThemeContext from "../../../hooks/useThemeContext"
import './themeToggle.css'
import { faGear, faMoon, faSun } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import storage from 'react-secure-storage'



export default function ThemeToggle() {
    const [selectedOption, setSelectedOption] = useState(1)

    const animated = useRef<HTMLSpanElement>(null)

    const setIsDarkTheme = useThemeContext()[1]


    const storageKey = 'csfl.cz/theme_setting'

    function setMode(option: number) {
        return () => {
            storage.setItem(storageKey, option)
            setSelectedOption(option)
        }
    }


    useEffect(() => {
        if ( selectedOption === -1 ) {
            setIsDarkTheme(true)
            return
        }

        if ( selectedOption === 0 ) {
            setIsDarkTheme(false)
            return
        }

        const mq = window.matchMedia("(prefers-color-scheme: dark)")
            
        if (mq.matches) setIsDarkTheme(true)
        else setIsDarkTheme(false)
        
        function setTheme(e: MediaQueryListEvent) {
            setIsDarkTheme(e.matches)
        }
        mq.addEventListener('change', setTheme)

        return () => {
            mq.removeEventListener('change', setTheme)
        }
    }, [selectedOption, setIsDarkTheme])

    useLayoutEffect(() => {
        const span = animated.current
        if ( !span ) return

        span.style.transform = `translateX(${selectedOption + 1 }00%)`
    }, [selectedOption])

    useLayoutEffect(() => {
        const setting = storage.getItem(storageKey) as number | null
        if ( setting === null ) return

        setSelectedOption(setting)
    }, [])
 

    return(
        <div className="theme-toggle">
            <div className="theme-text">
                {getSelectedOptionText(selectedOption)}
            </div>
            <div style={{position: 'relative', display: 'flex'}}>
                <span ref={animated} className="theme-icons-animated"></span>
                

                <div className="theme-icon" onClick={setMode(-1)}>
                    <FontAwesomeIcon icon={faMoon} />
                </div>
                <div className="theme-icon" onClick={setMode(0)}>
                    <FontAwesomeIcon icon={faSun} />
                </div>
                <div className="theme-icon" onClick={setMode(1)}>
                    <FontAwesomeIcon icon={faGear} />
                </div>
            </div>

        </div>
    )
}



function getSelectedOptionText(option: number) {
    switch(option) {
        case -1:
            return 'Tmavý mód'
        case 1:
            return 'Preferencia systému'
        case 0:
            return 'Svetlý mód'
        default: 
            return 'Veselé Vianoce'
    }
}