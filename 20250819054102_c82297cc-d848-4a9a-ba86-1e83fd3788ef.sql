-- Corriger la fonction qui génère les codes de cartes cadeaux
CREATE OR REPLACE FUNCTION public.generate_gift_card_code()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Générer un code de 12 caractères
    code := upper(substring(md5(random()::text) from 1 for 4) || '-' || 
                  substring(md5(random()::text) from 1 for 4) || '-' || 
                  substring(md5(random()::text) from 1 for 4));
    
    -- Vérifier si le code existe déjà avec une référence de table explicite
    SELECT EXISTS(SELECT 1 FROM public.gift_cards WHERE public.gift_cards.code = generate_gift_card_code.code) INTO exists_check;
    
    -- Si le code n'existe pas, on peut l'utiliser
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN code;
END;
$function$;

-- Corriger le trigger pour éviter l'ambiguïté
CREATE OR REPLACE FUNCTION public.set_gift_card_code()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.code IS NULL OR NEW.code = '' THEN
    NEW.code = public.generate_gift_card_code();
  END IF;
  RETURN NEW;
END;
$function$;

-- Recréer le trigger si nécessaire
DROP TRIGGER IF EXISTS set_gift_card_code_trigger ON public.gift_cards;
CREATE TRIGGER set_gift_card_code_trigger
  BEFORE INSERT ON public.gift_cards
  FOR EACH ROW
  EXECUTE FUNCTION public.set_gift_card_code();