
type Props = {
    isOpen: boolean,
    color: 'positive' | 'negative' | 'warning'
}



//maybe pouzijem, uvidime
export default function InformationPopup({ isOpen }: Props) {



    return(
        <div>
            <span>Si offline</span>
        </div>
    )
}