import React, { Context, useContext, useRef, useState } from "react";
import axios, { AxiosError, AxiosResponse } from 'axios'
import { URI, UserContext, UserTypes } from "../../App";
import { Link } from "react-router-dom";


export default function Settings() {
    const [isPending, setIsPending] = useState(false)

    const oldPassword = useRef<HTMLInputElement | null>(null)
    const newPassword = useRef<HTMLInputElement | null>(null)
    const newPasswordConfirm = useRef<HTMLInputElement | null>(null)

    const user = useContext(UserContext as Context<UserTypes>)

    function handlePasswordChange(e: React.FormEvent) {
        e.preventDefault()
        setIsPending(true)
        
        axios.patch(`${URI}/change-password/`, {
            params: {
                username: user.user?.username,
                oldPassword: oldPassword.current!.value,
                newPassword: newPassword.current!.value,
                newPasswordConfirm: newPasswordConfirm.current!.value
            }
        })
        .then((r: AxiosResponse) => {
            console.log(r)
        })
        .catch((e: AxiosError) => {
            console.log(e)
        })
        .finally(() => {
            setIsPending(false)
        })
    }
    

    return(
        <div className='section'>
            <form onSubmit={handlePasswordChange}>
                <input ref={oldPassword} placeholder="Staré heslo" type="password" />
                <input ref={newPassword} placeholder="Nové heslo" type="password" />
                <input ref={newPasswordConfirm} placeholder="Potvrď nové heslo" type="password" />
                <button disabled={isPending} type="submit">Zmeniť heslo</button>
            </form>


            <h2 className="section-heading fade-in-out-border">
                Prepojiť účet s Discordom
            </h2>

            <Link to={'https://discord.com/api/oauth2/authorize?client_id=1140670852166328411&redirect_uri=http%3A%2F%2F192.168.100.22%3A3000%2Fverify-user&response_type=code&scope=identify%20guilds.members.read'}>
                Prihlásiť
            </Link>
        </div>
    )
}


//  http://192.168.100.22:3000/seasons/e40897ad-64dd-44ac-8cbc-f62615663e15/race/554f52d4-4459-4047-82f1-997d0ba25ec8/reports
//  http://192.168.100.22:3000/seasons/e40897ad-64dd-44ac-8cbc-f62615663e15/races/554f52d4-4459-4047-82f1-997d0ba25ec8/reports