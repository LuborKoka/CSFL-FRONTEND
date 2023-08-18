import { Link, NavLink, Outlet, useLocation, useParams } from "react-router-dom";
import { randomURIkey } from "../../App";
import '../../styles/admin.css'
import { useState } from "react";
import useUserContext from "../../hooks/useUserContext";

export type OutletSeason = {
    seasonName: string,
    raceName: string
}

export type AdminOutletContext = [OutletSeason, React.Dispatch<React.SetStateAction<OutletSeason>>]


export default function AdminNav() {
    const [header, setHeader] = useState<OutletSeason>({seasonName: '', raceName: ''})

    const { seasonID, raceID } = useParams()

    const user = useUserContext()[0]
    
    const location = useLocation()

    const usersAndRolesAllowedRoles = ['Sys Admin', 'F1 Super Admin']

    return(
        <div className='content-container'>
            <div className='header-navigation'>
                <h3>F1 Admin</h3>
                <div className='breadcrumbs'>
                    { seasonID === undefined ? null : <Link className="link" to={`/${randomURIkey}/admin/season/${seasonID}`}>{header.seasonName}</Link>}
                    { raceID === undefined ? null : 
                        <>{'>'}<Link className="link" to={`/${randomURIkey}/admin/season/${seasonID}/race/${raceID}`}>{header.raceName}</Link></> }
                
                    { lastLink(location.pathname)}
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
                            <NavLink className='clickable-button' to={`/${randomURIkey}/admin/season/${seasonID}/drivers`}>Tímové dvojice</NavLink>
                            <NavLink className='clickable-button' to={`/${randomURIkey}/admin/season/${seasonID}/schedule`}>Upraviť Kalendár</NavLink>
                            <NavLink className='clickable-button' to={`/${randomURIkey}/admin/season/${seasonID}/reserves`}>Náhradníci</NavLink>
                            <NavLink className='clickable-button' to={`/${randomURIkey}/admin/season/${seasonID}/fia`}>Nastavenie FIA</NavLink>
                        </>
                    }

                    <NavLink className='clickable-button' to={`/${randomURIkey}/admin/seasons`}>Sezóny</NavLink>
                    {
                        usersAndRolesAllowedRoles.some(r => user?.roles.includes(r)) &&
                        <NavLink className='clickable-button' to={`/${randomURIkey}/admin/roles`}>Používatelia a Role</NavLink>
                    }
                    <NavLink className='clickable-button' to={`/${randomURIkey}/admin/rules`}>Upraviť pravidlá</NavLink>
                    <NavLink className='clickable-button' to={`/${randomURIkey}/admin/new-season`}>Vytvoriť sezónu</NavLink>
                </ul>
            </nav>

        </div>
    )
}





function lastLink(pathname: string): JSX.Element | null {
    if ( pathname.includes('/drivers') ) return <>{'>'} <Link className='link' to={pathname}>Tímové dvojice</Link></>

    if ( pathname.includes('/schedule')) return <>{'>'} <Link className='link' to={pathname}>Upraviť Kalendár</Link> </>   
    
    if ( pathname.includes('/reserves')) return <>{'>'} <Link className='link' to={pathname}>Náhradníci</Link> </>

    if ( pathname.includes('/fia')) return <>{'>'} <Link className='link' to={pathname}>Nastavenie FIA</Link> </>

    return null
}