import { faArrowUpRightFromSquare, faFaceSmileWink, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import Discord from '../../../../images/discord.svg'
import useUserContext from "../../../../hooks/useUserContext";
import axios from "axios";
import { URI } from "../../../../App";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { WHITE } from "../../../../constants";
import '../../../../styles/discord.css'
import useConfirmation from "../../../../hooks/useConfirmation";
import useErrorMessage from "../../../../hooks/useErrorMessage";
import { useState } from "react";

export default function DiscordAccount() {
    const [isPending, setIsPending] = useState(false)
    const user = useUserContext()[0]

    const query = useQuery([`user-discord-${user?.id}`], () => fetchUserDiscord(user?.id))
    const queryClient = useQueryClient()

    const [confirmation, showConfirmation] = useConfirmation()
    const [message, showMessage] = useErrorMessage()



    function deleteDiscordAccount() {
        setIsPending(true)
        axios.delete(`${URI}/user-discord/${user?.id}/`)
        .then(r => showConfirmation(() => queryClient.invalidateQueries([`user-discord-${user?.id}`])) )
        .catch((e: unknown) => {
            showMessage(e)
        })
        .finally(() => setIsPending(false))
    }

    const connect = 
    <>
        <h2 className="section-heading fade-in-out-border">
            Prepojiť účet s Discordom
        </h2>

        <b>Prečo by si to vôbec mal chcieť?</b>
        <br/>
        <p>Zrejme tu nebudeš sedieť 24/7 a čakať na nové informácie, že? Keď si prepojíš účet na tejto stránke s Discordom, budeme môcť:</p>
        <br/>
        <ul>
            <li>
                Tagovať Ťa, keď na Teba niekto pošle report
            </li>
            <li>
                Tagovať Ťa, keď FIA zverejní rozhodnutie Tvojho reportu/reportu na Teba
            </li>
            <li>
                Mnoho ďalšieho, čo sme ešte nevymysleli <FontAwesomeIcon icon={faFaceSmileWink} />
            </li>
        </ul>

        <br/>

        <p>Nič z toho však nebude fungovať, ak nebudeš 
            <Link style={{color: WHITE, textDecoration: 'none', paddingLeft: '5px', borderBottom: `1px solid ${WHITE}`}} to='https://discord.gg/rxebdqkc' target="_blank">
                na našom serveri <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </Link>
        </p>

        <br/><br/>


        <Link className='clickable-button' to={'https://discord.com/api/oauth2/authorize?client_id=1140670852166328411&redirect_uri=http%3A%2F%2F192.168.100.22%3A3000%2Fverify-user&response_type=code&scope=identify%20guilds%20guilds.members.read'}>
            Prepojiť účet a Discord <img src={Discord} height='16px' alt="discord icon" style={{transform: 'translate(3px, 2px)'}} />
        </Link>

        <br/><br/>
    </>

    if ( query.data?.code === 204 ) return connect

    return(
        <>
            <h2 className='section-heading fade-in-out-border'>Môj Discord Účet</h2>

            <div className='discord-account-info'>            
                <img width='256px' style={{borderRadius: '10px'}} src={ query.data?.data.avatar ? `https://cdn.discordapp.com/avatars/${query.data.data.discord_id}/${query.data.data.avatar}?size=256` : Discord} alt='discord avatar' />
                
                <div className='account'>
                    <p><FontAwesomeIcon style={{paddingRight: '5px'}} icon={faUser} /> {query.data?.data.discord_username}</p>
                    <p><FontAwesomeIcon style={{paddingRight: '5px'}} icon={faUser} /> {query.data?.data.discord_global_name}</p>
                    <p>Prémium: {premiumType(query.data?.data.premium_type)}</p>
                
                </div>
            </div>

            <br/><br/>

            <button className={`clickable-button ${isPending && 'button-disabled'}`} disabled={isPending} onClick={deleteDiscordAccount}>
                Vymazať Discord účet
            </button>

            <br/><br/><br/>

            {
                confirmation 
            }

            { 
                message
            }
        </>
    )

}



async function fetchUserDiscord(id: string | undefined) {
    type Data = {
        discord_id: string,
        discord_username: string,
        discord_global_name: string,
        avatar: string | null,
        premium_type: number
    }
    const res = await axios.get<Data>(`${URI}/user-discord/${id}/`)
    return {
        code: res.status,
        data: res.data
    }
}


function premiumType(p: number | undefined) {
    switch(p) {
        case 1: 
            return 'Nitro Classic'
        case 2:
            return 'Nitro'
        case 3:
            return 'Nitro Basic'
        default:
            return 'Žiadne'
    }
}

