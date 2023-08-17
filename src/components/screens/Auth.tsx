import { useState } from "react"
import '../../styles/auth.css'
import Login from "../subcompontents/user/Login"
import Signup from "../subcompontents/user/Signup"

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true)        

    return(
        <div className='auth-form'>
            <h2 className='section-heading fade-in-out-border'>
                { isLogin ? 'Prihlásenie' : 'Registrácia'}
            </h2>
            {
                isLogin ? <Login swap={() => setIsLogin(false)}/> : <Signup swap={() => setIsLogin(true)} />
            }
        </div>
    )
}