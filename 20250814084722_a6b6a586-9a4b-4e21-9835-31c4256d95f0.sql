-- Nettoyer les doublons de destinations pour Bordeaux
-- D'abord, mettre à jour toutes les routes qui utilisent l'ancienne destination "bordeaux"
UPDATE routes 
SET origin_id = '45a0832c-06bd-4379-90a2-1574a120b9db'
WHERE origin_id = 'c2a61c7b-a853-4036-9c79-fcae3a45291a';

UPDATE routes 
SET destination_id = '45a0832c-06bd-4379-90a2-1574a120b9db'
WHERE destination_id = 'c2a61c7b-a853-4036-9c79-fcae3a45291a';

-- Mettre à jour le nom de la route
UPDATE routes 
SET name = 'Bordeaux → Rabat'
WHERE name = 'bordeaux → Rabat';

-- Supprimer la destination en doublon "bordeaux"
DELETE FROM destinations 
WHERE id = 'c2a61c7b-a853-4036-9c79-fcae3a45291a' AND name = 'bordeaux';