import Link from "next/link";

export default function HomePage() {
  return (
    <div >
      <h1>BikeBuddy</h1>
      <p>
        An app for riders (MTB, Gravel, Road) to plan and join rides in their area.
      </p>
      <p>
          Join BikeBuddy today.
          <Link href="/signup">
            <button>Sign Up</button>
          </Link>
      </p>
        <p>
          Already have an account?
          <Link href="/login">
            <button>Log In</button>
          </Link>

      </p>
    </div>
  );
}
