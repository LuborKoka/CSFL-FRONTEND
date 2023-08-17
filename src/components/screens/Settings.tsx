import PasswordChange from "../subcompontents/user/PasswordChange";
import DiscordAccount from "../subcompontents/user/discord/DiscordAccount";



export default function Settings() {
    
    

    return(
        <div className='section'>
            <DiscordAccount />   
            <PasswordChange />        
        </div>
    )
}