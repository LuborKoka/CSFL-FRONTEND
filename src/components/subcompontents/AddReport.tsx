import React, { useState, useEffect, useRef, useContext, Context } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { URI, UserContext, UserTypes } from "../../App";
import Select, { SingleValue, MultiValue } from 'react-select';

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
    
    
    const report = useRef<{race: string, targets: string[], inchident: string, from_driver: string}>({inchident: '', race: '', targets: [], from_driver: ''})
    const reportDesc = useRef<HTMLTextAreaElement | null>(null)

    const user = useContext(UserContext as Context<UserTypes>)

    function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.prototype.slice.call(e.target.files) as File[]

        if ( files === null ) return      

        setFiles(files)        
    }

    function handleRaceChange(v: SingleValue<{value: string, label: string}>) {
        if ( v === null ) return

        report.current = {...report.current, race: v.value}
    }

    function handleDriversChange(d: MultiValue<{value: string, label: string}>) {
        if ( d === null ) return

        report.current = {...report.current, targets: d.map(d => d.value)}
    }

    function handleDescChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        report.current = {...report.current, inchident: e.target.value}
    }

    function handleReportSubmit(e: React.FormEvent) {
        e.preventDefault()

        if ( files.length === 0 ) return 

        report.current = {...report.current, from_driver: user.user!.id}

        console.log(report.current)
        setIsPending(true)

        const formData = new FormData()
        files.forEach((f, i) => {
            formData.append(`file_${i}`, f)
        })

        formData.append('report', JSON.stringify(report.current))

        axios.post(`${URI}/upload-report/`, formData, {
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
    

    useEffect(() => {
        axios.get(`${URI}/races/`)
        .then((r: AxiosResponse) => {
            const data = r.data.races as Race[]
            setRaceOptions(data.map(d => {
                return {value: d.id, label: d.name}
            }))
        })
        .catch((e: AxiosError) => {
            console.log(e)
            window.alert('fml')
        })

        axios.get(`${URI}/races/ad944a7e-6abc-4da7-979c-7e728ef07182/drivers/`)
        .then((r: AxiosResponse) => {
            const data = r.data.drivers as Driver[]
            setDriverOptions([{value: '', label: "Zigulin"}, ...data.map(d => {
                return {value: d.id, label: d.name}
            })])
        })
        .catch((e: AxiosError) => {
            console.log(e)
            window.alert('fml')
        })
    }, [])

    return(
        <form onSubmit={handleReportSubmit}>
            <Select options={raceOptions} onChange={handleRaceChange} required />
            <Select options={driverOptions} isMulti onChange={handleDriversChange} required />

            <textarea required placeholder="Popis inchidentu" ref={reportDesc} onChange={handleDescChange} />

            <input type="file" multiple disabled={isPending} onChange={handleFileInput} required /> {/*accept="video/mp4, video/x-matroska, video/webm"*/}
            <button type="submit" disabled={isPending}>Odoslať report</button>
        </form>
    )
}