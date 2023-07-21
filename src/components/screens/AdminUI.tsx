import React from "react";
import CreateSchedule from "../subcompontents/admin/CreateSchedule";
import AdminSeasons from "../subcompontents/admin/AdminSeasons";


export default function AdminUI() {

    return(
        <div className="section">
           {/*} <CreateSchedule />*/ }
           <AdminSeasons />
           <CreateSchedule />
            
        </div>
    )
}