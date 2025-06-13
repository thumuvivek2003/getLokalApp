import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    View,
} from 'react-native';
import { FAB, Snackbar } from 'react-native-paper';

import EmptyState from '../components/EmptyState';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getBookmarks, removeBookmark } from '../services/database';

const BookmarksScreen = ({ navigation }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadBookmarks();
    }, [])
  );

  const loadBookmarks = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const bookmarkedJobs = await getBookmarks();
      
      // Convert database format back to API format for consistency
      const formattedJobs = bookmarkedJobs.map(bookmark => ({
        id: parseInt(bookmark.job_id) || bookmark.job_id,
        title: bookmark.title,
        primary_details: {
          Place: bookmark.location,
        },
        salary_min: bookmark.salary_min,
        salary_max: bookmark.salary_max,
        whatsapp_no: bookmark.phone,
        job_type: bookmark.job_type,
        company_name: bookmark.company_name,
        other_details: bookmark.description,
      }));

      setBookmarks(formattedJobs);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      showSnackbar('Failed to load bookmarks');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleJobPress = (job) => {
    navigation.navigate('JobDetails', { job, fromBookmarks: true });
  };

  const handleRemoveBookmark = (job) => {
    Alert.alert(
      'Remove Bookmark',
      'Are you sure you want to remove this job from bookmarks?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => confirmRemoveBookmark(job),
        },
      ]
    );
  };

  const confirmRemoveBookmark = async (job) => {
    try {
      await removeBookmark(job.id);
      setBookmarks(prev => prev.filter(bookmark => 
        bookmark.id.toString() !== job.id.toString()
      ));
      showSnackbar('Bookmark removed');
    } catch (error) {
      console.error('Error removing bookmark:', error);
      showSnackbar('Failed to remove bookmark');
    }
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleClearAll = () => {
    if (bookmarks.length === 0) return;

    Alert.alert(
      'Clear All Bookmarks',
      'Are you sure you want to remove all bookmarked jobs?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: confirmClearAll,
        },
      ]
    );
  };

  const confirmClearAll = async () => {
    try {
      for (const job of bookmarks) {
        await removeBookmark(job.id);
      }
      setBookmarks([]);
      showSnackbar('All bookmarks cleared');
    } catch (error) {
      console.error('Error clearing bookmarks:', error);
      showSnackbar('Failed to clear bookmarks');
    }
  };

  const renderJob = ({ item }) => (
    <JobCard
      job={item}
      onPress={() => handleJobPress(item)}
      onBookmark={() => handleRemoveBookmark(item)}
      isBookmarked={true}
    />
  );

  if (loading) {
    return <LoadingSpinner message="Loading bookmarks..." />;
  }

  if (bookmarks.length === 0) {
    return (
      <EmptyState
        icon="bookmark-outline"
        title="No Bookmarks Yet"
        message="Jobs you bookmark will appear here for offline viewing"
        actionText="Browse Jobs"
        onAction={() => navigation.navigate('Jobs')}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookmarks}
        renderItem={renderJob}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => loadBookmarks(true)} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      {bookmarks.length > 0 && (
        <FAB
          icon="delete-sweep"
          label="Clear All"
          onPress={handleClearAll}
          style={styles.fab}
          color="#fff"
        />
      )}

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
  listContent: {
    paddingBottom: 80,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#d32f2f',
  },
});

export default BookmarksScreen;