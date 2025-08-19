import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PageSection {
  id: string;
  order: number;
  name: string;
  enabled: boolean;
  component: string;
}

export const usePageOrder = () => {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPageOrder();
  }, []);

  const loadPageOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', 'page_order')
        .order('key');

      if (error) throw error;

      const sectionsData = data?.map(item => {
        const content = JSON.parse(item.value || '{}');
        return {
          id: item.id,
          order: content.order || 0,
          name: content.name || '',
          enabled: content.enabled !== false,
          component: content.component || ''
        };
      }) || [];

      // Trier par ordre
      sectionsData.sort((a, b) => a.order - b.order);
      setSections(sectionsData);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'ordre des pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEnabledSections = () => {
    return sections.filter(section => section.enabled);
  };

  return {
    sections: getEnabledSections(),
    loading,
    refresh: loadPageOrder
  };
};

export default usePageOrder;