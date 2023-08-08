import React, { useState, useRef, useContext, Context } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { URI, UserContext, UserTypes, generateRandomString, insertTokenIntoHeader } from "../../../App";
import Select, { MultiValue, StylesConfig, ActionMeta } from 'react-select';
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb, faPaperclip, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { DARKBLUE, RED, WHITE } from "../../../constants";
import { ReactComponent as PaperPlane }from '../../../images/sipka.svg'
import useConfirmation from "../../../hooks/useConfirmation";
import useErrorMessage from "../../../hooks/useErrorMessage";

type Driver = {
    name: string,
    id: string
}

export default function AddReport() {
    const [isPending, setIsPending] = useState(false)
    const [isEmptyTarget, setIsEmptyTarget] = useState(false)
    const [isEmptyText, setIsEmptyText] = useState(false)
    const [isEmptyVideo, setIsEmptyVideo] = useState(false)
    const [files, setFiles] = useState<{id: string, file: File}[]>([])
    const [links, setLinks] = useState<{url: string, id: string}[]>([])

    const { raceID, seasonID } = useParams()

    const { user } = useContext(UserContext as Context<UserTypes>)
    
    const query = useQuery([`race_${raceID}_drivers`], () => fetchDrivers(raceID, user?.token))
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    
    const report = useRef<{targets: string[], inchident: string, from_driver: string, video: string[]}>({inchident: '', targets: [], from_driver: '', video: []})
    const video = useRef<HTMLInputElement>(null)

    const [confirmation, showConfirmation] = useConfirmation()
    const [message, showMessage] = useErrorMessage()

    function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.prototype.slice.call(e.target.files) as File[]

        if ( files === null ) return      

        setFiles(p => [...p, ...files.map(f => {return {id: generateRandomString(12), file: f}})])        
    }

    function handleVideoInput(e: React.FormEvent) {
        setIsEmptyVideo(false)
        e.preventDefault()
        if ( video.current === null ) return

        const link = video.current.value

        if ( validateURL(link) ) {
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
        setIsEmptyTarget(false)
        report.current = {...report.current, targets: d.map(d => d!.value)}
    }

    function handleDescChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        report.current = {...report.current, inchident: e.target.value}
        setIsEmptyText(false)
    }
    
    function handleReportSubmit(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()

        if ( report.current.targets.length === 0 ) {
            setIsEmptyTarget(true)
            return
        }

        if ( report.current.inchident.trim().length < 20 ) {
            setIsEmptyText(true)
            return
        }

        if ( files.length === 0 && links.length === 0 ) {
            setIsEmptyVideo(true)
            return
        }

        if ( user === null ) return

        report.current = {...report.current, from_driver: user.id, video: links.map(l => l.url)}

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
            queryClient.invalidateQueries([`race_${raceID}_reports`])
            showConfirmation(() => navigate(`/seasons/${seasonID}/race/${raceID}/reports`))
        })
        .catch((e: unknown) => {
            if (e instanceof AxiosError && e.response?.data.error !== undefined ) {
                showMessage(e.response.data.error)
                return
            }
            console.log(e)
            showMessage('Niečo sa pokazilo. Skús to znova.')
        })
        .finally(() => setIsPending(false))
    }
    
    return(
        <>
            <div id='addReport'>
                <h1 className='section-heading fade-in-out-border'>Nový Report</h1>
                <div className='labeled-input perma-active'>
                    <input name='raceName' className='form-input' type="text" readOnly value={`${query.data?.raceName}`} />
                    <label htmlFor='raceName'>Preteky</label>
                </div>
                <div className="labeled-input perma-active" >
                    <Select name="reported-drivers" options={[{value: 'hra', label: 'Hra'}, ...driversFromQuery(query.data, user?.id)]} isMulti onChange={handleDriversChange} styles={selectMultiValueStyles()} />
                    <label htmlFor="reported-driver">Nahlásení hráči</label>
                    { isEmptyTarget && <p className='input-error'>Musíš nahlásiť aspoň jedného hráča alebo hru.</p>}
                </div>

                <div className='inchident labeled-input ' >
                    <textarea name='inchident' onChange={handleDescChange} spellCheck={false} />
                    <label htmlFor='inchident'>Popis inchidentu</label>
                    { isEmptyText && <p className='input-error'>Popis inchidentu musí mať aspoň 20 znakov.</p>}
                </div>

                <h2 className='fade-in-out-border'>
                    <FontAwesomeIcon icon={faPaperclip} /> Prílohy 
                </h2>

                { isEmptyVideo && <p className='input-error' style={{marginTop: '-1rem'}}>Potrebujeme od teba aspoň jednu prílohu.</p>}

                <div className='user-tip' style={{zIndex: '0'}}>
                    <FontAwesomeIcon icon={faLightbulb} />
                    <span>Na videá odporúčam použiť online platformy (youtube, streamable etc.). Všetkým (aj sebe) tým ušetríš kus dát.</span>
                    <FontAwesomeIcon icon={faLightbulb} />
                </div>
                <br/>
                
                <div className='two-columns fade-in-out-border'>
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

                <div className='submit-button-container'>
                    <button className={`clickable-button ${isPending ? 'button-disabled' : ''}`} type="submit" onClick={handleReportSubmit} disabled={isPending}>Odoslať report</button>
                </div>
            </div>

            { confirmation }
            { message }
        </>
    )
}



async function fetchDrivers(id: string | undefined, token: string | null | undefined) {
    const res = await axios.get<{drivers: Driver[], raceName: string}>(`${URI}/races/${id}/drivers/`, {
        headers: {
            Authorization: `Bearer ${insertTokenIntoHeader(token)}`
        }
    })
    return res.data
}

function driversFromQuery(data: {drivers: Driver[]} | undefined, id: string | undefined) {
    if ( data === undefined || data === null || data.drivers === undefined || data.drivers === null) return []
    
    const drivers = data?.drivers.map(d => {
        return {value: d.id, label: d.name}
    })


    //d.value je driver_id, takze tuto zatial picu najde
    const index = drivers.findIndex(d => d?.value === id)

    //aby sa nedalo reportnut sameho seba
    if ( index !== -1) drivers.splice(index, 1)

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

export function AddedLink({ url, id, deleteVideo}: LinkProps) {
    return(
        <div className='form-input' style={{width: '100%', paddingRight: '2.5rem'}}>
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

export function AddedVideo({ name, id, deleteVideo}: VideoProps) {
    return(
        <div className='form-input' style={{width: '100%', paddingRight: '1.5rem'}}>
            <span style={{color: WHITE, fontSize: '16px'}}>{name}</span>
            <FontAwesomeIcon icon={faTrashAlt} onClick={() => deleteVideo(id)} className='icon-delete center-right' />
        </div>
    )
}



type OptionType = { value: string, label: string };

export function selectMultiValueStyles(color = 'rgba(239, 239, 239, .4)') {
    const underLineColor = color === 'rgba(239, 239, 239, .4)' ? WHITE : color
    const boxShadow = color === 'rgba(239, 239, 239, .4)' ? `0 0 10px ${color}` : `0 0 10px 5px ${color}`

    const selectMultiValueStyles: StylesConfig<OptionType, true> = {
        control: (styles) => {
            return {
                ...styles,
                cursor: 'text',
                backgroundColor: 'transparent',
                border: 'none',
                boxShadow: boxShadow,
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
                color: underLineColor,
                position: 'relative',
                '::after': {
                    content: '""',
                    position: 'absolute',
                    width: '100%',
                    height: '.6px',
                    backgroundImage: `linear-gradient(to right, transparent, ${underLineColor}, ${underLineColor}, transparent)`,
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
    return selectMultiValueStyles
}