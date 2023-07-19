import React from "react";

type Props = {
    verdict: string,
    penalties: {
        driverID: string,
        driverName: string,
        time: number,
        penaltyPoints: number
    }[]
}

export default function ReportVerdict({ verdict, penalties }: Props) {

    return(
        <div>
            <pre>{verdict}</pre>
            {
                penalties.map(p => 
                <div key={p.driverID}>
                    Driver: {p.driverName}
                    Čas: { p.time < 0 ? p.time : `+${p.time}`}
                    Trestné body: {p.penaltyPoints}
                </div>)
            }
        </div>
    )
}