import supabase from '../config/supabase.js';
import { dbLogger } from './logging.js';

// Query optimization utilities
export class DatabaseOptimizer {
  constructor() {
    this.queryCache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Generate cache key from query parameters
  generateCacheKey(table, query) {
    return `${table}:${JSON.stringify(query)}`;
  }

  // Check if cached result is still valid
  isCacheValid(timestamp) {
    return Date.now() - timestamp < this.cacheTimeout;
  }

  // Get cached query result
  getCachedResult(key) {
    const cached = this.queryCache.get(key);
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }
    return null;
  }

  // Cache query result
  setCachedResult(key, data) {
    this.queryCache.set(key, {
      data,
      timestamp: Date.now()
    });

    // Cleanup old cache entries
    if (this.queryCache.size > 100) {
      this.cleanupCache();
    }
  }

  // Remove expired cache entries
  cleanupCache() {
    const now = Date.now();
    for (const [key, value] of this.queryCache.entries()) {
      if (!this.isCacheValid(value.timestamp)) {
        this.queryCache.delete(key);
      }
    }
  }

  // Clear cache for specific table
  clearTableCache(table) {
    for (const [key] of this.queryCache.entries()) {
      if (key.startsWith(`${table}:`)) {
        this.queryCache.delete(key);
      }
    }
  }

  // Clear all cache
  clearAllCache() {
    this.queryCache.clear();
  }

  // Optimized query execution with caching
  async executeQuery(table, queryBuilder, useCache = true) {
    const startTime = Date.now();
    let cacheKey = null;

    try {
      // Generate cache key for SELECT queries
      if (useCache && queryBuilder.toString().toLowerCase().includes('select')) {
        cacheKey = this.generateCacheKey(table, queryBuilder.toString());
        const cachedResult = this.getCachedResult(cacheKey);
        
        if (cachedResult) {
          dbLogger.logQuery(`CACHED: ${queryBuilder}`, Date.now() - startTime, true);
          return cachedResult;
        }
      }

      // Execute query
      const result = await queryBuilder;
      const duration = Date.now() - startTime;

      // Log query performance
      dbLogger.logQuery(queryBuilder.toString(), duration, !result.error);
      
      // Log slow queries
      if (duration > 1000) {
        dbLogger.logSlowQuery(queryBuilder.toString(), duration);
      }

      // Cache successful SELECT results
      if (useCache && !result.error && cacheKey) {
        this.setCachedResult(cacheKey, result);
      }

      // Clear cache for write operations
      if (!queryBuilder.toString().toLowerCase().includes('select')) {
        this.clearTableCache(table);
      }

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      dbLogger.logQuery(queryBuilder.toString(), duration, false);
      throw error;
    }
  }

  // Batch operations for better performance
  async batchInsert(table, records, batchSize = 100) {
    const results = [];
    
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      const result = await this.executeQuery(
        table,
        supabase.from(table).insert(batch),
        false // Don't cache write operations
      );
      results.push(result);
    }
    
    return results;
  }

  // Optimized pagination
  async paginatedQuery(table, {
    page = 1,
    limit = 10,
    orderBy = 'created_at',
    ascending = false,
    filters = {},
    select = '*'
  }) {
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from(table)
      .select(select, { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order(orderBy, { ascending });

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query = query.eq(key, value);
      }
    });

    return this.executeQuery(table, query);
  }

  // Search with full-text search optimization
  async searchQuery(table, {
    searchTerm,
    searchColumns = [],
    page = 1,
    limit = 10,
    select = '*'
  }) {
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from(table)
      .select(select, { count: 'exact' })
      .range(offset, offset + limit - 1);

    // Apply text search across multiple columns
    if (searchTerm && searchColumns.length > 0) {
      const searchCondition = searchColumns
        .map(col => `${col}.ilike.%${searchTerm}%`)
        .join(',');
      query = query.or(searchCondition);
    }

    return this.executeQuery(table, query);
  }

  // Optimized count queries
  async getCount(table, filters = {}) {
    let query = supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query = query.eq(key, value);
      }
    });

    const result = await this.executeQuery(table, query);
    return result.count;
  }

  // Bulk update operations
  async bulkUpdate(table, updates) {
    const results = [];
    
    for (const update of updates) {
      const { id, data } = update;
      const result = await this.executeQuery(
        table,
        supabase.from(table).update(data).eq('id', id),
        false
      );
      results.push(result);
    }
    
    return results;
  }
}

// Create singleton instance
const dbOptimizer = new DatabaseOptimizer();

// Optimized query helpers for common operations
export const optimizedQueries = {
  // Get all records with caching
  async getAll(table, options = {}) {
    const {
      select = '*',
      orderBy = 'created_at',
      ascending = false,
      limit = 1000,
      useCache = true
    } = options;

    const query = supabase
      .from(table)
      .select(select)
      .order(orderBy, { ascending })
      .limit(limit);

    return dbOptimizer.executeQuery(table, query, useCache);
  },

  // Get record by ID with caching
  async getById(table, id, select = '*') {
    const query = supabase
      .from(table)
      .select(select)
      .eq('id', id)
      .single();

    return dbOptimizer.executeQuery(table, query, true);
  },

  // Create record and clear cache
  async create(table, data) {
    const query = supabase
      .from(table)
      .insert(data)
      .select();

    return dbOptimizer.executeQuery(table, query, false);
  },

  // Update record and clear cache
  async update(table, id, data) {
    const query = supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select();

    return dbOptimizer.executeQuery(table, query, false);
  },

  // Delete record and clear cache
  async delete(table, id) {
    const query = supabase
      .from(table)
      .delete()
      .eq('id', id);

    return dbOptimizer.executeQuery(table, query, false);
  },

  // Paginated results
  async paginate(table, options) {
    return dbOptimizer.paginatedQuery(table, options);
  },

  // Search functionality
  async search(table, options) {
    return dbOptimizer.searchQuery(table, options);
  },

  // Get count
  async count(table, filters) {
    return dbOptimizer.getCount(table, filters);
  }
};

// Connection monitoring
export const connectionMonitor = {
  // Test database connection
  async testConnection() {
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('id')
        .limit(1);
      
      const duration = Date.now() - startTime;
      
      if (error) {
        dbLogger.logQuery('CONNECTION_TEST', duration, false);
        return { success: false, error: error.message, duration };
      }
      
      dbLogger.logQuery('CONNECTION_TEST', duration, true);
      return { success: true, duration };
    } catch (error) {
      const duration = Date.now() - startTime;
      dbLogger.logQuery('CONNECTION_TEST', duration, false);
      return { success: false, error: error.message, duration };
    }
  },

  // Monitor query performance
  async monitorPerformance() {
    const tables = ['leads', 'contacts', 'accounts', 'opportunities'];
    const results = {};
    
    for (const table of tables) {
      const startTime = Date.now();
      
      try {
        await supabase
          .from(table)
          .select('id')
          .limit(1);
        
        results[table] = {
          status: 'healthy',
          responseTime: Date.now() - startTime
        };
      } catch (error) {
        results[table] = {
          status: 'error',
          error: error.message,
          responseTime: Date.now() - startTime
        };
      }
    }
    
    return results;
  }
};

// Export the optimizer instance
export default dbOptimizer;