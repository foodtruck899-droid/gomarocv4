import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const whatsappNumber = "+33759249632"; // Le numéro de téléphone depuis l'image
  const message = "Bonjour, j'aimerais obtenir des informations sur vos voyages en bus.";
  
  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      className="fixed bottom-4 right-4 z-50 rounded-full w-14 h-14 p-0 bg-green-500 hover:bg-green-600 shadow-lg"
      title="Contactez-nous sur WhatsApp"
    >
      <MessageCircle className="h-7 w-7 text-white" />
    </Button>
  );
};

export default WhatsAppButton;