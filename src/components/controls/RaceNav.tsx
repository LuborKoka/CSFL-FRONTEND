import { NavLink, Outlet, useOutletContext, useParams } from "react-router-dom"
import { ReactComponent as FIA } from  '../../images/logo_Fia.svg'
import FIAVerdict from '../subcompontents/FIA/FIAVerdict'
import { useState } from 'react'



export default function RaceNav() {
    const { raceID, seasonID } = useParams()

    const [isAddingVerdict, setIsAddingVerdict] = useState(false)

    const context = useOutletContext()

    function openFiaForm() {
        setIsAddingVerdict(true)
    }

    return(
        <>
            <div className='race-container'>
                <div className='section'>
                    <Outlet context={context} />
                </div>
            </div>
            <div className='race-navigation'>
                {/*ten prvy link moze ist asi do pici, to bude v tej breadcrumbs navigacii*/}
                <ul>
                    <NavLink className='clickable-button' to={`${raceID}`}>Prehľad</NavLink>
                    <NavLink className='clickable-button' to={`${raceID}/results`}>Výsledky</NavLink>
                    <NavLink className='clickable-button' to={`${raceID}/reports`}>Reporty</NavLink>
                    <NavLink className='clickable-button' to={`/seasons/${seasonID}/standings`}>Tabuľka</NavLink>
                    <NavLink className='clickable-button' to={`${raceID}/reports/new`}>Pridať report</NavLink>
                    <button onClick={openFiaForm} className='clickable-button single-row'><FIA style={{height: '20px'}} /></button>
                </ul>
            </div>

            {
                isAddingVerdict ? <FIAVerdict setIsAddingVerdict={setIsAddingVerdict} /> : null
            }
        </>
    )
}