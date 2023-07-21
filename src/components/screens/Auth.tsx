import axios, { AxiosError, AxiosResponse } from "axios"
import { Context, useContext, useRef, useState } from "react"
import { URI, UserContext, UserTypes } from "../../App"
import { useNavigate } from 'react-router-dom'
import jwtDecode from "jwt-decode"
import '../../styles/auth.css'

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true)
    const [isPending, setIsPending] = useState(false)


    const loginName = useRef<HTMLInputElement | null>(null)
    const loginPassword = useRef<HTMLInputElement | null>(null)
    const signupName = useRef<HTMLInputElement | null>(null)
    const signupPassword = useRef<HTMLInputElement | null>(null)
    const signupPasswordConfirm = useRef<HTMLInputElement | null>(null)
    const raceName = useRef<HTMLInputElement | null>(null)

    const user = useContext(UserContext as Context<UserTypes>)
    
    const navigate = useNavigate()

    //https://youtu.be/Wu0WTCLVvAk


    function handleLogin(e: React.FormEvent) {
        e.preventDefault()

        setIsPending(true)

        axios.post(`${URI}/login/`, {
            params: {
                username: loginName.current!.value,
                password: loginPassword.current!.value
            }
        })
        .then((r: AxiosResponse) => {
            const data = jwtDecode(r.data.token) as {username: string, id: string}
            user.setUser(data)
            navigate('/welcome')
        })
        .catch((e: AxiosError) => console.log(e))
        .finally(() => setIsPending(false))
    }

    function handleSignUp(e: React.FormEvent) {

        //  !!bacha, aby novy raceName nepojebal uz existujuci link driver-user!!
        e.preventDefault()

        setIsPending(true)

        axios.post(`${URI}/signup/`, {
            params: {
                username: signupName.current!.value,
                password: signupPassword.current!.value,
                passwordConfirm: signupPasswordConfirm.current!.value,
                raceName: raceName.current!.value
            }
        })
        .then(r => {
            const data = jwtDecode(r.data.token) as {username: string, id: string}
            user.setUser(data)
            navigate('/welcome')
        })
        .catch((e: AxiosError) => console.log(e))
        .finally(() => setIsPending(false))
    }

    const signin = 
        <>  
            <form name="Login Form" onSubmit={handleLogin}>
                <div className='labeled-input'>
                    <input name='username' className='form-input' required ref={loginName} type="text" />
                    <label htmlFor='username'>Prihlasovacie meno</label>
                </div>
                
                <div className='labeled-input'>
                    <input name='password' className='form-input' required ref={loginPassword} type="password" />
                    <label htmlFor='password'>Heslo</label>
                </div>
                
                <button className={`clickable-button ${isPending ? 'button-disabled' : ''}`} disabled={isPending} type="submit">Prihlásiť sa</button>
            </form>
            <p className='form-swap'>Nemáš ešte účet? <span onClick={() => setIsLogin(!isLogin)}>Zaregistruj sa</span></p>
        </>

    const signup = 
        <>
            <form name="Sign Up Form" onSubmit={handleSignUp}>
                <div className='labeled-input'>
                    <input name='username' className='form-input' required ref={signupName} type="text" />
                    <label htmlFor='username'>Prihlasovacie meno</label>
                </div>
                <div className='labeled-input'>
                    <input name='password' className='form-input' required ref={signupPassword} type="password" />
                    <label htmlFor='password'>Heslo</label>
                </div>
                <div className='labeled-input'>
                    <input name='confirm-password' className='form-input' required ref={signupPasswordConfirm} type="password" />
                    <label htmlFor='confirm-password'>Zopakuj heslo</label>
                </div>
                <div className='labeled-input'>
                    <input name='race-name' className='form-input' required ref={raceName} type="text" />
                    <label htmlFor='race-name'>Pod akým menom budeš pretekať</label>
                </div>
                <button className={`clickable-button ${isPending ? 'button-disabled' : ''}`} type="submit" disabled={isPending}>Registrovať sa</button>
            </form>
            <p className='form-swap'>Už máš účet? <span onClick={() => setIsLogin(!isLogin)}>Prihlás sa</span></p>
        </>

    return(
        <div className='auth-form'>
            <h1>Vitaj V ČSFL</h1>
            {
                isLogin ? signin : signup
            }
        </div>
    )
}