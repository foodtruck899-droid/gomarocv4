import { useState, useId } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  label: string;
  folder?: string;
}

const ImageUploader = ({ currentImageUrl, onImageUploaded, label, folder = 'general' }: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
  const { toast } = useToast();
  const inputId = useId(); // ID unique pour éviter les conflits

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Vous devez sélectionner une image à uploader.');
      }

      const file = event.target.files[0];
      
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        throw new Error('Le fichier doit être une image.');
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('L\'image ne doit pas dépasser 5MB.');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      console.log('Uploading file:', fileName);

      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Obtenir l'URL publique
      const { data } = supabase.storage
        .from('site-images')
        .getPublicUrl(fileName);

      const publicUrl = data.publicUrl;
      console.log('Image uploaded successfully:', publicUrl);
      
      setPreviewUrl(publicUrl);
      onImageUploaded(publicUrl);

      toast({
        title: "Image uploadée",
        description: "L'image a été uploadée avec succès.",
      });

      // Reset l'input pour permettre de re-sélectionner le même fichier
      if (event.target) {
        event.target.value = '';
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Erreur d'upload",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreviewUrl('');
    onImageUploaded('');
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      
      {previewUrl ? (
        <div className="relative inline-block">
          <img
            src={previewUrl}
            alt="Aperçu"
            className="w-32 h-32 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={removeImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="w-32 h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
          <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Input
          type="file"
          accept="image/*"
          onChange={uploadImage}
          disabled={uploading}
          className="hidden"
          id={inputId}
        />
        <Label
          htmlFor={inputId}
          className="cursor-pointer"
        >
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            asChild
          >
            <span className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>{uploading ? 'Upload en cours...' : 'Choisir une image'}</span>
            </span>
          </Button>
        </Label>
      </div>
      
      {uploading && (
        <div className="text-sm text-muted-foreground">
          Upload en cours, veuillez patienter...
        </div>
      )}
    </div>
  );
};

export default ImageUploader;