import { useState, useEffect } from "react"
import { DARKBLUE } from "../../../../constants"

type Props = {
    driverID: string,
    color: string,
    time: string | null,
    driverName: string,
    saveResult: (driverID: string, resultTime: string, plusLaps: number) => void
}

export default function SingleDriverResult({ driverID, driverName, color, time, saveResult}: Props) {
    const [resultTime, setResultTime] = useState(time || '')
    const [plusLaps, setPlusLaps] = useState(0)

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
            setResultTime(e.target.value)        
    }

    function handlePlusLapsChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPlusLaps(e.target.valueAsNumber)
    }


    useEffect(() => {
        saveResult(driverID, resultTime, plusLaps)
    }, [resultTime, plusLaps, driverID, saveResult])

    return(
        <div>
            <div className='labeled-input'>
                <input name={driverName} className='form-input' type="text" required value={resultTime}
                style={{color: color, boxShadow: `0 0 10px 5px ${color}`}}  onChange={handleChange} />
            
                <label style={{color: color}} htmlFor={driverName}>{driverName}</label>
            </div>

            <br/>
            <div className='labeled-input' style={{marginTop: '10px'}}>
                <input type='number' name={`${driverName}plus-laps`} className='form-input' min={0} 
                style={{color: color, boxShadow: `0 0 10px 5px ${color}`}} value={plusLaps} onChange={handlePlusLapsChange}  />

                <label style={{color: color}} htmlFor={`${driverName}plus-laps`}>Kolá pozadu</label>
            </div>
        </div> 
    )
}
