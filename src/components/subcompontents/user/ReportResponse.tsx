import React, { Context, useContext, useRef, useState } from 'react'
import { URI, UserContext, UserTypes } from '../../../App'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { useOutletContext } from 'react-router-dom'
import { RaceContext } from '../../controls/SeasonNav'
import '../../../styles/reports.css'

type Props = {
    isAddingResponse: boolean,
    setIsAddingResponse: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ReportResponse({ isAddingResponse, setIsAddingResponse }: Props) {
    const content = useRef<HTMLTextAreaElement>(null)
    const video = useRef<HTMLInputElement>(null)


    const [onlineVideos, setOnlineVideos] = useState<string[]>([])
    const [offlineVideos, setOfflineVideos] = useState<File[]>([])
    const [isPending, setIsPending] = useState(false)

    const user = useContext(UserContext as Context<UserTypes>)

    const [race, setRace] = useOutletContext<RaceContext>()


    function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
        if ( e.target.files?.length === 0 ) return

        const files = Array.prototype.slice.call(e.target.files) as File[]
        if ( files === null ) return

        setOfflineVideos(p => [...p, ...files])
    }

    function handleVideoInput(e: React.FormEvent) {
        e.preventDefault()

        if ( video.current === null ) return

        if ( validateURL(video.current.value) ) {
            setOnlineVideos(p => [...p, video.current!.value])
            video.current.value = ''
        }
    }

    function submitReportResponse(e: React.FormEvent) {
        e.preventDefault()

        setIsPending(true)

        const report = {
            from_driver: user.user?.id,
            inchident: content.current!.value,
            video: onlineVideos
        }

        const form = new FormData()
        offlineVideos.forEach(f => form.append(`${f.name}`, f))
        form.append('data', JSON.stringify(report))

        axios.post(`${URI}/report/${race.reportID}/response/`, form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((r: AxiosResponse) => {

        })
        .catch((e: AxiosError) => {

        })
        .finally(() => setIsPending(false))
    }

    return(
        <div className={`report-response-container ${isAddingResponse ? 'report-response-active' : ''}`}>
            <form onSubmit={submitReportResponse}>
                <textarea ref={content} placeholder="tvoja odpoveď" />
                <input multiple type='file' onChange={handleFileInput} />
                <button disabled={isPending} type='submit'>Odoslať</button>
            </form>
            <form onSubmit={handleVideoInput}>
                <input ref={video} type='url' placeholder='Link na video' />
                <button type='submit'>Uložiť video</button>
            </form>

            <button onClick={() => setIsAddingResponse(false)}>Close</button>
        </div>
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