// Page supprimée pour des raisons de sécurité (ne pas restaurer en production)
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export const DebugAdminPage: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => { navigate('/', { replace: true }); }, [navigate]);
  return null;
};
