import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Card,
  Chip,
  IconButton,
  Snackbar,
  Surface
} from 'react-native-paper';

import { addBookmark, isBookmarked, removeBookmark } from '../services/database';

const { width } = Dimensions.get('window');

const JobDetailsScreen = ({ route, navigation }) => {
  const { job, fromBookmarks = false } = route.params;
  const [bookmarked, setBookmarked] = useState(fromBookmarks);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    checkBookmarkStatus();
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
    const phoneNumber = job.whatsapp_no || job.contact_preference?.whatsapp_link?.match(/\d+/)?.[0];
    
    if (!phoneNumber) {
      Alert.alert('Contact Info', 'No contact information available for this job.');
      return;
    }

    const whatsappUrl = job.contact_preference?.whatsapp_link || `https://wa.me/${phoneNumber}`;
    
    Alert.alert(
      'Contact Employer',
      `Ready to apply for this position?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Open WhatsApp',
          onPress: () => {
            Linking.openURL(whatsappUrl).catch(() =>
              showSnackbar('Failed to open WhatsApp')
            );
          },
        },
      ]
    );
  };

  const handleCall = () => {
    if (job.whatsapp_no) {
      const url = `tel:${job.whatsapp_no}`;
      Linking.openURL(url).catch(() =>
        showSnackbar('Failed to make call')
      );
    }
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const formatSalary = (min, max) => {
    if (min && max) {
      return `₹${(min / 1000).toFixed(0)}K - ₹${(max / 1000).toFixed(0)}K per month`;
    } else if (min) {
      return `₹${(min / 1000).toFixed(0)}K+ per month`;
    }
    return 'Salary negotiable';
  };

  const getJobTypeColor = (jobType) => {
    const colors = {
      'Full time': '#4CAF50',
      'Part time': '#FF9800',
      'Contract': '#2196F3',
      'Internship': '#9C27B0',
    };
    return colors[jobType] || '#666';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section with Company Image */}
      <Surface style={styles.headerCard}>
        {job.is_premium && (
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.premiumBanner}
          >
            <Ionicons name="star" size={16} color="#FFF" />
            <Text style={styles.premiumText}>FEATURED JOB</Text>
          </LinearGradient>
        )}
        
        {job.creatives && job.creatives.length > 0 && (
          <Image
            source={{ uri: job.creatives[0].thumb_url || job.creatives[0].file }}
            style={styles.companyImage}
            resizeMode="contain"
          />
        )}
        
        <View style={styles.headerContent}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <View style={styles.companyRow}>
            <Ionicons name="business" size={18} color="#666" />
            <Text style={styles.companyName}>{job.company_name}</Text>
          </View>
          
          {job.job_tags && job.job_tags.length > 0 && (
            <View style={styles.urgentContainer}>
              <Chip 
                mode="flat" 
                style={[styles.urgentChip, { backgroundColor: job.job_tags[0].bg_color }]}
                textStyle={[styles.urgentChipText, { color: job.job_tags[0].text_color }]}
              >
                🔥 {job.job_tags[0].value}
              </Chip>
            </View>
          )}
        </View>
      </Surface>

      {/* Quick Info Cards */}
      <View style={styles.quickInfoContainer}>
        <Surface style={styles.infoCard}>
          <Ionicons name="location" size={24} color="#6200ee" />
          <Text style={styles.infoLabel}>Location</Text>
          <Text style={styles.infoValue}>{job.primary_details?.Place || 'Not specified'}</Text>
        </Surface>
        
        <Surface style={styles.infoCard}>
          <Ionicons name="wallet" size={24} color="#4CAF50" />
          <Text style={styles.infoLabel}>Salary</Text>
          <Text style={styles.infoValue}>{formatSalary(job.salary_min, job.salary_max)}</Text>
        </Surface>
        
        <Surface style={styles.infoCard}>
          <Ionicons name="time" size={24} color="#FF9800" />
          <Text style={styles.infoLabel}>Experience</Text>
          <Text style={styles.infoValue}>{job.primary_details?.Experience || 'Any'}</Text>
        </Surface>
      </View>

      {/* Job Details Section */}
      <Card style={styles.detailsCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={20} color="#6200ee" />
            <Text style={styles.sectionTitle}>Job Details</Text>
          </View>
          
          <View style={styles.detailsGrid}>
            <DetailRow 
              icon="briefcase" 
              label="Job Type" 
              value={job.primary_details?.Job_Type || 'Not specified'}
              color={getJobTypeColor(job.job_hours)}
            />
            <DetailRow 
              icon="school" 
              label="Qualification" 
              value={job.primary_details?.Qualification || 'Not Required'}
              color="#9C27B0"
            />
            <DetailRow 
              icon="medical" 
              label="Category" 
              value={job.job_category || 'General'}
              color="#E91E63"
            />
            <DetailRow 
              icon="people" 
              label="Gender" 
              value={job.contentV3?.V3?.find(item => item.field_key === 'Gender')?.field_value || 'Any'}
              color="#00BCD4"
            />
            <DetailRow 
              icon="sunny" 
              label="Shift" 
              value={job.contentV3?.V3?.find(item => item.field_key === 'Shift timing')?.field_value || 'Day Shift'}
              color="#FF5722"
            />
            <DetailRow 
              icon="cash" 
              label="Fees" 
              value={job.primary_details?.Fees_Charged === '-1' ? 'No Fee' : 'Fee Required'}
              color="#4CAF50"
            />
          </View>
        </Card.Content>
      </Card>

      {/* Job Description */}
      <Card style={styles.detailsCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text" size={20} color="#6200ee" />
            <Text style={styles.sectionTitle}>Job Description</Text>
          </View>
          <Text style={styles.description}>
            {job.other_details || job.contentV3?.V3?.find(item => item.field_key === 'Other details')?.field_value || 'No detailed description available for this position.'}
          </Text>
        </Card.Content>
      </Card>

      {/* Application Stats */}
      {(job.num_applications > 0 || job.views > 0) && (
        <Card style={styles.statsCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Ionicons name="analytics" size={20} color="#6200ee" />
              <Text style={styles.sectionTitle}>Application Stats</Text>
            </View>
            <View style={styles.statsContainer}>
              {job.num_applications > 0 && (
                <View style={styles.statItem}>
                  <Ionicons name="people" size={18} color="#4CAF50" />
                  <Text style={styles.statNumber}>{job.num_applications}</Text>
                  <Text style={styles.statLabel}>Applications</Text>
                </View>
              )}
              {job.views > 0 && (
                <View style={styles.statItem}>
                  <Ionicons name="eye" size={18} color="#2196F3" />
                  <Text style={styles.statNumber}>{job.views}</Text>
                  <Text style={styles.statLabel}>Views</Text>
                </View>
              )}
              <View style={styles.statItem}>
                <Ionicons name="calendar" size={18} color="#FF9800" />
                <Text style={styles.statNumber}>
                  {new Date(job.updated_on).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </Text>
                <Text style={styles.statLabel}>Posted</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Contact Actions */}
      <View style={styles.contactContainer}>
        <TouchableOpacity 
          style={[styles.contactButton, styles.whatsappButton]} 
          onPress={handleContact}
        >
          <LinearGradient
            colors={['#25D366', '#128C7E']}
            style={styles.contactButtonGradient}
          >
            <Ionicons name="logo-whatsapp" size={20} color="#FFF" />
            <Text style={styles.contactButtonText}>Apply via WhatsApp</Text>
          </LinearGradient>
        </TouchableOpacity>

        {job.whatsapp_no && (
          <TouchableOpacity 
            style={[styles.contactButton, styles.callButton]} 
            onPress={handleCall}
          >
            <LinearGradient
              colors={['#2196F3', '#1976D2']}
              style={styles.contactButtonGradient}
            >
              <Ionicons name="call" size={20} color="#FFF" />
              <Text style={styles.contactButtonText}>Call Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
};

// Helper Component for Detail Rows
const DetailRow = ({ icon, label, value, color }) => (
  <View style={styles.detailRow}>
    <View style={[styles.detailIcon, { backgroundColor: `${color}15` }]}>
      <Ionicons name={icon} size={16} color={color} />
    </View>
    <View style={styles.detailContent}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerCard: {
    margin: 16,
    borderRadius: 16,
    elevation: 4,
    backgroundColor: '#FFF',
    overflow: 'hidden',
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  premiumText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  companyImage: {
    width: '100%',
    height: 400,
    backgroundColor: '#F5F5F5',
  },
  headerContent: {
    padding: 20,
  },
  jobTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    lineHeight: 28,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  companyName: {
    fontSize: 16,
    color: '#666',
    marginLeft: 6,
    fontWeight: '500',
  },
  urgentContainer: {
    marginTop: 8,
  },
  urgentChip: {
    alignSelf: 'flex-start',
  },
  urgentChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  quickInfoContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  infoCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    backgroundColor: '#FFF',
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
  },
  detailsCard: {
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginLeft: 8,
  },
  detailsGrid: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginTop: 2,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
    textAlign: 'justify',
  },
  statsCard: {
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    elevation: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  contactContainer: {
    padding: 16,
    gap: 12,
  },
  contactButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },
  contactButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  contactButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  snackbar: {
    backgroundColor: '#333',
  },
});

export default JobDetailsScreen;