import * as SQLite from 'expo-sqlite';

let db;

export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync('jobs.db');
    
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id INTEGER PRIMARY KEY,
        job_id TEXT UNIQUE,
        title TEXT,
        location TEXT,
        salary_min INTEGER,
        salary_max INTEGER,
        phone TEXT,
        job_type TEXT,
        company_name TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Database initialized');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

export const addBookmark = async (job) => {
  try {
    await db.runAsync(
      `INSERT OR REPLACE INTO bookmarks 
       (job_id, title, location, salary_min, salary_max, phone, job_type, company_name, description) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        job.id?.toString() || '',
        job.title || '',
        job.primary_details?.Place || '',
        job.salary_min || 0,
        job.salary_max || 0,
        job.whatsapp_no || job.contact_preference?.whatsapp_link || '',
        job.job_type || '',
        job.company_name || '',
        job.other_details || ''
      ]
    );
    console.log('Bookmark added');
  } catch (error) {
    console.error('Error adding bookmark:', error);
    throw error;
  }
};

export const removeBookmark = async (jobId) => {
  try {
    await db.runAsync('DELETE FROM bookmarks WHERE job_id = ?', [jobId.toString()]);
    console.log('Bookmark removed');
  } catch (error) {
    console.error('Error removing bookmark:', error);
    throw error;
  }
};

export const getBookmarks = async () => {
  try {
    const result = await db.getAllAsync('SELECT * FROM bookmarks ORDER BY created_at DESC');
    return result;
  } catch (error) {
    console.error('Error getting bookmarks:', error);
    return [];
  }
};

export const isBookmarked = async (jobId) => {
  try {
    const result = await db.getFirstAsync(
      'SELECT id FROM bookmarks WHERE job_id = ?', 
      [jobId.toString()]
    );
    return !!result;
  } catch (error) {
    console.error('Error checking bookmark:', error);
    return false;
  }
};