import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SiteContent {
  section: string;
  key: string;
  value: string;
  content_type: string;
}

export const useSiteContent = () => {
  const [content, setContent] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*');

      if (error) {
        console.error('Error loading site content:', error);
        return;
      }

      // Organiser le contenu par section puis par clé
      const organizedContent: Record<string, Record<string, string>> = {};
      
      data?.forEach((item: SiteContent) => {
        if (!organizedContent[item.section]) {
          organizedContent[item.section] = {};
        }
        organizedContent[item.section][item.key] = item.value;
      });

      setContent(organizedContent);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const getContent = (section: string, key: string, defaultValue: string = '') => {
    return content[section]?.[key] || defaultValue;
  };

  return { content, loading, getContent, refreshContent: loadContent };
};