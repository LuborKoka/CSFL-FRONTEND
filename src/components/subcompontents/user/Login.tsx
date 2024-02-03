import React, { useState } from 'react'
import axios, { AxiosResponse } from 'axios'
import { URI } from '../../../App'
import jwtDecode from 'jwt-decode'
import { storageKeyName } from '../../../constants'
import { useLocation, useNavigate } from 'react-router-dom'
import useErrorMessage from '../../../hooks/useErrorMessage'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import secureLocalStorage from 'react-secure-storage'
import useUserContext from '../../../hooks/useUserContext'
import ClickableButton from '../../reusableCompontents/ClickableButton'
import LabeledInput from '../../reusableCompontents/LabeledInput'

const schema = z.object({
    username: z.string().min(4, {
        message: 'Meno musí mať aspoň 4 znaky'
    }).max(50, {
        message: 'Meno musí mať najviac 50 znakov.'
    }),
    password: z.string().min(8, {
        message: 'Heslo musí mať aspoň 8 znakov.'
    })
})

type Props = {
    swap: () => void
}

type LoginCredentials = z.infer<typeof schema>

export default function Login({ swap }: Props) {
    const [isPending, setIsPending] = useState(false)

    const setUser = useUserContext()[1]

    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const redirectUrl = queryParams.get('redirect_url')

    const [message, showMessage] = useErrorMessage()

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(schema),
      });

    function handleLogin(data: LoginCredentials) {
        (document.activeElement as HTMLInputElement | null)?.blur()
        setIsPending(true)

        axios.post(`${URI}/login/`, {
            params: {
                username: data.username.toLowerCase().trim(),
                password: data.password
            }
        })
        .then((r: AxiosResponse) => {
            const data = jwtDecode(r.data.token) as {username: string, id: string, driverID: string, driverName: string}
            secureLocalStorage.setItem(storageKeyName, r.data.token)
            setUser({isLoggedIn: true, ...data, token: r.data.token, roles: r.data.roles})
            if ( redirectUrl ) navigate(redirectUrl)
            else navigate('/not-found')
        })
        .catch((e: unknown) => {
            showMessage(e)
        })
        .finally(() => setIsPending(false))
    }

    return(
        <>  
            <form name="Login Form" onSubmit={handleSubmit((d) => handleLogin(d as LoginCredentials))}>
                <LabeledInput label='Prihlasovacie meno' htmlFor='username' {...register('username')} required autoFocus type='text' error={errors.username?.message} />
                <LabeledInput label='Heslo' htmlFor='password' {...register('password')} required withToggleVisible error={errors.password?.message} />
                
                <ClickableButton disabled={isPending} type='submit'>Prihlásiť sa</ClickableButton>
            </form>
            <p className='form-swap'>Nemáš ešte účet? <span onClick={swap}>Zaregistruj sa</span></p>

            {
                message
            }
        </>
    )
}