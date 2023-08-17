import { useLocation, useNavigate } from "react-router-dom"
import useUserContext from "../../../../hooks/useUserContext"
import '../../../../styles/loader.css'
import axios, { AxiosError } from "axios"
import { URI } from "../../../../App"
import useConfirmation from "../../../../hooks/useConfirmation"
import useErrorMessage from "../../../../hooks/useErrorMessage"
import { useEffect } from "react"
import { useMutation } from "@tanstack/react-query"


export default function DiscordVerification() {
    const user = useUserContext()[0]

    const navigate = useNavigate()
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)

    const [confirmation, showConfirmation] = useConfirmation()
    const [message, showMessage] = useErrorMessage()

    const code = searchParams.get('code')
  
    if ( !code ) navigate('/not-found')

    const mutation = useMutation(
        async () => {
            const res = await axios.post(`${URI}/user-discord/${user?.id}/`, {
                params: {
                    code: code,
                    userID: user?.id
                }
            })
            return res.data
        },
        {
            onSuccess: () => {
                showConfirmation(() => navigate('/settings'))
            },
            onError: (error: unknown) => {
                showMessage(error)
            },
        }
    );

    useEffect(() => {
        if (code && user?.id) {
            mutation.mutateAsync()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code, user?.id]);

    return(
        <div className='center'>
            <span className='loader'></span>

            {
                confirmation
            }

            {
                message
            }
        </div>
    )
}