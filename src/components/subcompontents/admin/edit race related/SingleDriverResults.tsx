import { useState, useEffect } from "react"

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
            saveResult(driverID, resultTime, plusLaps)  
    }

    function handlePlusLapsChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPlusLaps(e.target.valueAsNumber)
        saveResult(driverID, resultTime, plusLaps)  
    }


    useEffect(() => {
        saveResult(driverID, resultTime, plusLaps)
    }, [resultTime, plusLaps, driverID, saveResult])

    return(
        <div>
            <div className='labeled-input' key={driverID}>
                <input name={driverName} className='form-input' type="text" required value={resultTime}
                style={{color: color, boxShadow: `0 0 10px 5px ${color}`}}  onChange={handleChange} />
            
                <label style={{color: color}} htmlFor={driverName}>{driverName}</label>
            </div>

            <input type='number' min={0} value={plusLaps} onChange={handlePlusLapsChange}  />
        </div> 
    )
}