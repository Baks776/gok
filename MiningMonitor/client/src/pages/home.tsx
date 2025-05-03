import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="text-center">
        <div className="mx-auto mb-8 w-48 h-48">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" fill="#333333"/>
            <path d="M20 10H30V90H20V10Z" fill="#FF0000"/>
            <path d="M35 10H85V30H35V10Z" fill="#FFFFFF"/>
            <path d="M35 40H75V60H35V40Z" fill="#FFFFFF"/>
            <path d="M35 70H65V90H35V70Z" fill="#FFFFFF"/>
          </svg>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Луховицкий горно-обогатительный комбинат</h1>
        <p className="text-xl mb-8 text-muted-foreground">
          Луховицкий горно-обогатительный комбинат - ваш надежный партнер в сфере производства и поставок высококачественного щебня!м
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-accent text-white px-6 py-2">
            <Link href="/inventory">Начать работу</Link>
          </Button>
          <Button asChild variant="outline" className="px-6 py-2">
            <Link href="/about">О компании</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}