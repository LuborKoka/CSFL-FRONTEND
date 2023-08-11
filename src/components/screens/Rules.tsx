import axios from "axios";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { URI } from "../../App";
import { useQuery } from "@tanstack/react-query";
import '../../styles/rules.css'


export default function Rules() { 
    const query = useQuery(['rules'], fetchRules)
    
    return(
        <article id="markdown" className="section">
            <h2 className='section-heading fade-in-out-border'>Pravidlá</h2>
            <ReactMarkdown children={query.data?.rules || '# Nepodarilo sa načítať pravidlá.'} remarkPlugins={[remarkGfm]} />
        </article>
    )
}


async function fetchRules() {
    type Data = {
        rules: string
    }
    const res = await axios.get<Data>(`${URI}/rules/`)
    return res.data
}