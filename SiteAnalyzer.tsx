import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Brain, Bug, Lightbulb, Star, AlertTriangle, CheckCircle2, Loader2, Globe, Shield, Eye, X, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface AnalysisResult {
  bugs: string[];
  suggestions: string[];
  score: string;
  priority_fixes: string[];
  positive_aspects: string[];
  site_coverage: string[];
  admin_analysis?: string[];
  critiques?: string[];
}

export function SiteAnalyzer() {
  const { user, isAdmin } = useAuth();

  // Si pas connecté ou pas admin, ne pas afficher l'analyseur  
  if (!user || !isAdmin) {
    return null;
  }

  // Analyseur désactivé
  return null;
}