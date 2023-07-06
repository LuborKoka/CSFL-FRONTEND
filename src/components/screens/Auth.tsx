import { useRef, useState } from "react"



export default function Auth() {
    const [isLogin, setIsLogin] = useState(true)
    const [isPending, setIsPending] = useState(false)


    const loginName = useRef<HTMLInputElement | null>(null)
    const loginPassword = useRef<HTMLInputElement | null>(null)
    const signupName = useRef<HTMLInputElement | null>(null)
    const signupPassword = useRef<HTMLInputElement | null>(null)
    const signupPasswordConfirm = useRef<HTMLInputElement | null>(null)

    const signin = 
        <div>
            <form>
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