import axios from "axios";
import { URI } from "../../../App";
import jwtDecode from "jwt-decode";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import useErrorMessage from "../../../hooks/useErrorMessage";
import { storageKeyName } from "../../../constants";
import secureLocalStorage from "react-secure-storage";
import useUserContext from "../../../hooks/useUserContext";
import ClickableButton from "../../reusableCompontents/ClickableButton";
import LabeledInput from "../../reusableCompontents/LabeledInput";
import { useState } from "react";

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

    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const redirectUrl = queryParams.get('redirect_url')

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
        (document.activeElement as HTMLInputElement | null)?.blur()
        setIsPending(true)

        axios.post(`${URI}/signup/`, {
            params: {
                username: data.username.toLowerCase().trim(),
                password: data.password,
                passwordConfirm: data.confirmPassword,
                raceName: data.raceName
            }
        })
        .then(r => {
            const data = jwtDecode(r.data.token) as {username: string, id: string, driverName: string, driverID: string}
            secureLocalStorage.setItem(storageKeyName, r.data.token)
            setUser({isLoggedIn: true, ...data, token: r.data.token, roles: []})
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
            <form name="Sign Up Form" onSubmit={handleSubmit((d) => handleSignUp(d as SignupCredentials))}>
                <LabeledInput label="Prihlasovacie meno" htmlFor="username" {...register('username')} required type="text" autoFocus error={errors.username?.message} />
                <LabeledInput label="Heslo" htmlFor="password" {...register('password')} type='password' withToggleVisible error={errors.password?.message} required/>
                <LabeledInput label="Zopakuj heslo" htmlFor="confirmPassword" type='password' {...register('confirmPassword')} error={errors.confirmPassword?.message} withToggleVisible required/>
                <LabeledInput label="Verejné meno" htmlFor="raceName" {...register('raceName')} required type="text" error={errors.raceName?.message} />
                
                <ClickableButton type='submit' disabled={isPending}>Registrovať sa</ClickableButton>
            </form>
            <p className='form-swap'>Už máš účet? <span onClick={swap}>Prihlás sa</span></p>


            { message }
        </>
    )
}