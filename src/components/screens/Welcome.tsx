import React from 'react'
import { URI } from '../../App'
import { Link } from 'react-router-dom'
import '../../styles/welcome.css'




export default function Welcome() {
    return(
        <div className='section' id='intro'>
            <div className='empty-header'></div>

            <h2 className='section-heading fade-in-out-border' style={{textTransform: 'capitalize'}}>
                <img src={`${URI}/media/images/league_logo.png/`} alt='league logo' style={{maxHeight: '5rem', maxWidth: '80vw'}} />
            </h2>
            

            <section className='intro-single-column'>
                    <Link target='_blank' style={{textDecoration: 'none'}} to='https://discord.gg/rDd2YB5bbg'>
                        <div className='invitation-card'>
                            <h2 className='fade-in-out-border'>Discord</h2>

                            <p style={{fontWeight: 'bold'}}>Pripoj sa k našej formulovej komunite na Discorde</p>

                            <p>
                                Zaujíma Ťa rýchlosť, preteky a adrenalín? Ak áno, alebo vlastne aj nie, srdečne Ťa pozývame na náš Discord, 
                                kde sa môžes spojiť s ostatnými nadšencami pretekania, zdieľať tipy a baviť sa o všetkom ohľadom motoršportu.
                            </p>
                        
                            <img src={`${URI}/media/images/dc_qr.png/`} alt='discord-qr-code' width='150px' />

                        </div>
                    </Link>

                <Link target='_blank' style={{textDecoration: 'none'}} to='https://www.youtube.com/@csfl5329'>
                    <div className='invitation-card'>
                        <h2 className='fade-in-out-border'>YouTube</h2>

                        <p style={{fontWeight: 'bold'}}>Pripoj sa do sveta Formule 1 na našom YouTube kanáli</p>

                        <p>
                            Pozývame Ťa na náš komunitný YouTube kanál, ktorý je plný vzrušujúceho obsahu pre všetkých, ktorí milujú
                            Formulu 1 a simracing. Na kanáli Ťa čakajú live streamy, zostrihy najlepších momentov a zábery zo sveta simracingu.
                        </p>
                    
                        <img src={`${URI}/media/images/yt_qr.png/`} alt='discord-qr-code' width='150px' loading='lazy' />

                    </div>
                </Link>

                <Link target='_blank' style={{textDecoration: 'none'}} to='https://www.instagram.com/cs.league/'>
                    <div className='invitation-card'>
                        <h2 className='fade-in-out-border'>Instagram</h2>
                        <p style={{fontWeight: 'bold'}}>Pripoj sa k nášmu komunitnému Instagramu</p>
                        
                        <p>
                            Pozývam Ťa na náš Instagramový profil, kde sa môžes ponoriť do sveta pretekov a simracingu. U nás nájdeš 
                            epické zábery z veľkých cien, tabuľky s výsledkami a pozvánky na ďalšie preteky. 
                        </p>

                        <br/>
                    
                        <img src={`${URI}/media/images/ig_qr.png/`} alt='discord-qr-code' width='150px' loading='lazy' />

                    </div>
                </Link>
            </section>
            

        </div>
    )
}