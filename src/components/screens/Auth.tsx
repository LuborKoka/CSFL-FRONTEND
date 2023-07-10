import axios, { AxiosError, AxiosResponse } from "axios"
import { Context, useContext, useRef, useState } from "react"
import { SeasonType, URI, UserContext, UserTypes } from "../../App"
import { useNavigate } from 'react-router-dom'
import jwtDecode from "jwt-decode"
import { RouteProps, Route } from "react-router-dom"
import Season from "./Season"

type Props = {
    setSeasons: React.Dispatch<React.SetStateAction<SeasonType[]>>
}

export default function Auth({ setSeasons }: Props) {
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
            const seasons = r.data.seasons as SeasonType[]
            const data = jwtDecode(r.data.token) as {username: string, id: string}
            user.setUser(data)
            setSeasons(seasons)
            navigate('/reports')
        })
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
                passwordConfirm: signupPasswordConfirm.current!.value,
                raceName: raceName.current!.value
            }
        })
        .then(r => {
            const seasons = r.data.seasons as SeasonType[]
            const data = jwtDecode(r.data.token) as {username: string, id: string}
            user.setUser(data)
            setSeasons(seasons)
            navigate('/reports')
        })
        .catch((e: AxiosError) => console.log(e))
        .finally(() => setIsPending(false))
    }

    const signin = 
        <div>
            <form onSubmit={handleLogin}>
                <input required ref={loginName} placeholder="Prihlasovacie meno" type="text" />
                <input required ref={loginPassword} placeholder="Heslo" type="password" />
                <button disabled={isPending} type="submit">Prihlásiť sa</button>
            </form>
            <p>Nemáš ešte účet? <span onClick={() => setIsLogin(!isLogin)}>Zaregistruj sa</span></p>
        </div>

    const signup = 
        <div>
            <form onSubmit={handleSignUp}>
                <input required ref={signupName} type="text" placeholder="Prihlasovacie meno" />
                <input required ref={signupPassword} type="password" placeholder="Heslo" />
                <input required ref={signupPasswordConfirm} type="password" placeholder="Zopakuj heslo" />
                <input required ref={raceName} type="text" placeholder="Pod akým menom budeš pretekať?" />
                <button type="submit" disabled={isPending}>Registrovať sa</button>
            </form>
            <p>Už máš účet? <span onClick={() => setIsLogin(!isLogin)}>Prihlás sa</span></p>
        </div>

    return(
        isLogin ? signin : signup
    )
}