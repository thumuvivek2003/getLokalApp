// useJobs.js placeholder
import { useCallback, useEffect, useState } from 'react';
import { fetchJobs } from '../services/api';

export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadJobs = useCallback(async (pageNum = 1, isRefresh = false) => {
    if (loading && !isRefresh) return;
    
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const data = await fetchJobs(pageNum);
      
      if (data && data.results) {
        if (isRefresh || pageNum === 1) {
          setJobs(data.results);
        } else {
          setJobs(prev => [...prev, ...data.results]);
        }
        setHasMore(data.results.length > 0);
        setPage(pageNum);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading jobs:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loading]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadJobs(page + 1);
    }
  }, [loading, hasMore, page, loadJobs]);

  const refresh = useCallback(() => {
    setPage(1);
    setHasMore(true);
    loadJobs(1, true);
  }, [loadJobs]);

  useEffect(() => {
    loadJobs(1);
  }, []);

  return {
    jobs,
    loading,
    refreshing,
    error,
    hasMore,
    loadMore,
    refresh,
  };
};