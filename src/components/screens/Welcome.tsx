import React from 'react'
import { URI } from '../../App'
import '../../styles/welcome.css'
import SectionHeading from '../reusableCompontents/SectionHeading'
import InvitationCard from '../reusableCompontents/InvitationCard'
import useThemeContext from '../../hooks/useThemeContext'




export default function Welcome() {
    const [isDarkTheme] = useThemeContext()

    return(
        <div className='section' id='intro'>
            <div className='empty-header'></div>

            <SectionHeading sectionHeading>
                <img src={`${URI}/media/images/league_logo_${isDarkTheme ? 'dark' : 'light'}_mode.png/`} alt='league logo' style={{maxHeight: '5rem', maxWidth: '80vw'}} />
            </SectionHeading>
            

            <section className='intro-single-column'>
                <InvitationCard 
                    link='https://discord.gg/rDd2YB5bbg' heading='Discord'
                    title='Pripoj sa k našej formulovej komunite na Discorde'
                    text='Zaujíma Ťa rýchlosť, preteky a adrenalín? Ak áno, alebo vlastne aj nie, srdečne Ťa pozývame na náš Discord, 
                    kde sa môžes spojiť s ostatnými nadšencami pretekania, zdieľať tipy a baviť sa o všetkom ohľadom motoršportu.'
                    imgSrc='/media/images/dc_qr.png/' imgAlt='discord-qr-code'
                />

                <InvitationCard 
                    link='https://www.youtube.com/@csfl5329' heading='YouTube'
                    title='Pripoj sa do sveta Formule 1 na našom YouTube kanáli'
                    text='Pozývame Ťa na náš komunitný YouTube kanál, ktorý je plný vzrušujúceho obsahu pre všetkých, ktorí milujú
                    Formulu 1 a simracing. Na kanáli Ťa čakajú live streamy, zostrihy najlepších momentov a zábery zo sveta simracingu.'
                    imgSrc='/media/images/yt_qr.png/' imgAlt='youtube-qr-code'
                />

                <InvitationCard
                    link='https://www.instagram.com/cs.league/' heading='Instagram'
                    title='Pripoj sa k nášmu komunitnému Instagramu'
                    text='Pozývame Ťa na náš Instagramový profil, kde sa môžes ponoriť do sveta pretekov a simracingu. U nás nájdeš 
                    epické zábery z veľkých cien, tabuľky s výsledkami a pozvánky na ďalšie preteky.'
                    imgSrc='/media/images/ig_qr.png/' imgAlt='ig-qr-code'
                />
            </section>
            

        </div>
    )
}