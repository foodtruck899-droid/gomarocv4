-- Créer la table des cartes cadeaux
CREATE TABLE public.gift_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  amount NUMERIC NOT NULL,
  initial_amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  status TEXT NOT NULL DEFAULT 'active',
  purchaser_email TEXT,
  purchaser_name TEXT,
  recipient_email TEXT,
  recipient_name TEXT,
  message TEXT,
  stripe_session_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE,
  redeemed_by_user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table des transactions de cartes cadeaux
CREATE TABLE public.gift_card_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gift_card_id UUID NOT NULL REFERENCES gift_cards(id),
  booking_id UUID REFERENCES bookings(id),
  amount NUMERIC NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'redemption', 'refund')),
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ajouter un champ gift_card_discount à la table bookings
ALTER TABLE public.bookings 
ADD COLUMN gift_card_discount NUMERIC DEFAULT 0,
ADD COLUMN gift_card_codes TEXT[];

-- Activer RLS
ALTER TABLE public.gift_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_card_transactions ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour gift_cards
CREATE POLICY "Tout le monde peut voir les cartes cadeaux publiques" 
ON public.gift_cards 
FOR SELECT 
USING (true);

CREATE POLICY "Admins peuvent gérer toutes les cartes cadeaux" 
ON public.gift_cards 
FOR ALL 
USING (get_current_user_role() = 'admin');

CREATE POLICY "Utilisateurs peuvent créer des cartes cadeaux" 
ON public.gift_cards 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Utilisateurs peuvent modifier leurs cartes cadeaux" 
ON public.gift_cards 
FOR UPDATE 
USING (purchaser_email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR get_current_user_role() = 'admin');

-- Politiques RLS pour gift_card_transactions
CREATE POLICY "Admins peuvent voir toutes les transactions" 
ON public.gift_card_transactions 
FOR SELECT 
USING (get_current_user_role() = 'admin');

CREATE POLICY "Utilisateurs peuvent voir leurs transactions" 
ON public.gift_card_transactions 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Tout le monde peut créer des transactions" 
ON public.gift_card_transactions 
FOR INSERT 
WITH CHECK (true);

-- Trigger pour updated_at
CREATE TRIGGER update_gift_cards_updated_at
BEFORE UPDATE ON public.gift_cards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Fonction pour générer un code de carte cadeau unique
CREATE OR REPLACE FUNCTION public.generate_gift_card_code()
RETURNS TEXT
LANGUAGE plpgsql
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

-- Trigger pour générer automatiquement le code
CREATE OR REPLACE FUNCTION public.set_gift_card_code()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.code IS NULL OR NEW.code = '' THEN
    NEW.code = generate_gift_card_code();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_gift_card_code_trigger
BEFORE INSERT ON public.gift_cards
FOR EACH ROW
EXECUTE FUNCTION public.set_gift_card_code();