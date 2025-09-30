import NavBar from "@/components/NavBar"
import './global.css'


// note can later add functionality to show a specific ride name in title etc.
export const metadata = {
  title: {
    default: "BikeBuddy",
    template: "%s | BikeBuddy"
  },
  description: "Find and schedule rides in your area"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <NavBar></NavBar>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
