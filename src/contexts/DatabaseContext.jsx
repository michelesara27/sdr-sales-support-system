import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeDatabase, loadFromLocalStorage, saveToLocalStorage, getDatabase } from '../database/db';

const DatabaseContext = createContext();

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

export const DatabaseProvider = ({ children }) => {
  const [db, setDb] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initDb = async () => {
      try {
        let database = await loadFromLocalStorage();
        if (!database) {
          database = await initializeDatabase();
        }
        setDb(database);
      } catch (error) {
        console.error('Error initializing database:', error);
        // Fallback to empty database object
        setDb({
          exec: () => [],
          run: () => {},
          export: () => new Uint8Array()
        });
      } finally {
        setLoading(false);
      }
    };

    initDb();
  }, []);

  const executeQuery = (sql, params = []) => {
    if (!db) return null;
    
    try {
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        const result = db.exec(sql, params);
        return result;
      } else {
        db.run(sql, params);
        saveToLocalStorage();
        return { changes: 1 }; // Simple success response
      }
    } catch (error) {
      console.error('Database error:', error);
      // Return empty result instead of throwing
      return [];
    }
  };

  const value = {
    db,
    executeQuery,
    loading
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};
