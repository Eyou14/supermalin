import React, { useContext } from 'react';
import { AppContext } from '../layouts/RootLayout';

export const AdminPage: React.FC = () => {
  const { user, isAdmin, userProfile } = useContext(AppContext);

  return (
    <pre style={{ padding: 20, fontSize: 14, whiteSpace: 'pre-wrap' }}>
      {JSON.stringify(
        {
          email: user?.email,
          userId: user?.id,
          isAdmin,
          userProfile,
        },
        null,
        2
      )}
    </pre>
  );
};