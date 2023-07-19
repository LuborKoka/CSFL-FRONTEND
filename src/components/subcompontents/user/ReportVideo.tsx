import { URI } from "../../../App"

type Online = {
    isOnline: true,
    embed: boolean
}

type Offline = {
    isOnline: false
}

type Props = {
    url: string
} & (Offline | Online)


export default function ReportVideo(props: Props) {

    if ( !props.isOnline ) return(
        <div style={{maxWidth: '1100px'}}>
            <video width='100%' controls src={`${URI}/videos/report/${props.url}/`} />
        </div>
    )


    if ( props.embed ) return(
        <div>
            <iframe title='Report' width="560" height="315" src={props.url}  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
    )

    //toto potrebujem este dokoncit, nejak vedla zobrazit ten link ako <a href={url} target='_blank'></a> alebo take nieco
    return(
        <div>
            <h1>
                couldn't embed video
            </h1>
        </div>
    )
}


