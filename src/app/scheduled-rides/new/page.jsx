"use client";
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import NewScheduledRide from '@/components/Rides/ScheduledRide/NewScheduledRide';


// import { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import axios from "axios";
// import { DateTime } from "luxon";
// import ScheduledRideForm from "@/components/Rides/ScheduledRide/ScheduledRideForm";
// import Spinner from "@/components/Spinner/Spinner";


// export const metadata = {
//   title: "Schedule New Ride",
//   description: "Schedule a ride and make public for others to join."
// };



export default function ScheduleNewRide() {

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NewScheduledRide></NewScheduledRide>
        </Suspense>
    )
}

