import React, { useEffect, useState } from 'react';
import {
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {
    Button,
    Card,
    Chip,
    Divider,
    IconButton,
    Snackbar,
} from 'react-native-paper';

import { addBookmark, isBookmarked, removeBookmark } from '../services/database';

const JobDetailsScreen = ({ route, navigation }) => {
  const { job, fromBookmarks = false } = route.params;
  const [bookmarked, setBookmarked] = useState(fromBookmarks);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    checkBookmarkStatus();
    // Set header right button
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon={bookmarked ? 'bookmark' : 'bookmark-outline'}
          iconColor={bookmarked ? '#6200ee' : '#666'}
          size={24}
          onPress={handleBookmarkToggle}
        />
      ),
    });
  }, [bookmarked, navigation]);

  const checkBookmarkStatus = async () => {
    if (!fromBookmarks && job.id) {
      const status = await isBookmarked(job.id);
      setBookmarked(status);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!job.id) {
      showSnackbar('Unable to bookmark this job');
      return;
    }

    try {
      if (bookmarked) {
        await removeBookmark(job.id);
        setBookmarked(false);
        showSnackbar('Job removed from bookmarks');
        
        if (fromBookmarks) {
          navigation.goBack();
        }
      } else {
        await addBookmark(job);
        setBookmarked(true);
        showSnackbar('Job added to bookmarks');
      }
    } catch (error) {
      console.error('Bookmark error:', error);
      showSnackbar('Failed to update bookmark');
    }
  };

  const handleContact = () => {
    const phoneNumber = job.whatsapp_no || job.contact_preference?.whatsapp_link;
    
    if (!phoneNumber) {
      Alert.alert('Contact Info', 'No contact information available for this job.');
      return;
    }

    Alert.alert(
      'Contact Employer',
      `Contact via WhatsApp: ${phoneNumber}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Open WhatsApp',
          onPress: () => {
            const url = `https://wa.me/${phoneNumber}`;
            Linking.openURL(url).catch(() =>
              showSnackbar('Failed to open WhatsApp')
            );
          },
        },
      ]
    );
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <Card.Title title={job.title} subtitle={job.company || 'Unknown Company'} />
        <Card.Content>
          <View style={styles.chipContainer}>
            {job.location && <Chip style={styles.chip}>{job.location}</Chip>}
            {job.salary && <Chip style={styles.chip}>💰 {job.salary}</Chip>}
            {job.job_type && <Chip style={styles.chip}>{job.job_type}</Chip>}
          </View>
          <Divider style={{ marginVertical: 10 }} />
          <Text style={styles.label}>Description</Text>
          <Text style={styles.description}>{job.description || 'No description provided.'}</Text>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button icon="whatsapp" mode="contained" onPress={handleContact}>
            Contact
          </Button>
        </Card.Actions>
      </Card>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
};

export default JobDetailsScreen;

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
    gap: 6,
  },
  chip: {
    marginRight: 6,
    marginBottom: 6,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 10,
  },
  actions: {
    justifyContent: 'flex-end',
    padding: 16,
  },
});
