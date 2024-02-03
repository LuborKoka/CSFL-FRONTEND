import { useState } from "react"
import '../../styles/auth.css'
import Login from "../subcompontents/user/Login"
import Signup from "../subcompontents/user/Signup"
import useThemeContext from "../../hooks/useThemeContext"
import { Link, useLocation } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true)      
    const [isDarkTheme] = useThemeContext() 
    
    const location = useLocation()
    const redirectUrl = new URLSearchParams(location.search).get('redirect_url')
    

    return(
        <div className='auth-form'>
            <div className="top-left form-swap">
                <Link className={`${isDarkTheme ? 'light' : 'dark'}-text link`} to={redirectUrl || '/'}>
                    <span>
                        <FontAwesomeIcon icon={faArrowLeft} style={{marginRight: '5px'}} /> Späť
                    </span>
                </Link>
            </div>

            <h2 className='section-heading fade-in-out-border'>
                { isLogin ? 'Prihlásenie' : 'Registrácia'}
            </h2>
            {
                isLogin ? <Login swap={() => setIsLogin(false)}/> : <Signup swap={() => setIsLogin(true)} />
            }
        </div>
    )
}