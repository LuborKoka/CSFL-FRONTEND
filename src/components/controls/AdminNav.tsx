import { Link, NavLink, Outlet, useLocation, useParams } from "react-router-dom";
import { randomURIkey } from "../../App";
import '../../styles/admin.css'
import { useState } from "react";
import useUserContext from "../../hooks/useUserContext";
import ClickableButton from "../reusableCompontents/ClickableButton";
import useThemeContext from "../../hooks/useThemeContext";

export type OutletSeason = {
    seasonName: string,
    raceName: string
}

export type AdminOutletContext = [OutletSeason, React.Dispatch<React.SetStateAction<OutletSeason>>]


export default function AdminNav() {
    const [header, setHeader] = useState<OutletSeason>({seasonName: '', raceName: ''})

    const { seasonID, raceID } = useParams()

    const user = useUserContext()[0]
    const [isDarkTheme] = useThemeContext()
    
    const location = useLocation()

    const usersAndRolesAllowedRoles = ['Sys Admin', 'F1 Super Admin']

    return(
        <div className={`content-container ${isDarkTheme ? 'dark' : 'light'}-bg`}>
            <div className='header-navigation'>
                <h3>F1 Admin</h3>
                <div className='breadcrumbs'>
                    { seasonID === undefined ? null : <Link className={`link ${isDarkTheme ? 'light' : 'dark'}-text`} to={`/${randomURIkey}/admin/season/${seasonID}`}>{header.seasonName}</Link>}
                    { raceID === undefined ? null : 
                        <>{'>'}<Link className={`link ${isDarkTheme ? 'light' : 'dark'}-text`} to={`/${randomURIkey}/admin/season/${seasonID}/race/${raceID}`}>{header.raceName}</Link></> }
                
                    { lastLink(location.pathname, isDarkTheme) }
                </div>
            </div>

            <div className='section-container'>
                <div className='section'>
                    <Outlet context={[header, setHeader]} />
                </div>
            </div>
            

            <nav className='section-navigation'>
                <ul>
                    {
                        seasonID === undefined ? null :
                        <>
                            <NavLink to={`/${randomURIkey}/admin/season/${seasonID}/drivers`}>
                                <ClickableButton>Tímové dvojice</ClickableButton>
                            </NavLink>
                            <NavLink to={`/${randomURIkey}/admin/season/${seasonID}/schedule`}>
                                <ClickableButton>Upraviť Kalendár</ClickableButton>
                            </NavLink>
                            <NavLink to={`/${randomURIkey}/admin/season/${seasonID}/reserves`}>
                                <ClickableButton>Náhradníci</ClickableButton>
                            </NavLink>
                            <NavLink to={`/${randomURIkey}/admin/season/${seasonID}/fia`}>
                                <ClickableButton>Nastavenie FIA</ClickableButton>
                            </NavLink>
                        </>
                    }

                    <NavLink to={`/${randomURIkey}/admin/seasons`}>
                        <ClickableButton>Sezóny</ClickableButton>
                    </NavLink>
                    {
                        usersAndRolesAllowedRoles.some(r => user?.roles.includes(r)) &&
                        <NavLink to={`/${randomURIkey}/admin/roles`}>
                            <ClickableButton>Používatelia a Role</ClickableButton>
                        </NavLink>
                    }
                    <NavLink to={`/${randomURIkey}/admin/rules`}>
                        <ClickableButton>Upraviť pravidlá</ClickableButton>
                    </NavLink>
                </ul>
            </nav>

        </div>
    )
}





function lastLink(pathname: string, isDarkTheme: boolean): JSX.Element | null {
    if ( pathname.includes('/drivers') ) return <>{'>'} <Link className={`link ${isDarkTheme ? 'light': 'dark'}-text`} to={pathname}>Tímové dvojice</Link></>

    if ( pathname.includes('/schedule')) return <>{'>'} <Link className={`link ${isDarkTheme ? 'light': 'dark'}-text`} to={pathname}>Upraviť Kalendár</Link> </>   
    
    if ( pathname.includes('/reserves')) return <>{'>'} <Link className={`link ${isDarkTheme ? 'light': 'dark'}-text`} to={pathname}>Náhradníci</Link> </>

    if ( pathname.includes('/fia')) return <>{'>'} <Link className={`link ${isDarkTheme ? 'light': 'dark'}-text`} to={pathname}>Nastavenie FIA</Link> </>

    return null
}