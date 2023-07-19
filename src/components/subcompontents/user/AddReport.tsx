import React, { useState, useEffect, useRef, useContext, Context } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { URI, UserContext, UserTypes } from "../../../App";
import Select, { SingleValue, MultiValue } from 'react-select';
import { useOutletContext, useParams } from "react-router-dom";
import { RaceContext } from "../../controls/SeasonNav";
import { useQuery } from "@tanstack/react-query";

type Race = {
    name: string,
    id: string
}

type Driver = {
    name: string,
    id: string
}

export default function AddReport() {
    const [isPending, setIsPending] = useState(false)
    const [files, setFiles] = useState<File[]>([])
    const [raceOptions, setRaceOptions] = useState<{value: string, label: string}[]>([])
    const [driverOptions, setDriverOptions] = useState<{value: string, label: string}[]>([])

    const { raceID } = useParams()

    const query = useQuery([`report_${raceID}_driver_options`], () => fetchDrivers(raceID))
    
    
    const report = useRef<{targets: string[], inchident: string, from_driver: string, video: string[]}>({inchident: '', targets: [], from_driver: '', video: []})
    const reportDesc = useRef<HTMLTextAreaElement>(null)
    const video = useRef<HTMLInputElement>(null)

    const user = useContext(UserContext as Context<UserTypes>)

    const race = (useOutletContext() as RaceContext)[0]

    function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.prototype.slice.call(e.target.files) as File[]

        if ( files === null ) return      

        setFiles(files)        
    }

    function handleVideoInput(e: React.FormEvent) {
        e.preventDefault()
        if ( video.current === null ) return

        if ( validateURL(video.current.value) ) {
            report.current.video.push(video.current.value)
            video.current.value = ''
        }
        
    }

    function handleDriversChange(d: MultiValue<{value: string, label: string} | undefined>) {
        if ( d === undefined || d === null ) return

        report.current = {...report.current, targets: d.map(d => d!.value)}
    }

    function handleDescChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        report.current = {...report.current, inchident: e.target.value}
    }

    function handleReportSubmit(e: React.FormEvent) {
        e.preventDefault()

        if ( user.user === null || ( files.length === 0 && report.current!.video.length === 0 ) ) return 

        report.current = {...report.current, from_driver: user.user.id}

        setIsPending(true)

        const formData = new FormData()
        //rovno prilozis vsetky subory, neni o com
        files.forEach(f => {
            formData.append(`${f.name}`, f)
        })
        
        //tuto sa appenduje zvysok dat, keby daco
        formData.append('report', JSON.stringify(report.current))

        axios.post(`${URI}/races/${raceID}/reports/`, formData, {
            headers: {
                "Content-Type": 'multipart/form-data'
            }
        })
        .then((r: AxiosResponse) => {
            console.log(r)
        })
        .catch((e: AxiosError) => {
            console.log(e)
        })
        .finally(() => setIsPending(false))
    }
    
    return(
        <div>
            <h1>Submit Report{race.raceName}</h1>
            <form onSubmit={handleReportSubmit}>
                {/*<Select options={raceOptions} onChange={handleRaceChange} required />*/}
                <input type="text" readOnly value={race.raceName} />
                <Select options={driversFromQuery(query.data, user.user?.id)} isMulti onChange={handleDriversChange} required />

                <textarea required placeholder="Popis inchidentu" ref={reportDesc} onChange={handleDescChange} />

                
                <input type="file" multiple disabled={isPending} onChange={handleFileInput} /> {/*accept="video/mp4, video/x-matroska, video/webm"*/}
                <button type="submit" disabled={isPending}>Odoslať report</button>
            </form>
            <form onSubmit={handleVideoInput}>
                <input ref={video} type="url" placeholder="Link na video" />
                <button type="submit">Pridať video</button>
            </form>
        </div>
    )
}



async function fetchDrivers(id: string | undefined) {
    const res = await axios.get<{drivers: Driver[]}>(`${URI}/races/${id}/drivers/`)
    return res.data
}

function driversFromQuery(data: {drivers: Driver[]} | undefined, id: string | undefined) {
    if ( data === undefined || data === null || data.drivers === undefined || data.drivers === null) return []
    
    const drivers = data?.drivers.map(d => {
        return {value: d.id, label: d.name}
    })

    const index = drivers.findIndex(d => d?.value === id)

    drivers.splice(index, 1)

    return drivers
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