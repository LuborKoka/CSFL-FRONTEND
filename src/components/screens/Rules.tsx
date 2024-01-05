import axios from "axios";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { URI } from "../../App";
import { useQuery } from "@tanstack/react-query";
import '../../styles/rules.css'
import Loader from "../reusableCompontents/Loader";
import SectionHeading from "../reusableCompontents/SectionHeading";


export default function Rules() { 
    const query = useQuery(['rules'], fetchRules, { staleTime: Infinity })

    if ( query.isLoading ) return <Loader type='rules' />

    if ( query.data === undefined ) 
        return <ReactMarkdown># Nepodarilo sa načítať pravidlá.</ReactMarkdown>

    
    
    return(
        <article id="markdown" className="section">
            <div className='empty-header'></div>
            <br/><br/>
            <SectionHeading sectionHeading withTime time={`Posledná úprava: ${query.data.modifiedAt}`}>Pravidlá</SectionHeading>
     
            <ReactMarkdown children={query.data.rules} remarkPlugins={[remarkGfm]} />
        </article>
    )
}



async function fetchRules() {
    type Data = {
        rules: string,
        modifiedAt: string
    }
    const res = await axios.get<Data>(`${URI}/rules/`)
    return res.data
}