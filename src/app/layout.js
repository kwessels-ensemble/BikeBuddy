import NavBar from "@/components/Nav/NavBar"
import './global.css'
import { AuthProvider } from "@/app/context/AuthContext";

// note can later add functionality to show a specific ride name in title etc.
export const metadata = {
  title: {
    default: "BikeBuddy",
    template: "%s | BikeBuddy"
  },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🚲</text></svg>'
  },
  description: "Find and schedule rides in your area"
};

export default function RootLayout({ children }) {


  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <header>
            <NavBar></NavBar>
          </header>
          <main>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
