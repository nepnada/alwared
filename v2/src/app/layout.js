import "./globals.css";

export const metadata = {
  title: "Alwarid — Know the Patient in Seconds",
  description: "Alwarid est une plateforme innovante d'aide à la décision médicale avec visualisation 3D anatomique pour les professionnels de santé de la région Fès-Meknès.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  );
}
