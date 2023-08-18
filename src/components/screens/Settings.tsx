import { DARKBLUE } from "../../constants";
import useUserContext from "../../hooks/useUserContext";
import PasswordChange from "../subcompontents/user/PasswordChange";
import DiscordAccount from "../subcompontents/user/discord/DiscordAccount";



export default function Settings() {
    const user = useUserContext()[0]

    return(
        <div className='section'>
            <div className='empty-header'></div>
            <br/><br/>
            <h2 className='section-heading fade-in-out-border'>Účet</h2>
            <ul>
                <li>Prihlasovacie meno: {user?.username}</li>
                <li>Verejné meno: {user?.driverName}</li>
            </ul>
            <br/><br/>
              
            <PasswordChange />     
            <DiscordAccount />    
        </div>
    )
}