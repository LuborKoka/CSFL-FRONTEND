import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../../styles/loadingState.css'
import { faRightLong } from '@fortawesome/free-solid-svg-icons'
import React from 'react'

type Props = {
    type: 'results' | 'standings' | 'reports' | 'season' | 'race overview' | 'rules'
}

export default function Loader({ type }: Props) {
    function table(n_rows: number, key?: string | number) {
        const tableRows: JSX.Element[] = []

        for ( let count = 0; count < n_rows; count++ ) tableRows.push(
            <span key={`row-${count}`} className='row' /*style={{animationDelay: `${count * (1/n_rows)}s`}}*/>
                <div /*style={{animationDelay: `${count * (1/n_rows)}s`}}*/></div>
                <div /*style={{animationDelay: `${count * (1/n_rows)}s`}}*/></div>
                <div /*style={{animationDelay: `${count * (1/n_rows)}s`}}*/></div>
                <div /*style={{animationDelay: `${count * (1/n_rows)}s`}}*/></div>
            </span>
        )

        return(
            <section key={key}>   
                <div className='loader-table'>
                    <span className='row header'><div></div><div></div><div></div><div></div></span>
    
                    {
                        tableRows
                    }
                </div>
            </section>
        )   
    }

    function cards(n_cards: number) {
        const cards = []

        for ( let count = 0; count < n_cards; count++ ) {
            cards.push(
            <div key={`cards-${count}`} className='card white animation loader-card' style={{animationDelay: `${count * (1/n_cards)}s`}}></div>
            )
        }

        return cards
    }

    function teams(n_teams: number) {
        const teams = []

        for ( let count = 0; count < n_teams; count++ ) {
            teams.push(
                <div className='team-members' key={`members-${count}`}>
                    <div className='team-logo-loader white animation' style={{animationDelay: `${count * (1/n_teams)}s`}}></div>

                    <div style={{display: 'inline-grid', placeContent: 'center flex-start', rowGap: '1rem', fontSize: '1.2rem', minWidth: '160px'}}>
                        <span className='loader-team-member animation white' style={{animationDelay: `${count * (1/n_teams)}s`}}></span>
                        <span className='loader-team-member animation white' style={{animationDelay: `${count * (1/n_teams)}s`}}></span>
                    </div>
                </div>
            )
        }

        return teams
    }

    function rules(n_rules: number) {
        const rules = []
        const perRuleOffset = 1 / n_rules

        for ( let count = 0; count < n_rules; count++ ) {
            const withinRuleOffset = perRuleOffset / 4

            rules.push(
                <React.Fragment key={`rules-${count}`}>
                    <span className='animation loader-rule-heading white' style={{animationDelay: `${count * perRuleOffset}s`}}></span>
                    <ul>
                        <li className='animation white loader-rule-item' style={{animationDelay: `${count * perRuleOffset + withinRuleOffset * 1}s`}}></li>
                        <li className='animation white loader-rule-item' style={{animationDelay: `${count * perRuleOffset + withinRuleOffset * 2}s`}}></li>
                        <li className='animation white loader-rule-item' style={{animationDelay: `${count * perRuleOffset + withinRuleOffset * 3}s`}}></li>
                        <li className='animation white loader-rule-item' style={{animationDelay: `${count * perRuleOffset + withinRuleOffset * 4}s`}}></li>
                    </ul>
                    <br/>
                </React.Fragment>
            )
        }

        return rules
    }

    if ( type === 'standings' || type === 'results') {
        return (
            table(12)
        )
    }

    if ( type === 'reports' ) {
        const card = 
        
        <section className='report-card loader-report'>
            <div className='header-with-time'>
                <div className='animation white'></div>
                <div className='animation white'></div>
            </div>
            
            <br/><br/>

            <span className='single-row' style={{columnGap: '15px'}}>
                <div className='animation white' style={{animationDelay: '.25s'}}></div>
                <FontAwesomeIcon className='animation' style={{transform: 'translateY(10%)', animationDelay: '.25s'}} icon={faRightLong} />
                <div className='animation white' style={{animationDelay: '.25s'}}></div>
            </span>

            <div className='animation white input' style={{animationDelay: '.5s'}}></div>

            <div className='animation white input' style={{height: '18rem', animationDelay: '.75s'}}></div>

            <br/>
            
            <div className='single-row' style={{justifyContent: 'space-evenly'}}>
                <div className='animation white' style={{width: '25%', height: '2rem', animationDelay: '1s'}}></div>
                <div className='animation white' style={{width: '25%', height: '2rem', animationDelay: '1s'}}></div>
                <div className='animation white' style={{width: '25%', height: '2rem', animationDelay: '1s'}}></div>
            </div>

        </section>
        

        return card
    }

    if ( type === 'season' ) {
        return(
            <section className='section'>
                <h2 className='section-heading fade-in-out-border'>Kalendár</h2>

                {
                    cards(6)
                }
                
                <h2 className='section-heading fade-in-out-border'>Súpiska</h2>

                <div className='team-members-grid'>
                    {
                        teams(6)
                    }
                </div>
            </section>
        )
    }

    if ( type === 'race overview' ) return(
        <section>
            <h2 className='section-heading fade-in-out-border'>Súpiska</h2>

            {
                teams(6)
            }
        </section>
    )

    if ( type === 'rules' ) return(
        <section className='section' style={{width: '100%'}}>
            <br/><br/>

            <h2 className='section-heading fade-in-out-border'>Pravidlá</h2>
            
            {
                rules(4)
            }

        </section>
    )

    return null

    
}