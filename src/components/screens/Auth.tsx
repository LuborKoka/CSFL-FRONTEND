import axios, { AxiosError } from "axios"
import { useRef, useState } from "react"
import { URI } from "../../App"
import { useNavigate } from 'react-router-dom'



export default function Auth() {
    const [isLogin, setIsLogin] = useState(true)
    const [isPending, setIsPending] = useState(false)


    const loginName = useRef<HTMLInputElement | null>(null)
    const loginPassword = useRef<HTMLInputElement | null>(null)
    const signupName = useRef<HTMLInputElement | null>(null)
    const signupPassword = useRef<HTMLInputElement | null>(null)
    const signupPasswordConfirm = useRef<HTMLInputElement | null>(null)
    
    const navigate = useNavigate()


    function handleLogin(e: React.FormEvent) {
        e.preventDefault()

        setIsPending(true)

        axios.post(`${URI}/login/`, {
            params: {
                username: loginName.current!.value,
                password: loginPassword.current!.value
            }
        })
        .then(r => navigate('/reports'))
        .catch((e: AxiosError) => console.log(e))
        .finally(() => setIsPending(false))
    }

    function handleSignUp(e: React.FormEvent) {
        e.preventDefault()

        setIsPending(true)

        axios.post(`${URI}/signup/`, {
            params: {
                username: signupName.current!.value,
                password: signupPassword.current!.value,
                passwordConfirm: signupPasswordConfirm.current!.value
            }
        })
        .then(r => navigate('/reports'))
        .catch((e: AxiosError) => console.log(e))
        .finally(() => setIsPending(false))
    }

    const signin = 
        <div>
            <form onSubmit={handleLogin}>
                <input ref={loginName} placeholder="Prihlasovacie meno" type="text" />
                <input ref={loginPassword} placeholder="Heslo" type="password" />
                <button disabled={isPending} type="submit">Prihlásiť sa</button>
            </form>
            <p>Nemáš ešte účet? <span onClick={() => setIsLogin(!isLogin)}>Zaregistruj sa</span></p>
        </div>

    const signup = 
        <div>
            <form>
                <input ref={signupName} type="text" placeholder="Prihlasovacie meno" />
                <input ref={signupPassword} type="password" placeholder="Heslo" />
                <input ref={signupPasswordConfirm} type="password" placeholder="Zopakuj heslo" />
                <button type="submit" disabled={isPending}>Registrovať sa</button>
            </form>
            <p>Už máš účet? <span onClick={() => setIsLogin(!isLogin)}>Prihlás sa</span></p>
        </div>

    return(
        isLogin ? signin : signup
    )
}