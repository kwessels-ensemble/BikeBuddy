"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import Spinner from "@/components/Spinner/Spinner";

export default function HomePage() {
  const { authUser, setAuthUser, authLoading } = useAuth();

  if (authLoading) {
    return (
        <div className='loading-container'>
            <Spinner></Spinner>
        </div>
    )
  }

  return (
    <div className='container'>

      {/* <h1>🚲 BikeBuddy</h1> */}
      <h4 className='home-description'>
        An app for riders (MTB, Gravel, Road) to plan and join rides in their area.
      </h4>
      <div>
        {!authUser &&
          <div className='home-actions'>
            <div className='home-action-card'>
              <span>Join BikeBuddy today</span>
              <Link href="/signup">
                  <button className='btn-primary'>Sign Up</button>
              </Link>
            </div>

            <div className='home-action-card'>
              <span> Already have an account? </span>
              <Link href="/login">
                <button className='btn-primary'>Log In</button>
              </Link>
            </div>
          </div>
        }


        {authUser &&
          <div className='home-actions'>

            <div className='home-action-card'>
              <span> Browse and add to your personal saved rides </span>
              <Link href="/saved-rides">
                <button className='btn-primary'>Saved Rides</button>
              </Link>
            </div>

            <div className='home-action-card'>
              <span> Schedule public or private rides </span>
              <Link href="/scheduled-rides">
                    <button className='btn-primary'>Scheduled Rides</button>
              </Link>
            </div>

            <div className='home-action-card'>
              <span> Check out the public ride feed and join rides in your area </span>
              <Link href="/ride-feed">
                  <button className='btn-primary'>Ride Feed</button>
              </Link>
            </div>
          </div>
        }
      </div>


    </div>
  );
}
