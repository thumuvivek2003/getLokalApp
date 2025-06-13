import React, { useEffect, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    View
} from 'react-native';
import { Snackbar } from 'react-native-paper';

import EmptyState from '../components/EmptyState';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useJobs } from '../hooks/useJobs';
import { addBookmark, isBookmarked, removeBookmark } from '../services/database';

const JobsScreen = ({ navigation }) => {
  const { jobs, loading, refreshing, error, hasMore, loadMore, refresh } = useJobs();
  const [bookmarkedJobs, setBookmarkedJobs] = useState(new Set());
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    checkBookmarkStatus();
  }, [jobs]);

  const checkBookmarkStatus = async () => {
    const bookmarkedSet = new Set();
    for (const job of jobs) {
      if (job.id) {
        const bookmarked = await isBookmarked(job.id);
        if (bookmarked) {
          bookmarkedSet.add(job.id.toString());
        }
      }
    }
    setBookmarkedJobs(bookmarkedSet);
  };

  const handleJobPress = (job) => {
    navigation.navigate('JobDetails', { job, fromBookmarks: false });
  };

  const handleBookmarkToggle = async (job) => {
    if (!job.id) {
      showSnackbar('Unable to bookmark this job');
      return;
    }

    try {
      const jobId = job.id.toString();
      const wasBookmarked = bookmarkedJobs.has(jobId);

      if (wasBookmarked) {
        await removeBookmark(job.id);
        setBookmarkedJobs(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
        showSnackbar('Job removed from bookmarks');
      } else {
        await addBookmark(job);
        setBookmarkedJobs(prev => new Set([...prev, jobId]));
        showSnackbar('Job added to bookmarks');
      }
    } catch (error) {
      console.error('Bookmark error:', error);
      showSnackbar('Failed to update bookmark');
    }
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const renderJob = ({ item }) => (
    <JobCard
      job={item}
      onPress={() => handleJobPress(item)}
      onBookmark={() => handleBookmarkToggle(item)}
      isBookmarked={bookmarkedJobs.has(item.id?.toString())}
    />
  );

  const renderFooter = () => {
    if (!loading || jobs.length === 0) return null;
    return (
      <View style={styles.footer}>
        <LoadingSpinner message="Loading more jobs..." />
      </View>
    );
  };

  const handleRetry = () => {
    refresh();
  };

  if (loading && jobs.length === 0) {
    return <LoadingSpinner message="Loading jobs..." />;
  }

  if (error && jobs.length === 0) {
    return (
      <EmptyState
        icon="alert-circle-outline"
        title="Error Loading Jobs"
        message={error}
        actionText="Retry"
        onAction={handleRetry}
      />
    );
  }

  if (!loading && jobs.length === 0) {
    return (
      <EmptyState
        icon="briefcase-outline"
        title="No Jobs Available"
        message="Check back later for new job opportunities"
        actionText="Refresh"
        onAction={refresh}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        renderItem={renderJob}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  footer: {
    paddingVertical: 20,
  },
});

export default JobsScreen;