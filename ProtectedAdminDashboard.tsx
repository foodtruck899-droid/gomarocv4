import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRequireAdmin } from "@/hooks/useAuth";
import AdminDashboard from "@/pages/AdminDashboard";

const ProtectedAdminDashboard = () => {
  const { user, loading, isAdmin } = useRequireAdmin();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null; // Le hook useRequireAdmin redirige automatiquement
  }

  return <AdminDashboard />;
};

export default ProtectedAdminDashboard;