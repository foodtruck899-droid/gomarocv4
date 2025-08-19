import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X, Settings, Mic, MicOff } from "lucide-react";
import { useConversation } from "@11labs/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const AIAgent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [agentId, setAgentId] = useState("");
  const [isConfigured, setIsConfigured] = useState(false);
  const { toast } = useToast();

  const conversation = useConversation({
    onConnect: () => {
      toast({
        title: "Agent IA connecté",
        description: "Vous pouvez maintenant parler avec l'assistant.",
      });
    },
    onDisconnect: () => {
      toast({
        title: "Agent IA déconnecté",
        description: "La conversation a été terminée.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Problème de connexion avec l'agent IA.",
        variant: "destructive"
      });
      console.error("AI Agent error:", error);
    }
  });

  // Charger les préférences sauvegardées
  useEffect(() => {
    const savedVisibility = localStorage.getItem('ai-agent-visible');
    const savedApiKey = localStorage.getItem('elevenlabs-api-key');
    const savedAgentId = localStorage.getItem('elevenlabs-agent-id');
    
    // Par défaut, l'agent est caché pour les nouveaux utilisateurs
    setIsVisible(savedVisibility === 'true');
    
    if (savedApiKey && savedAgentId) {
      setApiKey(savedApiKey);
      setAgentId(savedAgentId);
      setIsConfigured(true);
    }
  }, []);

  const toggleVisibility = () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    localStorage.setItem('ai-agent-visible', newVisibility.toString());
    
    if (!newVisibility && conversation.status === 'connected') {
      conversation.endSession();
    }
  };

  const handleSaveConfig = () => {
    if (apiKey.trim() && agentId.trim()) {
      localStorage.setItem('elevenlabs-api-key', apiKey);
      localStorage.setItem('elevenlabs-agent-id', agentId);
      setIsConfigured(true);
      toast({
        title: "Configuration sauvegardée",
        description: "Votre agent IA est maintenant configuré.",
      });
    } else {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive"
      });
    }
  };

  const startConversation = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Utiliser l'agentId directement
      await conversation.startSession({ 
        agentId: agentId,
        authorization: `Bearer ${apiKey}`
      });
    } catch (error) {
      toast({
        title: "Erreur microphone",
        description: "L'accès au microphone est requis pour parler avec l'agent.",
        variant: "destructive"
      });
    }
  };

  const endConversation = async () => {
    await conversation.endSession();
  };

  // Bouton flottant pour afficher/masquer l'agent
  const FloatingToggle = () => (
    <Button
      onClick={toggleVisibility}
      className="fixed bottom-4 left-4 z-50 rounded-full w-12 h-12 p-0 bg-primary hover:bg-primary/90 shadow-lg"
      title={isVisible ? "Masquer l'agent IA" : "Afficher l'agent IA"}
    >
      {isVisible ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
    </Button>
  );

  if (!isVisible) {
    return <FloatingToggle />;
  }

  return (
    <>
      <FloatingToggle />
      
      {/* Widget de l'agent IA */}
      <div className="fixed bottom-20 left-4 z-40 w-80">
        <Card className="shadow-xl border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Assistant IA
            </CardTitle>
            <div className="flex gap-1">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Settings className="h-3 w-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Configuration ElevenLabs</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="api-key">Clé API ElevenLabs</Label>
                      <Input
                        id="api-key"
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="agent-id">ID de l'agent</Label>
                      <Input
                        id="agent-id"
                        value={agentId}
                        onChange={(e) => setAgentId(e.target.value)}
                        placeholder="agent_..."
                      />
                    </div>
                    <Button onClick={handleSaveConfig} className="w-full">
                      Sauvegarder
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? "▲" : "▼"}
              </Button>
            </div>
          </CardHeader>
          
          {!isMinimized && (
            <CardContent className="p-4 pt-0">
              {!isConfigured ? (
                <div className="text-center text-sm text-muted-foreground">
                  <p className="mb-2">Configurez votre agent IA dans les paramètres</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configurer
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Configuration ElevenLabs</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="api-key-2">Clé API ElevenLabs</Label>
                          <Input
                            id="api-key-2"
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="sk-..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="agent-id-2">ID de l'agent</Label>
                          <Input
                            id="agent-id-2"
                            value={agentId}
                            onChange={(e) => setAgentId(e.target.value)}
                            placeholder="agent_..."
                          />
                        </div>
                        <Button onClick={handleSaveConfig} className="w-full">
                          Sauvegarder
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Statut: {conversation.status === 'connected' ? 'Connecté' : 'Déconnecté'}
                    </span>
                    {conversation.isSpeaking && (
                      <span className="text-xs text-primary">🎤 Écoute...</span>
                    )}
                  </div>
                  
                  {conversation.status !== 'connected' ? (
                    <Button 
                      onClick={startConversation}
                      className="w-full"
                      size="sm"
                    >
                      <Mic className="h-4 w-4 mr-2" />
                      Démarrer conversation
                    </Button>
                  ) : (
                    <Button 
                      onClick={endConversation}
                      variant="destructive"
                      className="w-full"
                      size="sm"
                    >
                      <MicOff className="h-4 w-4 mr-2" />
                      Terminer conversation
                    </Button>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    Cliquez pour parler avec l'assistant vocal
                  </p>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
};

export default AIAgent;