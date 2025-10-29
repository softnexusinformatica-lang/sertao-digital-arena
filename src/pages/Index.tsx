import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-sertao.jpg";
import { Flame, Swords, Users, Trophy } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        </div>
        
        {/* Dust particles animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-muted/30 rounded-full animate-dust-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
          <div className="mb-6">
            <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-4">
              <span className="bg-gradient-sertao bg-clip-text text-transparent">
                PORTELLA
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 font-medium">
              O Sertão Digital
            </p>
          </div>
          
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Bem-vindo à Portella. Aqui, o silêncio é covardia e a palavra é arma. 
            Cada cabra tem seu canto, cada ideia, sua peleja.
            <br />
            <span className="text-primary font-semibold">É o sertão, agora em bytes — quente, vivo e arretado.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/entrar">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-glow px-8 py-6 text-lg">
                Entrar na Portella
              </Button>
            </Link>
            <Link to="/sobre">
              <Button size="lg" variant="outline" className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-bold px-8 py-6 text-lg">
                Conheça a Rede
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">
            Raiz, Coragem e Presença
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card rounded-lg p-6 shadow-sertao border border-border hover:shadow-glow transition-all">
              <div className="w-12 h-12 bg-gradient-sertao rounded-lg flex items-center justify-center mb-4">
                <Flame className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-card-foreground">Feed Raiz</h3>
              <p className="text-muted-foreground">
                Sem algoritmo viciado. Cronológico e justo. Sua voz, sua vez.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sertao border border-border hover:shadow-glow transition-all">
              <div className="w-12 h-12 bg-gradient-sertao rounded-lg flex items-center justify-center mb-4">
                <Swords className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-card-foreground">Duelos Digitais</h3>
              <p className="text-muted-foreground">
                Desafie outros em pelejas de palavra. O povo decide quem vence.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sertao border border-border hover:shadow-glow transition-all">
              <div className="w-12 h-12 bg-gradient-sertao rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-card-foreground">Vilarejos</h3>
              <p className="text-muted-foreground">
                Comunidades temáticas criadas por você. Seu espaço, suas regras.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-sertao border border-border hover:shadow-glow transition-all">
              <div className="w-12 h-12 bg-gradient-sertao rounded-lg flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-card-foreground">Sistema de Honra</h3>
              <p className="text-muted-foreground">
                Ganhe respeito com coragem e criatividade. Seja Cangaceiro Digital.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-sertao">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary-foreground">
            O Sertão te Chama
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Crie sua conta e mostre que é cabra macho de verdade.
          </p>
          <Link to="/entrar">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold shadow-lg px-10 py-6 text-lg">
              Começar Agora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border bg-card">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2025 Portella. Raiz, coragem e presença — o resto é moda.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
