// src/services/database.js
import * as SQLite from 'expo-sqlite';

class DatabaseService {
  constructor() {
    this.db = null;
    this.isInitialized = false;
    this.initPromise = null;
  }

  async initDatabase() {
    // Prevent multiple initialization calls
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this._initializeDatabase();
    return this.initPromise;
  }

  async _initializeDatabase() {
    try {
      if (this.isInitialized && this.db) {
        return this.db;
      }

      console.log('Initializing database...');
      this.db = await SQLite.openDatabaseAsync('jobs.db');
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS bookmarks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          job_id TEXT UNIQUE NOT NULL,
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

      // Create index for faster lookups
      await this.db.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_job_id ON bookmarks(job_id);
      `);

      this.isInitialized = true;
      console.log('Database initialized successfully');
      return this.db;
    } catch (error) {
      console.error('Database initialization error:', error);
      this.isInitialized = false;
      this.db = null;
      throw error;
    }
  }

  async ensureInitialized() {
    if (!this.isInitialized || !this.db) {
      await this.initDatabase();
    }
    return this.db;
  }

  async addBookmark(job) {
    try {
      const db = await this.ensureInitialized();
      
      if (!job.id) {
        throw new Error('Job ID is required');
      }

      const result = await db.runAsync(
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

      console.log('Bookmark added successfully', result);
      return result;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
  }

  async removeBookmark(jobId) {
    try {
      const db = await this.ensureInitialized();
      
      if (!jobId) {
        throw new Error('Job ID is required');
      }

      const result = await db.runAsync(
        'DELETE FROM bookmarks WHERE job_id = ?', 
        [jobId.toString()]
      );

      console.log('Bookmark removed successfully', result);
      return result;
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
  }

  async getBookmarks() {
    try {
      const db = await this.ensureInitialized();
      
      const result = await db.getAllAsync(
        'SELECT * FROM bookmarks ORDER BY created_at DESC'
      );

      console.log(`Retrieved ${result.length} bookmarks`);
      return result || [];
    } catch (error) {
      console.error('Error getting bookmarks:', error);
      return [];
    }
  }

  async isBookmarked(jobId) {
    try {
      const db = await this.ensureInitialized();
      
      if (!jobId) {
        return false;
      }

      const result = await db.getFirstAsync(
        'SELECT id FROM bookmarks WHERE job_id = ? LIMIT 1',
        [jobId.toString()]
      );

      return !!result;
    } catch (error) {
      console.error('Error checking bookmark:', error);
      return false;
    }
  }

  async clearAllBookmarks() {
    try {
      const db = await this.ensureInitialized();
      
      const result = await db.runAsync('DELETE FROM bookmarks');
      console.log('All bookmarks cleared');
      return result;
    } catch (error) {
      console.error('Error clearing bookmarks:', error);
      throw error;
    }
  }

  async getBookmarkCount() {
    try {
      const db = await this.ensureInitialized();
      
      const result = await db.getFirstAsync('SELECT COUNT(*) as count FROM bookmarks');
      return result?.count || 0;
    } catch (error) {
      console.error('Error getting bookmark count:', error);
      return 0;
    }
  }

  // Method to close database connection (useful for cleanup)
  async closeDatabase() {
    try {
      if (this.db) {
        await this.db.closeAsync();
        this.db = null;
        this.isInitialized = false;
        this.initPromise = null;
        console.log('Database connection closed');
      }
    } catch (error) {
      console.error('Error closing database:', error);
    }
  }
}

// Create a singleton instance
const databaseService = new DatabaseService();

// Export the methods for backward compatibility
export const initDatabase = () => databaseService.initDatabase();
export const addBookmark = (job) => databaseService.addBookmark(job);
export const removeBookmark = (jobId) => databaseService.removeBookmark(jobId);
export const getBookmarks = () => databaseService.getBookmarks();
export const isBookmarked = (jobId) => databaseService.isBookmarked(jobId);
export const clearAllBookmarks = () => databaseService.clearAllBookmarks();
export const getBookmarkCount = () => databaseService.getBookmarkCount();
export const closeDatabase = () => databaseService.closeDatabase();

// Export the service instance if needed
export default databaseService;