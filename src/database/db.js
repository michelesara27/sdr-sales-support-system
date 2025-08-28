let db = null;

export const initializeDatabase = async () => {
  try {
    // Dynamically import sql.js to handle ESM compatibility
    const sqljsModule = await import('sql.js');
    const initSqlJs = sqljsModule.default || sqljsModule;
    
    const SQL = await initSqlJs();
    
    db = new SQL.Database();
    
    // Criar tabelas
    db.run(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER,
        lead_name TEXT NOT NULL,
        lead_email TEXT,
        location TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id INTEGER,
        content TEXT NOT NULL,
        is_ai BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversations (id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS company_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_name TEXT DEFAULT 'Sua Empresa',
        settings TEXT DEFAULT '{}'
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS collaborators (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Inserir dados iniciais
    const companyExists = db.exec("SELECT * FROM company_settings");
    if (companyExists.length === 0) {
      db.run("INSERT INTO company_settings (company_name) VALUES ('Sua Empresa')");
    }

    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    // Fallback to in-memory database without WebAssembly
    db = {
      exec: () => [],
      run: () => {},
      export: () => new Uint8Array()
    };
    return db;
  }
};

export const getDatabase = () => db;

export const saveToLocalStorage = () => {
  if (db && typeof db.export === 'function') {
    try {
      const data = db.export();
      localStorage.setItem('sdr_database', JSON.stringify(Array.from(data)));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
};

export const loadFromLocalStorage = async () => {
  const stored = localStorage.getItem('sdr_database');
  if (stored) {
    try {
      const sqljsModule = await import('sql.js');
      const initSqlJs = sqljsModule.default || sqljsModule;
      const SQL = await initSqlJs();
      const data = new Uint8Array(JSON.parse(stored));
      db = new SQL.Database(data);
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      db = await initializeDatabase();
    }
  }
  return db;
};
