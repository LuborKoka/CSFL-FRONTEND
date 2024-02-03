import axios from "axios";
import { URI } from "../../App";
import { useQuery } from '@tanstack/react-query'
import Race from "../subcompontents/user/Race";
import '../../styles/seasons.css'
import '../../styles/tiltableCard.css'
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { RED } from "../../constants";
import Loader from "../reusableCompontents/Loader";
import useThemeContext from "../../hooks/useThemeContext";
import SectionHeading from "../reusableCompontents/SectionHeading";
import ClickableButton from "../reusableCompontents/ClickableButton";


export default function Season() {
    const { seasonID } = useParams()
    const [isDark] = useThemeContext()

    const query = useQuery([`scheduled-races-${seasonID}`], () => fetchData(seasonID), {staleTime: Infinity})
    const drivers = useQuery([`season-drivers-user-${seasonID}`], () => fetchSeasonDrivers(seasonID), { staleTime: Infinity })

    if ( query.isLoading || drivers.isLoading ) return <Loader type='season' />
    

    const tableLink = 
        <Link className='link-in-header' to={`/seasons/${seasonID}/standings`}>
            <ClickableButton>
                Tabuľka <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </ClickableButton>
        </Link>

    const calendar = 
    <>
        <SectionHeading sectionHeading withTime time={tableLink}>
            Kalendár           
        </SectionHeading>
        

        {
            query?.data?.races.map(r => {
                return <Race key={r.id} {...r} />
            })
        }
    </>

    const emptyCalendar =
    <>
        <br/><br/>
        <h2 className='section-heading fade-in-out-border' style={{textAlign: 'center'}}> 
            <FontAwesomeIcon icon={faExclamationTriangle} style={{color: RED, margin: '0 2rem'}} />
            Kalendár pre túto sezónu je zatiaľ prázdny.
            <FontAwesomeIcon icon={faExclamationTriangle} style={{color: RED, margin: '0 2rem'}} />
        </h2>

    </>

    const lineUp = 
    <>
        <SectionHeading sectionHeading style={{marginTop: '2rem'}}>
            Súpiska
        </SectionHeading>

        <div className='team-members-grid'>
            {
                drivers.data?.teams.map((t, i) => 
                    <div className='team-members fade-in-out-border content-fade-in'  key={t.id} style={{color: t.color}}>
                        <img style={{animationDelay: `${50*i}ms`}} alt={t.name} className='team-logo' loading="lazy" id={t.image.includes('aston') ? 'aston' : ''}
                            src={`${URI}/media/${t.image.replace('.svg', `_${isDark ? 'dark' : 'light'}_mode.svg`)}/`} />
                        <div style={{animationDelay: `${50*i}ms`, display: 'inline-grid', placeContent: 'center flex-start', rowGap: '1rem', fontSize: '1.2rem', minWidth: '160px'}}>

                            <b style={{whiteSpace: 'nowrap'}}>
                                {
                                    t.drivers.length >= 1 && <b>{t.drivers[0].name}</b>
                                } 
                            </b>
                            
                            <b style={{whiteSpace: 'nowrap'}}> 
                                {
                                    t.drivers.length === 2 && <b>{t.drivers[1].name}</b>
                                } 
                            </b>       
                        </div>
                    </div>    
                )
            }
        </div>
    </>
    

    const emptyLineUp = 
    <>
        <br/><br/>
        <h2 className='section-heading fade-in-out-border' style={{textAlign: 'center'}}> 
            <FontAwesomeIcon icon={faExclamationTriangle} style={{color: RED, margin: '0 2rem'}} />
            Súpiska pre túto sezónu je zatiaľ prázdna.
            <FontAwesomeIcon icon={faExclamationTriangle} style={{color: RED, margin: '0 2rem'}} />
        </h2>

    </>



    return(
        <div className='section'>
            {
                query.data?.races.length === 0 ? emptyCalendar : calendar
            }

                    
            {
                drivers.data?.isEmptyLineUp ? emptyLineUp : lineUp
            }
            
        
        </div>
    )
}




export async function fetchData(seasonID: string | undefined) {
    type Data = {
        seasonName: string,
        races: {
            id: string,
            raceName: string,
            date: string,
            trackID: string,
            isSprint: boolean,
            image: string
        }[]
    }
    const res = await axios.get<Data>(`${URI}/schedule/${seasonID}/`)
    return res.data
}


export async function fetchSeasonDrivers(seasonID: string | undefined) {
    type Data = {
        reserves: {
            id: string,
            name: string
        }[],
        availableDrivers: { // toto tusim ani nikde nepouzivam
            id: string,
            name: string
        }[],
        teams: {
            id: string,
            name: string,
            color: string,
            image: string,
            drivers: {
                id: string,
                name: string
            }[]
        }[],
        isEmptyLineUp?: true
    }
    const res = await axios.get<Data>(`${URI}/season-drivers/${seasonID}/`)

    return res.data
}