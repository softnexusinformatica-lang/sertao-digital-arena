import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Flame, ArrowLeft } from "lucide-react";

const Sobre = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-black bg-gradient-sertao bg-clip-text text-transparent">
              PORTELLA
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <div>
            <h2 className="text-4xl font-bold mb-4">O Sertão Digital</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Portella é mais que uma rede social. É um território livre onde a palavra 
              tem peso, a coragem tem valor e o silêncio é covardia.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-bold text-foreground">Nossa Filosofia</h3>
            <p className="text-muted-foreground">
              Inspirada na força e autenticidade do Nordeste brasileiro, a Portella 
              celebra a identidade, o confronto saudável de ideias e a liberdade de 
              expressão. Aqui, cada cabra tem voz, cada peleja tem sua plateia, e 
              cada vitória é conquistada com mérito.
            </p>

            <h3 className="text-2xl font-bold text-foreground mt-8">O que te espera</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li>
                <strong className="text-foreground">Feed Raiz:</strong> Cronológico e justo. 
                Sem algoritmos manipulando o que você vê. Sua voz chega onde precisa chegar.
              </li>
              <li>
                <strong className="text-foreground">Duelos de Palavra:</strong> Desafie outros 
                em pelejas públicas. O povo decide quem tem razão. Honra se conquista, não se compra.
              </li>
              <li>
                <strong className="text-foreground">Sistema de Honra:</strong> Quanto mais você 
                participa com coragem e criatividade, mais respeito você ganha. Os melhores 
                viram Cangaceiros Digitais.
              </li>
              <li>
                <strong className="text-foreground">Vilarejos:</strong> Comunidades temáticas 
                onde você pode encontrar quem pensa parecido ou diferente — mas sempre com respeito.
              </li>
              <li>
                <strong className="text-foreground">Modo Feira:</strong> Uma vez por semana, o caos 
                criativo toma conta. Posts anônimos, humor sem filtro, desabafo livre.
              </li>
            </ul>

            <h3 className="text-2xl font-bold text-foreground mt-8">O Código do Cabra</h3>
            <ol className="space-y-3 text-muted-foreground list-decimal list-inside">
              <li>Fale com alma, fale com verdade.</li>
              <li>Respeite a peleja, não o adversário covarde.</li>
              <li>Ganhe honra com ação, não com conversa fiada.</li>
              <li>Defenda suas ideias, mas aceite o confronto justo.</li>
              <li>O silêncio aqui é covardia — mostre quem você é.</li>
            </ol>

            <div className="bg-gradient-sertao rounded-lg p-8 mt-12 text-center">
              <p className="text-2xl font-bold text-primary-foreground mb-4">
                "Raiz, coragem e presença — o resto é moda."
              </p>
              <Link to="/entrar">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold">
                  Entrar na Portella
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sobre;
