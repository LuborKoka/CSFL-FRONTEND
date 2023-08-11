import React, { useState, useContext, Context } from 'react'
import axios, { AxiosResponse, AxiosError} from 'axios'
import { URI, UserContext, UserTypes } from '../../../App'
import jwtDecode from 'jwt-decode'
import { storageKeyName } from '../../../constants'
import { useNavigate } from 'react-router-dom'
import useErrorMessage from '../../../hooks/useErrorMessage'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import secureLocalStorage from 'react-secure-storage'

const schema = z.object({
    username: z.string().min(5, {
        message: 'Meno musí mať aspoň 5 znakov'
    }).max(50, {
        message: 'Meno musí mať najviac 50 znakov.'
    }),
    password: z.string().min(7, {
        message: 'Heslo musí mať aspoň 8 znakov.'
    })
})

type Props = {
    swap: () => void
}

type LoginCredentials = z.infer<typeof schema>

export default function Login({ swap }: Props) {
    const [isPending, setIsPending] = useState(false)

    const user = useContext(UserContext as Context<UserTypes>)

    const navigate = useNavigate()

    const [message, showMessage] = useErrorMessage()

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(schema),
      });

    function handleLogin(data: LoginCredentials) {
        console.log('wtf')
        setIsPending(true)

        axios.post(`${URI}/login/`, {
            params: {
                username: data.username,
                password: data.password
            }
        })
        .then((r: AxiosResponse) => {
            const data = jwtDecode(r.data.token) as {username: string, id: string}
            secureLocalStorage.setItem(storageKeyName, r.data.token)
            //localStorage.setItem(storageKeyName, JSON.stringify(r.data.token))
            user.setUser({...data, token: r.data.token, roles: r.data.roles})
            navigate('/welcome')
        })
        .catch((e: unknown) => {
            console.log(e)
            if ( e instanceof AxiosError && e.response?.data.error !== undefined ) {
                showMessage(e.response.data.error)
                return
            }
        })
        .finally(() => setIsPending(false))
    }

    return(
        <>  
            <form name="Login Form" onSubmit={handleSubmit((d) => handleLogin(d as LoginCredentials))}>
                <div className='labeled-input'>
                    <input className='form-input' required type="text" autoFocus {...register('username')} />
                    <label htmlFor='username'>Prihlasovacie meno</label>
                    {errors.username?.message && <p className='input-error'>{errors.username?.message as string}</p>}
                </div>
                
                <div className='labeled-input'>
                    <input {...register('password')} className='form-input' required type="password" />
                    <label htmlFor='password'>Heslo</label>
                    
                    {errors.password?.message && <p className='input-error'>{errors.password?.message as string}</p>}
                </div>
                
                <button className={`clickable-button ${isPending ? 'button-disabled' : ''}`} disabled={isPending} type="submit">Prihlásiť sa</button>
            </form>
            <p className='form-swap'>Nemáš ešte účet? <span onClick={swap}>Zaregistruj sa</span></p>

            {
                message
            }
        </>
    )
}