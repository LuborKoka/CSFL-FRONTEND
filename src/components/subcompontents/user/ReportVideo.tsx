import { useEffect, useRef, useState } from "react"
import { URI } from "../../../App"
import { Link } from "react-router-dom"
import { WHITE } from "../../../constants"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDownload } from "@fortawesome/free-solid-svg-icons"
import useErrorMessage from "../../../hooks/useErrorMessage"

type Online = {
    isOnline: true,
    embed: boolean
}

type Offline = {
    isOnline: false,
    isImage: boolean
}

type Props = {
    url: string
} & (Offline | Online)


export default function ReportVideo(props: Props) {
    const [height, setHeight] = useState('0')

    const container = useRef<HTMLDivElement>(null)

    const [message, showMessage] = useErrorMessage()


    function download() {
        fetch(`${URI}/media/${props.url}/?download=true`, {
            method: 'GET',
        })
        .then( res => {
            if ( res.status !== 200 ) throw new Error(res.statusText)
            return res.blob()
        })
        .then( blob => {
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `image.${props.url.split('.').at(-1)}`
            document.body.appendChild(a)
            a.click()
            a.remove()
        })
        .catch( e => {
            showMessage(e)
        })
    }

    //treba nejako ojebat
    //ojebane
    useEffect(() => {
        if ( container.current === null || container === null ) return
        const handleResize = () => {
            if ( container.current === null || container === null ) return
            const width = container.current.offsetWidth
            const newHeight = (315/560) * width
            setHeight(`${newHeight}px`)
        }

        handleResize()
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [container, props])


    if ( !props.isOnline ) {

        return props.isImage ?
            <div style={{position: 'relative'}}>
                { message }
                <div className="hoverable-icon" onClick={download}>
                    <FontAwesomeIcon icon={faDownload} style={{color: WHITE}} />
                </div>
                <img src={`${URI}/media/${props.url}/`} alt="File Not Found" width='100%' height='100%' style={{objectFit: 'contain'}}/>
            </div>
            :
            <div >
                <video width='100%' height='100%' controls src={`${URI}/media/${props.url}/`} />
            </div>
        
    }
    
    
    
    


    if ( props.embed ) return(
        <div ref={container}>
            <iframe  style={{outline: 'none', border: 'none'}} height={height} width='100%' title='Report' src={props.url}  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
    )

    //toto potrebujem este dokoncit, nejak vedla zobrazit ten link ako <a href={url} target='_blank'></a> alebo take nieco
    return(
        <>
            <Link to={props.url} target="_blank" style={{color: WHITE, gridColumn: '1 / -1'}} className="link">{props.url}</Link>
        </>
    )
}


