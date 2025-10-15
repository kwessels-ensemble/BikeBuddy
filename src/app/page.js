"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

export default function HomePage() {
  const { authUser, setAuthUser, authLoading } = useAuth();

  return (
    <div className='container'>

      <h1>BikeBuddy</h1>
      <div className='card'>
        <p>
        An app for riders (MTB, Gravel, Road) to plan and join rides in their area.
        </p>

        {!authUser &&
          <>
            <p>
              Join BikeBuddy today.          <Link href="/signup">
                <button className='btn-primary'>Sign Up</button>
              </Link>
            </p>
              <p>
                Already have an account?          <Link href="/login">
                  <button className='btn-primary'>Log In</button>
                </Link>

            </p>
          </>
        }
      </div>


    </div>
  );
}
