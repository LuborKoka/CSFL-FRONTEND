import React, { Context, useContext, useRef, useState } from 'react'
import { URI, UserContext, UserTypes, generateRandomString } from '../../../App'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { useOutletContext } from 'react-router-dom'
import { RaceContext } from '../../controls/SeasonNav'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperclip, faRightLong, faTriangleExclamation, faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { faRectangleXmark } from '@fortawesome/free-regular-svg-icons'
import {ReactComponent as PaperPlane} from '../../../images/sipka.svg'
import { AddedLink, AddedVideo } from './AddReport'

type Props = {
    responseData: {
        isActive: boolean,
        rank: number,
        from: string,
        targets: {name: string, id: string}[]
    },
    setResponseData: React.Dispatch<React.SetStateAction<{isActive: boolean,rank: number, from: string, targets: {name: string, id: string}[]}>>
}

export default function ReportResponse({ responseData, setResponseData }: Props) {
    const content = useRef<HTMLTextAreaElement>(null)
    const video = useRef<HTMLInputElement>(null)

    const [files, setFiles] = useState<{id: string, file: File}[]>([])
    const [links, setLinks] = useState<{url: string, id: string}[]>([])

    const [isPending, setIsPending] = useState(false)

    const user = useContext(UserContext as Context<UserTypes>)

    const [race, setRace] = useOutletContext<RaceContext>()

    function closeWindow() {
        setResponseData(p => {return {...p, isActive: false}})
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

    function handleVideoInput(e: React.FormEvent) {
        e.preventDefault()
        if ( video.current === null ) return

        const link = video.current.value

        if ( validateURL(link) ) {
            setLinks(p => [...p, {url: link, id: generateRandomString(12)}])
            video.current.value = ''
        }   
    }

    function submitReportResponse(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()

        setIsPending(true)

        const report = {
            from_driver: user.user?.id,
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
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((r: AxiosResponse) => {
            setResponseData(p => {return {...p, isActive: false}})
        })
        .catch((e: AxiosError) => {

        })
        .finally(() => setIsPending(false))
    }

    const form = 
    <div className='pop-up-bg' onClick={closeWindow} >
        <div className='pop-up-content' onClick={(e) => e.stopPropagation()}>
            <div>
                <div className='sticky-heading'>
                    <h2 className='header-with-time section-heading fade-in-out-border'>
                        {`Odpovedať na report #${responseData.rank}`}
                        <FontAwesomeIcon onClick={closeWindow} className='close-icon' icon={faRectangleXmark} />    
                    </h2>
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
                    <textarea name='inchident' ref={content}/>
                    <label htmlFor='inchident' style={{left: '.5rem'}}>Tvoja odpoveď</label>
                </div>

                <h2 className='fade-in-out-border section-heading'>
                    <FontAwesomeIcon icon={faPaperclip} /> Prílohy
                </h2>
                
                <div className='user-tip'>
                    <FontAwesomeIcon icon={faLightbulb} />
                    <span>Na videá odporúčam použiť online platformy (youtube, streamable etc.). Všetkým (aj sebe) tým ušetríš kus dát.</span>
                    <FontAwesomeIcon icon={faLightbulb} />
                </div>
                <br/>

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

                        <form className='video-submit' onSubmit={handleVideoInput}>
                            <div className='labeled-input'>
                                <input className='form-input' required ref={video} name='video' type="url"/>
                                <label htmlFor='video'>Pridaj link na video</label>
                            </div>
                            <button className="svg-button" type="submit"><PaperPlane /></button>
                        </form>
                    </div>
                        
                </div>                       


            </div>
            <div className='submit-button-container'>
                    <button className='clickable-button' onClick={submitReportResponse}>Odpovedať</button>
                </div>
        </div>
    </div>

    return(
        responseData.isActive ? form : null
    )
}





function validateURL(url: string) {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name and extension
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?'+ // port
    '(\\/[-a-z\\d%_.~+]*)*'+ // path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(url);
}