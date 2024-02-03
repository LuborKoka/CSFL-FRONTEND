import axios, { AxiosError } from "axios"
import { URI, insertTokenIntoHeader } from "../../../App"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import useConfirmation from "../../../hooks/useConfirmation"
import useErrorMessage from "../../../hooks/useErrorMessage"
import useUserContext from "../../../hooks/useUserContext"
import SectionHeading from "../../reusableCompontents/SectionHeading"
import ClickableButton from "../../reusableCompontents/ClickableButton"
import useThemeContext from "../../../hooks/useThemeContext"
import { DARK, LIGHT } from "../../../constants"


export default function EditRules() {
    const [isUploading, setIsUploading] = useState(false)
    const [isEditorOpen, setIsEditorOpen] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [content, setContent] = useState('')
 
    const { data } = useQuery(['rules'], fetchRules)

    const [confirmation, showConfirmation] = useConfirmation()
    const [message, showMessage] = useErrorMessage()

    const user = useUserContext()[0]
    const [isDarkTheme] = useThemeContext()

    function updateValue(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setContent(e.target.value)
    }

    function submitFile(e: React.ChangeEvent<HTMLInputElement>) {    
        const form = new FormData()

        if ( e.target.files?.length !== 1 ) return
        
        form.append(e.target.files[0].name, e.target.files[0])
    
        setIsUploading(true)

        axios.post(`${URI}/rules/`, form, {
            headers: {
                Authorization: `Bearer ${insertTokenIntoHeader(user?.token)}`,
                "Content-Type": 'multipart/form-data'
            }
        })
        .then(() => showConfirmation(() => e.target.files = null))
        .catch((e: unknown) => {
            if ( e instanceof AxiosError && e.response?.data.error !== undefined ) {
                showMessage(e.response.data.error) 
                return
            }
            showMessage('Niečo sa pokazilo, skús to znova.')
        })
        .finally(() => setIsUploading(false))
    }

    function patchRules(e?: React.FormEvent) {
        if ( e !== undefined ) e.preventDefault()

        setIsPending(true)
        axios.patch(`${URI}/rules/`, {
            params: {
                rules: content
            }
        }, {
            headers: {
                Authorization: `Bearer ${insertTokenIntoHeader(user?.token)}`
            }
        })
        .then(() => showConfirmation())
        .catch((e: unknown ) => {
            showMessage(e)
        })
        .finally(() => setIsPending(false))

    }

    function save(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if ( e.key === 's' && e.ctrlKey ) {
            e.preventDefault()

            patchRules()
        }
    }

    function cancel() {
        setIsEditorOpen(false)
        if ( data?.rules ) setContent(data.rules)
    }


    useEffect(() => {
        if ( !data ) return
        setContent(data.rules)
    }, [data])

    const editor =
    <form onSubmit={patchRules}>
        <textarea className="rules-input" style={{color: isDarkTheme ? LIGHT : DARK}} value={content} onChange={updateValue} spellCheck={false} onKeyDown={save} />

        <div className="submit-button-container single-row">
            <ClickableButton onClick={cancel}>Zrušiť</ClickableButton>
            <ClickableButton type='submit' disabled={isPending}>Uložiť</ClickableButton>
        </div>
    </form>

    return(
        <>
            <SectionHeading sectionHeading>Upraviť pravidlá</SectionHeading>

            <div className="two-columns">
                <label className={`clickable-button ${isUploading ? 'button-disabled' : ''}`} id='custom-input' style={{fontSize: '20px', textAlign: 'center', display: 'block'}}>
                    <input type="file" disabled={isUploading} style={{display: 'none'}} onChange={submitFile} accept=".md" />
                    <span>{ isUploading ? 'Posiela sa na server' : 'Poslať .md súbor'}</span>
                </label>

                <ClickableButton onClick={() => setIsEditorOpen(p => !p)} align="center">{`${isEditorOpen ? 'Skryť' : 'Zobraziť'} editor`}</ClickableButton>
            </div>


            {
                isEditorOpen && editor
            }
            
             
            {
                confirmation
            }

            {
                message
            }
        </>
    )
}


async function fetchRules() {
    type Data = {
        rules: string
    }
    const res = await axios.get<Data>(`${URI}/rules/`)
    return res.data
}