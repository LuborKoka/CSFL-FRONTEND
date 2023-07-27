import { useEffect, useRef, useState } from "react"
import { URI } from "../../../App"
import { Link } from "react-router-dom"

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
            <div>
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
        <Link to={props.url} className="link">{props.url}</Link>
    )
}


