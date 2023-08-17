import React, { useState, useContext, Context } from "react";
import axios, { AxiosError } from "axios";
import { URI, UserContext, UserTypes } from "../../../App";
import jwtDecode from "jwt-decode";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useErrorMessage from "../../../hooks/useErrorMessage";
import { storageKeyName } from "../../../constants";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import secureLocalStorage from "react-secure-storage";
import useUserContext from "../../../hooks/useUserContext";

const schema = z.object({
    username: z.string().min(4, {
        message: 'Meno musí obsahovať aspon 4 znaky.'
    }).max(50, {
        message: 'Meno musí mať najviac 50 znakov'
    }),
    password: z.string().min(8, {
        message: 'Heslo musí mať aspoň 8 znakov'
    }),
    confirmPassword: z.string(),
    raceName: z.string().min(8, {
        message: 'Verejné meno musí obsahovať aspoň 8 znakov.'
    }).max(50, {
        message: 'Verejné meno nesmie mať viac ako 50 znakov.'
    })
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Heslá sa musia zhodovať',
    path: ['confirmPassword']
})

type Props = {
    swap: () => void
}

type SignupCredentials = z.infer<typeof schema>

export default function Signup({ swap }: Props) {
    const [isPending, setIsPending] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [isVisibleConfirm, setIsVisibleConfirm] = useState(false)

    const navigate = useNavigate()

    const setUser = useUserContext()[1]

    const [message, showMessage] = useErrorMessage()

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(schema),
      });
    
    function handleSignUp(data: SignupCredentials) {
        //  !!bacha, aby novy raceName nepojebal uz existujuci link driver-user!!

        setIsPending(true)

        axios.post(`${URI}/signup/`, {
            params: {
                username: data.username,
                password: data.password,
                passwordConfirm: data.confirmPassword,
                raceName: data.raceName
            }
        })
        .then(r => {
            const data = jwtDecode(r.data.token) as {username: string, id: string}
            secureLocalStorage.setItem(storageKeyName, r.data.token)
            setUser({isLoggedIn: true, ...data, token: r.data.token, roles: r.data.roles})
            navigate('/welcome')
        })
        .catch((e: unknown) => {
            showMessage(e)
        })
        .finally(() => setIsPending(false))
    }

    return(
        <>
            <form name="Sign Up Form" onSubmit={handleSubmit((d) => handleSignUp(d as SignupCredentials))}>
                <div className='labeled-input'>
                    <input {...register('username')} className='form-input' required type="text" autoFocus />
                    <label htmlFor='username'>Prihlasovacie meno</label>
                    {errors.username?.message && <p className='input-error'>{errors.username?.message as string}</p>}
                </div>
                <div className='labeled-input'>
                    <input {...register('password')} className='form-input' required type={isVisible ? 'text' : 'password'} />
                    <label htmlFor='password'>Heslo</label>
                    <FontAwesomeIcon className='center-right' icon={isVisible ? faEye : faEyeSlash} onClick={() => setIsVisible(p => !p)} style={{position: 'absolute'}} />
                    {errors.password?.message && <p className='input-error'>{errors.password?.message as string}</p>}
                </div>
                <div className='labeled-input'>
                    <input {...register('confirmPassword')} className='form-input' required type={isVisibleConfirm ? 'text' : 'password'} />
                    <label htmlFor='confirmPassword'>Zopakuj heslo</label>
                    <FontAwesomeIcon className='center-right' icon={isVisibleConfirm ? faEye : faEyeSlash} onClick={() => setIsVisibleConfirm(p => !p)} style={{position: 'absolute'}} />
                    {errors.confirmPassword?.message && <p className='input-error'>{errors.confirmPassword?.message as string}</p>}
                </div>
                <div className='labeled-input'>
                    <input {...register('raceName')} className='form-input' required type="text" />
                    <label htmlFor='raceName'>Verejné meno</label>
                    {errors.raceName?.message && <p className='input-error'>{errors.raceName?.message as string}</p>}
                </div>
                <button className={`clickable-button ${isPending ? 'button-disabled' : ''}`} type="submit" disabled={isPending}>Registrovať sa</button>
            </form>
            <p className='form-swap'>Už máš účet? <span onClick={swap}>Prihlás sa</span></p>


            { message }
        </>
    )
}