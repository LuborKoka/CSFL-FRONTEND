import React, { useEffect, useRef, useState } from 'react'
import { URI, generateRandomString, insertTokenIntoHeader } from '../../../App'
import axios from 'axios'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { RaceContext } from '../../controls/SeasonNav'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperclip, faRightLong, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { faRectangleXmark } from '@fortawesome/free-regular-svg-icons'
import { AddedLink, AddedVideo } from './AddReport'
import useConfirmation from '../../../hooks/useConfirmation'
import { useQueryClient } from '@tanstack/react-query'
import useErrorMessage from '../../../hooks/useErrorMessage'
import useUserContext from '../../../hooks/useUserContext'
import SectionHeading from '../../reusableCompontents/SectionHeading'
import UserTip from '../../reusableCompontents/UserTip'
import useThemeContext from '../../../hooks/useThemeContext'
import ClickableButton from '../../reusableCompontents/ClickableButton'
import ContentPopUp from '../../reusableCompontents/ContentPopUp'
import LabeledInput from '../../reusableCompontents/LabeledInput'

type Props = {
    responseData: {
        isActive: boolean,
        rank: number,
        from: string,
        targets: {name: string, id: string}[]
    },
    setResponseData: React.Dispatch<React.SetStateAction<{isActive: boolean,rank: number, from: string, targets: {name: string, id: string}[]}>>,
    raceID: string | undefined
}

export default function ReportResponse({ responseData, setResponseData, raceID }: Props) {
    const content = useRef<HTMLTextAreaElement>(null)

    const [files, setFiles] = useState<{id: string, file: File}[]>([])
    const [links, setLinks] = useState<{url: string, id: string}[]>([])

    const [isPending, setIsPending] = useState(false)

    const user = useUserContext()[0]

    const race = useOutletContext<RaceContext>()[0]

    const queryClient = useQueryClient()

    const navigate = useNavigate()

    const [isDarkTheme] = useThemeContext()

    const [confirmation, showConfirmation] = useConfirmation()
    const [message, showMessage] = useErrorMessage()

    //navigation for mobile users so they dont have to reach for that ugly ass close icon
    useEffect(() => {
        const originalPopstateListener = window.onpopstate

        const handlePopstate = () => {
            setResponseData(p => {return {...p, isActive: false}})
        }
    
        window.addEventListener('popstate', handlePopstate)
    
        return () => {
          window.removeEventListener('popstate', handlePopstate)
          window.onpopstate = originalPopstateListener
        }
      }, [setResponseData])


    function closeWindow() {
        setResponseData(p => {return {...p, isActive: false}})
        navigate(-1)
    }

    function deleteLink(id: string) {
        setLinks(p => p.filter(l => l.id !== id))
    }

    function deleteVideo(id: string) {
        setFiles(p => p.filter(f => f.id !== id))
    }


    function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.prototype.slice.call(e.target.files) as File[]

        if ( files === null ) return      

        setFiles(p => [...p, ...files.map(f => {return {id: generateRandomString(12), file: f}})]) 
    }

    function handleVideoInput(e: React.ChangeEvent<HTMLInputElement>) {
        const link = e.target.value

        if ( validateURL(link) ) {
            setLinks(p => [...p, {url: link, id: generateRandomString(12)}])
            e.target.value = ''
        }   
    }


    function confirm() {
        queryClient.invalidateQueries([`race_${raceID}_reports`])
        setResponseData(p => {return {...p, isActive: false}})
    }

    function submitReportResponse(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()

        setIsPending(true)

        if ( !user?.isLoggedIn ) {
            showMessage('Musíš sa prihlásiť.')
            return
        }

        const report = {
            from_driver: user.id,
            inchident: content.current!.value,
            video: links.map(l => l.url)
        }

        const form = new FormData()
        files.forEach(f => {
            form.append(`${f.file.name}`, f.file)
        })
        form.append('data', JSON.stringify(report))

        axios.post(`${URI}/report/${race.reportID}/response/`, form, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${insertTokenIntoHeader(user.token)}`
            }
        })
        .then(() => {
            showConfirmation(confirm)
        })
        .catch((e: unknown) => {
            showMessage(e)
        })
        .finally(() => setIsPending(false))
    }

    const form = 
    <ContentPopUp closePopUp={closeWindow}>
        <div>
            <div className={`sticky-heading ${isDarkTheme ? 'dark' : 'light'}-bg`}>
                <SectionHeading withTime sectionHeading time={<FontAwesomeIcon onClick={closeWindow} className='close-icon' icon={faRectangleXmark} />}>
                    {`Odpovedať na report #${responseData.rank}`}
                </SectionHeading>
            </div>

            <span className='single-row' style={{columnGap: '15px'}}>
                {responseData.from}
                <FontAwesomeIcon style={{transform: 'translateY(10%)'}} icon={faRightLong} />
                {
                    responseData.targets.map( (t, i) => //zvazit este nejaky marker pre nahlasenych
                        <span key={`reported_player${i}`} className='reported-player'><FontAwesomeIcon icon={faTriangleExclamation} /> {t.name}</span>
                    )
                }
            </span> 
            <br/>


            <div className='inchident labeled-input'>
                <textarea className={`${isDarkTheme ? 'light' : 'dark'}-text`} name='inchident' ref={content}/>
                <label className={`${isDarkTheme ? 'dark' : 'light'}-bg`} htmlFor='inchident' style={{left: '.5rem'}}>Tvoja odpoveď</label>
            </div>
            
            <SectionHeading sectionHeading>
                <FontAwesomeIcon icon={faPaperclip} /> Prílohy
            </SectionHeading>

            
            <UserTip style={{marginBottom: '1.5rem'}}>
                Na videá odporúčam použiť online platformy (youtube, streamable etc.). Všetkým (aj sebe) tým ušetríš kus dát.
            </UserTip>

            <div className='two-columns '>
                <div >
                    <div className="attachments-container">
                        {
                            files.map(f => {
                                return <AddedVideo name={f.file.name} id={f.id} deleteVideo={deleteVideo} key={f.id} />
                            })
                        }
                    </div>
                    
                    <div className='center'>
                    <label className='clickable-button' id='custom-input'>
                        <input type="file" multiple disabled={isPending} style={{display: 'none'}}
                        accept="image/jpeg, image/png, video/mp4, video/x-matroska, video/webm"  onChange={handleFileInput} />
                        <span>Vyber video alebo obrázok</span>
                    </label>
                    </div>
                </div>
                    
                <div>
                    <div className="attachments-container">
                        {
                            links.map(l => {
                                return <AddedLink url={l.url} id={l.id} deleteVideo={deleteLink} key={l.id} />
                            })
                        }
                    </div>

                    <div className='video-submit'>
                        <LabeledInput required name='video' htmlFor='video' type="url" style={{width: '95%'}} onChange={handleVideoInput} label='Pridaj link na video' />
                    </div>
                </div>
                    
            </div>                       


        </div>
        <ClickableButton withContainer onClick={submitReportResponse} disabled={isPending}>
            Odpovedať
        </ClickableButton>
    </ContentPopUp>

    return(
        <>
            { 
                responseData.isActive ? form : null
            }

            { confirmation }

            { message }
        </>
        
    )
}





function validateURL(url: string) {
    const pattern = new RegExp('^(http(s)?:\\/\\/)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)$')
    return pattern.test(url)
}
