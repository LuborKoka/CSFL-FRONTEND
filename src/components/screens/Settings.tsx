import React, { Context, useContext, useRef, useState } from "react";
import axios, { AxiosError, AxiosResponse } from 'axios'
import { URI, UserContext, UserTypes } from "../../App";


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
        </div>
    )
}