import React, { useState, useEffect } from "react"
import axios, { AxiosError, AxiosResponse } from 'axios'
import { URI } from "../../App"

export default function Reports() {
    const [isPending, setIsPending] = useState(false)
    const [files, setFiles] = useState<File[]>([])

    function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.prototype.slice.call(e.target.files) as File[]

        if ( files === null ) return      

        setFiles(files)        
    }

    function handleReportSubmit(e: React.FormEvent) {
        e.preventDefault()

        if ( files.length === 0 ) return 

        setIsPending(true)

        const formData = new FormData()
        files.forEach((f, i) => {
            formData.append(`file_${i}`, f)
            formData.append(`filename_${i}`, f.name)
        })

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

    useEffect(()=> {
        if ( files.length === 0 ) return

        files.forEach(f => console.log(f.name, f.size))
    }, [files])

    return(
        <div>
            <form onSubmit={handleReportSubmit}>
                <input type="file" multiple disabled={isPending} onChange={handleFileInput} /> {/*accept="video/mp4, video/x-matroska, video/webm"*/}
                <button type="submit" disabled={isPending}>Odoslať report</button>
            </form>

            reports
            <div style={{height: '45vh'}}>content</div>
            <div style={{height: '45vh'}}>content</div>
            <div style={{height: '45vh'}}>content</div>
            <div style={{height: '45vh'}}>content</div>
            <div style={{height: '45vh'}}>content</div>
            <div style={{height: '45vh'}}>content</div>
            <div style={{height: '45vh'}}>content</div>
            <div style={{height: '45vh'}}>content</div>
        </div>
    )
}