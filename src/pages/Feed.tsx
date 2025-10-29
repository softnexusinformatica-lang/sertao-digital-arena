import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Flame, LogOut, Smile, Users, Trophy } from "lucide-react";

interface Profile {
  id: string;
  apelido: string;
  nome_completo: string | null;
  bandeira: string | null;
  biografia: string | null;
  nivel_respeito: number;
  foto_url: string | null;
}

interface Post {
  id: string;
  conteudo: string;
  created_at: string;
  user_id: string;
  profiles: Profile;
}

const Feed = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check auth and get user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/entrar");
        return;
      }
      setUser(session.user);
      loadProfile(session.user.id);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/entrar");
        return;
      }
      setUser(session.user);
      if (!profile) {
        loadProfile(session.user.id);
      }
    });

    loadPosts();

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error("Erro ao carregar perfil:", error);
    }
  };

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles (
            id,
            apelido,
            nome_completo,
            bandeira,
            biografia,
            nivel_respeito,
            foto_url
          )
        `)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      toast.error("Erro ao carregar posts", {
        description: error.message,
      });
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim() || !user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("posts")
        .insert({
          user_id: user.id,
          conteudo: newPost.trim(),
          tipo: "texto",
        });

      if (error) throw error;

      setNewPost("");
      toast.success("Post criado! Arretado! 🔥");
      loadPosts();
    } catch (error: any) {
      toast.error("Erro ao criar post", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Até logo, cabra! 👋");
    navigate("/");
  };

  const getInitials = (apelido: string) => {
    return apelido.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "agora";
    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-black bg-gradient-sertao bg-clip-text text-transparent">
              PORTELLA
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {profile && (
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <Trophy className="w-4 h-4 text-gold" />
                <span className="font-bold text-gold">{profile.nivel_respeito}</span>
                <span className="text-muted-foreground">respeito</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Card */}
        {profile && (
          <Card className="mb-6 shadow-sertao">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-primary">
                  <AvatarImage src={profile.foto_url || undefined} />
                  <AvatarFallback className="bg-gradient-sertao text-primary-foreground text-lg font-bold">
                    {getInitials(profile.apelido)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{profile.apelido}</h2>
                  {profile.bandeira && (
                    <p className="text-sm text-muted-foreground italic">
                      "{profile.bandeira}"
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Trophy className="w-4 h-4 text-gold" />
                      <span className="font-bold text-gold">{profile.nivel_respeito}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Nível: Cabra
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Create Post */}
        <Card className="mb-6 shadow-sertao">
          <CardContent className="pt-6">
            <Textarea
              placeholder="Cabra, o que você tem a dizer hoje?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-[100px] mb-4 resize-none"
              maxLength={1000}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {newPost.length}/1000
              </span>
              <Button
                onClick={handleCreatePost}
                disabled={loading || !newPost.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                {loading ? "Postando..." : "Postar"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Flame className="w-6 h-6 text-primary" />
            Feed Raiz
          </h2>

          {posts.length === 0 ? (
            <Card className="shadow-sertao">
              <CardContent className="py-12 text-center">
                <Smile className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Nenhum post ainda. Seja o primeiro a quebrar o silêncio!
                </p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="shadow-sertao hover:shadow-glow transition-all">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10 border border-primary/20">
                      <AvatarImage src={post.profiles.foto_url || undefined} />
                      <AvatarFallback className="bg-gradient-sertao text-primary-foreground text-sm font-bold">
                        {getInitials(post.profiles.apelido)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{post.profiles.apelido}</span>
                        <span className="text-xs text-muted-foreground">
                          · {formatDate(post.created_at)}
                        </span>
                      </div>
                      {post.profiles.bandeira && (
                        <p className="text-xs text-muted-foreground italic">
                          "{post.profiles.bandeira}"
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Trophy className="w-4 h-4 text-gold" />
                      <span className="font-bold text-gold">
                        {post.profiles.nivel_respeito}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{post.conteudo}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
