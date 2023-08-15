import { useState } from "react"
import '../../styles/auth.css'
import Login from "../subcompontents/user/Login"
import Signup from "../subcompontents/user/Signup"

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true)        

    return(
        <div className='auth-form'>
            <h1>Vitaj V CSFL</h1>
            {
                isLogin ? <Login swap={() => setIsLogin(false)}/> : <Signup swap={() => setIsLogin(true)} />
            }
        </div>
    )
}