import { faArrowUpRightFromSquare, faFaceSmileWink, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import DiscordDark from '../../../../images/discord_dark_mode.svg'
import DiscordLight from '../../../../images/discord_light_mode.svg'
import useUserContext from "../../../../hooks/useUserContext";
import axios from "axios";
import { URI, insertTokenIntoHeader } from "../../../../App";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DARK, LIGHT } from "../../../../constants";
import '../../../../styles/discord.css'
import useConfirmation from "../../../../hooks/useConfirmation";
import useErrorMessage from "../../../../hooks/useErrorMessage";
import { useState } from "react";
import SectionHeading from "../../../reusableCompontents/SectionHeading";
import useThemeContext from "../../../../hooks/useThemeContext";
import ClickableButton from "../../../reusableCompontents/ClickableButton";

export default function DiscordAccount() {
    const [isPending, setIsPending] = useState(false)
    const user = useUserContext()[0]

    const query = useQuery([`user-discord-${user?.id}`], () => fetchUserDiscord(user?.id), {staleTime: Infinity})
    const queryClient = useQueryClient()

    const [confirmation, showConfirmation] = useConfirmation()
    const [message, showMessage] = useErrorMessage()
    const [isDarkTheme] = useThemeContext()

    const textColor = isDarkTheme ? LIGHT : DARK

    function deleteDiscordAccount() {
        setIsPending(true)
        axios.delete(`${URI}/user-discord/${user?.id}/`, {
            headers: {
                Authorization: `Bearer ${insertTokenIntoHeader(user?.token)}`
            }
        })
        .then(() => showConfirmation(() => queryClient.invalidateQueries([`user-discord-${user?.id}`])) )
        .catch((e: unknown) => {
            showMessage(e)
        })
        .finally(() => setIsPending(false))
    }

    const connect = 
    <>
        <SectionHeading sectionHeading>
            Prepojiť účet s Discordom
        </SectionHeading>

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
            <Link style={{color: textColor, textDecoration: 'none', paddingLeft: '5px', borderBottom: `1px solid ${textColor}`}} to='https://discord.gg/rDd2YB5bbg' target="_blank">
                na našom serveri <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </Link>
        </p>

        <br/><br/>

        <Link className={`clickable-button ${isDarkTheme ? 'light' : 'dark'}-text`} to={'https://discord.com/api/oauth2/authorize?client_id=1140670852166328411&redirect_uri=https%3A%2F%2Fcsfl.cz%2Fverify-user&response_type=code&scope=identify%20guilds%20guilds.members.read'}>
            Prepojiť účet a Discord <img src={isDarkTheme ? DiscordDark : DiscordLight} height='16px' alt="discord icon" style={{transform: 'translate(3px, 2px)'}} />
        </Link>

        <br/><br/>
    </>

    if ( query.data?.code === 204 ) return connect

    return(
        <>
            <SectionHeading sectionHeading>
                Môj Discord Účet
            </SectionHeading>

            <div className='discord-account-info'>            
                <img width='256px' style={{borderRadius: '10px'}} src={ query.data?.data.avatar ? `https://cdn.discordapp.com/avatars/${query.data.data.discord_id}/${query.data.data.avatar}?size=256` : isDarkTheme ? DiscordDark : DiscordLight} alt='discord avatar' />
                
                <div className={`account ${isDarkTheme ? 'dark' : 'light'}`}>
                    <p><FontAwesomeIcon style={{paddingRight: '5px'}} icon={faUser} /> {query.data?.data.discord_username}</p>
                    <p><FontAwesomeIcon style={{paddingRight: '5px'}} icon={faUser} /> {query.data?.data.discord_global_name}</p>
                    <p>Prémium: {premiumType(query.data?.data.premium_type)}</p>
                
                </div>
            </div>

            <br/><br/>

            <ClickableButton disabled={isPending} onClick={deleteDiscordAccount} >
                Vymazať Discord účet
            </ClickableButton>

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

