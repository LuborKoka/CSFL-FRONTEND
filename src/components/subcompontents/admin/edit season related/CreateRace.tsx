import React, { useRef, useState } from 'react';
import Select, { SingleValue, StylesConfig } from 'react-select';
import { Race } from './Schedule';
import { DARK, DARKBLUE, LIGHT, RED } from "../../../../constants";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import ReactSwitch from 'react-switch';
import useThemeContext from '../../../../hooks/useThemeContext';
import { hexToRgba } from '../../user/AddReport';

type Props = {
    options: {
        label: string,
        value: string
    }[],
    racesList: Race[],
    elementID: string,
    deleteForm: (elementID: string) => void
}

type Option = {
    label: string,
    value: string
}

export default function CreateRace({ options, racesList, elementID, deleteForm }: Props) {
    const data = useRef<Race>({trackID: '', timestamp: '', id: elementID, hasSprint: false})
    const [isChecked, setIsChecked] = useState(false)

    const [isDarkTheme] = useThemeContext()

    function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
        data.current = {...data.current, timestamp: e.target.value}
        submitForm()
    }

    function handleRaceInput(v: SingleValue<Option>) {
        if ( v === null ) return
        data.current = {...data.current, trackID: v.value}
        submitForm()
    }

    function submitForm() {
        if ( data.current.trackID === '' || data.current.timestamp === '' ) return
        const race = racesList.find(r => r.id === elementID)

        if ( race === undefined ) {
            racesList.push(data.current)
            return
        }
        
        race.trackID = data.current.trackID
        race.timestamp = data.current.timestamp
        race.hasSprint = data.current.hasSprint
    }

    function handleSprintInput(checked: boolean) {
        setIsChecked(checked)
        data.current.hasSprint = checked
        submitForm()
    }


    return(
        <div className='new-race fade-in-out-border'>

            <Select onChange={handleRaceInput} isMulti={false} options={options} styles={selectSingleValueStyles(isDarkTheme)} placeholder='Vyber veľkú cenu' />
                
            <div className='two-columns' style={{marginTop: '2rem'}}>
               <div className='center'>

                    <label className='center clickable-button' style={{columnGap: '2rem', opacity: isChecked ? '1' : '.7'}}>
                        <b style={{fontSize: '20px'}}>
                            Šprint
                        </b>
                        <ReactSwitch onChange={handleSprintInput}  checked={isChecked} offColor={DARKBLUE} />
                    </label>

               </div>

                <div className='date-time-picker'>
                    <input onChange={handleInput} className={`input-date ${isDarkTheme ? 'dark-bg light-text' : 'light-bg dark-text'}`} type='datetime-local'/>
                    <FontAwesomeIcon icon={faCaretDown} />
                </div>
            </div>
            <div className='top-right'>
                <FontAwesomeIcon icon={faTrashAlt} className='close-icon' onClick={() => deleteForm(elementID)} />
            </div>
        </div>
    )
}



export function selectSingleValueStyles(isDarkTheme: boolean, boxShadowColor?: string) {
    const defaultTextColor = isDarkTheme ? LIGHT : DARK
    const defaultBgColor = isDarkTheme ? DARK : LIGHT
    const shadowColor = boxShadowColor || hexToRgba(defaultTextColor, .4)

    const selectSingleValueStyles: StylesConfig<Option, false> = {
        control: (styles) => {
            return {
                ...styles,
                cursor: 'text',
                backgroundColor: 'transparent',
                border: 'none',
                boxShadow: `0px 0px 8px ${shadowColor}`,
                padding: '3px 10px',
                fontSize: '20px',
                minWidth: '320px'
            }
        },
        placeholder: styles => {
            return {
                ...styles,
                color: defaultTextColor,
                opacity: '.7'
            }
        },
        input: styles => {
            return {
                ...styles,
                color: defaultTextColor
            }
        },
        option: (styles) => {
            return {
                ...styles,
                backgroundColor: defaultTextColor,
                color: defaultBgColor,
            transition: 'all .2s',
                cursor: 'pointer',
                ':hover': {
                    color: defaultTextColor,
                    backgroundColor: defaultBgColor
                }
            }
        },
        dropdownIndicator: (styles) => {
            return {
                ...styles,
                cursor: 'pointer',
                color: defaultTextColor,
                opacity: .8,
                ':hover': {
                    opacity: 1
                }
            };
        },
        clearIndicator: (styles) => {
            return {
                ...styles,
                cursor: 'pointer',
                backgroundColor: 'transparent',
                color: RED,
                transition: 'all .2s',
                borderRadius: '3px',
                transform: 'scale(.8)',
                border: '1.5px solid transparent',
                ':hover': {
                    borderColor: RED
                }
            }
        },
        singleValue: styles => {
            return {
                ...styles,
                color: defaultTextColor
            }
        }
    };

    return selectSingleValueStyles
}