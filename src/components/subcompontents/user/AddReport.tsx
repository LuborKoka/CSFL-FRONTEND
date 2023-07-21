import React, { useState, useRef, useContext, Context } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { URI, UserContext, UserTypes, generateRandomString } from "../../../App";
import Select, { MultiValue, StylesConfig, ActionMeta } from 'react-select';
import { Link, useOutletContext, useParams } from "react-router-dom";
import { RaceContext } from "../../controls/SeasonNav";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { DARKBLUE, RED, WHITE } from "../../../constants";
import { ReactComponent as PaperPlane }from '../../../images/sipka.svg'

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
    const [files, setFiles] = useState<{id: string, file: File}[]>([])
    const [links, setLinks] = useState<{url: string, id: string}[]>([])

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

        setFiles(p => [...p, ...files.map(f => {return {id: generateRandomString(12), file: f}})])        
    }

    function handleVideoInput(e: React.FormEvent) {
        e.preventDefault()
        if ( video.current === null ) return

        const link = video.current.value

        if ( validateURL(link) ) {
            report.current.video.push(video.current.value)
            setLinks(p => [...p, {url: link, id: generateRandomString(12)}])
            video.current.value = ''
        }   
    }

    function deleteLink(id: string) {
        setLinks(p => p.filter(l => l.id !== id))
    }

    function deleteVideo(id: string) {
        setFiles(p => p.filter(f => f.id !== id))
    }

    function handleDriversChange(d: MultiValue<{value: string, label: string} | undefined>,  actionMeta: ActionMeta<{value: string, label: string}>) {
        if ( d === undefined || d === null ) return

        report.current = {...report.current, targets: d.map(d => d!.value)}
    }

    function handleDescChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        report.current = {...report.current, inchident: e.target.value}
    }

    function handleReportSubmit(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()

        if ( user.user === null || ( files.length === 0 && links.length === 0 ) ) return

        report.current = {...report.current, from_driver: user.user.id, video: links.map(l => l.url)}

        setIsPending(true)

        const formData = new FormData()
        //rovno prilozis vsetky subory, neni o com
        files.forEach(f => {
            formData.append(`${f.file.name}`, f.file)
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
        <div id='addReport'>
            <h1 className='section-heading'>Nový Report</h1>
            <div className='labeled-input' id='race-name'>
                <input name='raceName' className='form-input' type="text" readOnly value={race.raceName} />
                <label htmlFor='raceName'>Preteky</label>
            </div>
            <Select options={driversFromQuery(query.data, user.user?.id)} isMulti onChange={handleDriversChange} styles={selectStyles} />

            <div className='labeled-input' id='inchident' >
                <textarea name='inchident' ref={reportDesc} onChange={handleDescChange} spellCheck={false} />
                <label htmlFor='inchident'>Popis inchidentu</label>
            </div>

            <h2>
                <FontAwesomeIcon icon={faPaperclip}/> Prílohy 
            </h2>
            
            <div className='two-columns'>
                <div  className='center' style={{margin: '2rem 0', flexDirection: 'column', rowGap: '1rem'}}>
                    <div style={{position: 'relative', width: '100%'}}>
                        {
                            files.map(f => <AddedVideo name={f.file.name} id={f.id} deleteVideo={deleteVideo} />)
                        }
                    </div>
                    
                    <div>
                        <label className='clickable-button' id='custom-input'>
                            <input type="file" multiple disabled={isPending} style={{display: 'none'}}
                            accept="image/jpeg, image/png, video/mp4, video/x-matroska, video/webm"  onChange={handleFileInput} />
                            <span>Vyber video alebo obrázok</span>
                        </label>
                    </div>
                </div>
                    
                <div>
                    <div>
                        {
                            links.map(l => <AddedLink url={l.url} id={l.id} deleteVideo={deleteLink} />)
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

            <div className='submit-button-container'>
                <button className='clickable-button' type="submit" onClick={handleReportSubmit} disabled={isPending}>Odoslať report</button>
            </div>
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


type LinkProps = {
    url: string,
    id: string,
    deleteVideo: (id: string) => void
}

function AddedLink({ url, id, deleteVideo}: LinkProps) {
    return(
        <div className='form-input'>
            <Link style={{color: WHITE, fontSize: '16px'}} target="_blank" to={url}>{url}</Link>
            <FontAwesomeIcon icon={faTrashAlt} onClick={() => deleteVideo(id)}  className="icon-delete center-right" />
        </div>
    )
}

type VideoProps = {
    name: string,
    id: string,
    deleteVideo: (id: string) => void
}

function AddedVideo({ name, id, deleteVideo}: VideoProps) {

    return(
        <div className='form-input' style={{width: '100%'}}>
            <span style={{color: WHITE, fontSize: '16px'}}>{name}</span>
            <FontAwesomeIcon icon={faTrashAlt} onClick={() => deleteVideo(id)} className='icon-delete center-right' />
        </div>
    )
}



type OptionType = { value: string, label: string };

const selectStyles: StylesConfig<OptionType, true> = {
    control: (styles) => {
        return {
            ...styles,
            cursor: 'text',
            backgroundColor: 'transparent',
            border: 'none',
            boxShadow: `0px 0px 8px rgba(239, 239, 239, 0.4)`,
            padding: '3px 10px',
            fontSize: '20px'
        }
    },
    placeholder: styles => {
        return {
            ...styles,
            color: WHITE,
            opacity: '.7'
        }
    },
    input: styles => {
        return {
            ...styles,
            color: WHITE
        }
    },
    option: (styles) => {
        return {
            ...styles,
            backgroundColor: WHITE,
            color: DARKBLUE,
            transition: 'all .2s',
            cursor: 'pointer',
            ':hover': {
                color: WHITE,
                backgroundColor: DARKBLUE
            }
        }
    },
    multiValue: styles => {
        return {
            ...styles,
            backgroundColor: 'transparent',
            color: WHITE,
            
        }
    },
    multiValueLabel: styles => {
        return {
            ...styles,
            color: WHITE,
            position: 'relative',
            '::after': {
                content: '""',
                position: 'absolute',
                width: '100%',
                height: '.6px',
                backgroundImage: `linear-gradient(to right, transparent, ${WHITE}, ${WHITE}, transparent)`,
                opacity: .65,
                bottom: 0,
                left: 0
            }
        }
    },
    multiValueRemove: (styles) => {
        return {
            ...styles,
            cursor: 'pointer',
            backgroundColor: 'transparent',
            color: RED,
            transition: 'all .2s',
            border: '1px solid transparent',
            transform: 'scaleY(.9)',
            ':hover': {
                borderColor: RED
            }
        }
    },
    dropdownIndicator: (styles) => {
        return {
            ...styles,
            cursor: 'pointer',
            color: WHITE,
            opacity: .8,
            ':hover': {
                opacity: 1
            }
        };
    },
    clearIndicator: (styles) => {
        return {
            ...styles,
            cursor: 'pointer',
            backgroundColor: 'transparent',
            color: RED,
            transition: 'all .2s',
            borderRadius: '3px',
            transform: 'scale(.8)',
            border: '1.5px solid transparent',
            ':hover': {
                borderColor: RED
            }
        }
    },
    // Add other property handlers as necessary...
};