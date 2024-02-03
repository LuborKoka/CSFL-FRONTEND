import axios from "axios";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { URI } from "../../App";
import { useQuery } from "@tanstack/react-query";
import '../../styles/rules.css'
import Loader from "../reusableCompontents/Loader";
import SectionHeading from "../reusableCompontents/SectionHeading";
import useThemeContext from "../../hooks/useThemeContext";


export default function Rules() { 
    const { data, isLoading} = useQuery(['rules'], fetchRules, { staleTime: Infinity })
    const [isDarkTheme] = useThemeContext()

    if ( isLoading ) return <Loader type='rules' />

    if ( data === undefined ) 
        return <ReactMarkdown># Nepodarilo sa načítať pravidlá.</ReactMarkdown>

    
    
    return(
        <article id="markdown" className={`section ${isDarkTheme ? 'dark' : 'light'}-rules`}>
            <div className={`empty-header ${isDarkTheme ? 'dark' : 'light'}-bg`}></div>
            <br/><br/>
            <SectionHeading sectionHeading withTime time={`Posledná úprava: ${data.modifiedAt}`}>Pravidlá</SectionHeading>
     
            <ReactMarkdown children={data.rules} remarkPlugins={[remarkGfm]} />
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