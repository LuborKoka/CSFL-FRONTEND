import useUserContext from "../../hooks/useUserContext";
import SectionHeading from "../reusableCompontents/SectionHeading";
import NameChange from "../subcompontents/user/NameChange";
import PasswordChange from "../subcompontents/user/PasswordChange";
import DiscordAccount from "../subcompontents/user/discord/DiscordAccount";



export default function Settings() {
    const user = useUserContext()[0]

    return(
        <div className='section'>
            <div className='empty-header'></div>
            <br/><br/>
            <SectionHeading sectionHeading>Účet</SectionHeading>
            <ul>
                <li>Prihlasovacie meno: <b>{user?.username}</b></li>
                <li>Verejné meno: <b>{user?.driverName}</b></li>
            </ul>
            <br/><br/>
              
            <NameChange />
            <PasswordChange />     
            <DiscordAccount />    
        </div>
    )
}