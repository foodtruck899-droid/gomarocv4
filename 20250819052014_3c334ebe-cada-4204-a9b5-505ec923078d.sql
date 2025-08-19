-- Corriger les fonctions avec search_path sécurisé
CREATE OR REPLACE FUNCTION public.generate_gift_card_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Générer un code de 12 caractères
    code := upper(substring(md5(random()::text) from 1 for 4) || '-' || 
                  substring(md5(random()::text) from 1 for 4) || '-' || 
                  substring(md5(random()::text) from 1 for 4));
    
    -- Vérifier si le code existe déjà
    SELECT EXISTS(SELECT 1 FROM gift_cards WHERE gift_cards.code = code) INTO exists_check;
    
    -- Si le code n'existe pas, on peut l'utiliser
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN code;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_gift_card_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.code IS NULL OR NEW.code = '' THEN
    NEW.code = generate_gift_card_code();
  END IF;
  RETURN NEW;
END;
$$;