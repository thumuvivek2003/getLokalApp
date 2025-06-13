// JobCard.js
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card, Chip, IconButton } from 'react-native-paper';

const { width } = Dimensions.get('window');

const JobCard = ({ job, onPress, onBookmark, isBookmarked }) => {
  const formatSalary = (min, max) => {
    if (min && max) {
      return `₹${(min / 1000).toFixed(0)}K - ₹${(max / 1000).toFixed(0)}K`;
    } else if (min) {
      return `₹${(min / 1000).toFixed(0)}K+`;
    } else if (max) {
      return `Up to ₹${(max / 1000).toFixed(0)}K`;
    }
    return 'Salary not specified';
  };

  const isPremium = job.is_premium;
  const hasUrgentHiring = job.openings_count > 20;
  const applicationCount = job.num_applications || 0;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.95}>
      <Card style={[styles.card, isPremium && styles.premiumCard]}>
        {isPremium && (
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.premiumBadge}
          >
            <Ionicons name="star" size={12} color="#FFF" />
            <Text style={styles.premiumText}>FEATURED</Text>
          </LinearGradient>
        )}
        
        <Card.Content style={styles.cardContent}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={2}>
                {job.title || 'Job Title Not Available'}
              </Text>
              {job.company_name && (
                <View style={styles.companyRow}>
                  <Ionicons name="business-outline" size={14} color="#666" />
                  <Text style={styles.company}>{job.company_name}</Text>
                </View>
              )}
            </View>
            <View style={styles.actionContainer}>
              <IconButton
                icon={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                iconColor={isBookmarked ? '#6200ee' : '#999'}
                size={20}
                onPress={onBookmark}
                style={styles.bookmarkButton}
              />
            </View>
          </View>

          <View style={styles.tagsContainer}>
            {hasUrgentHiring && (
              <Chip 
                mode="flat" 
                compact 
                style={styles.urgentChip}
                textStyle={styles.urgentChipText}
              >
                🔥 {job.openings_count} Openings
              </Chip>
            )}
            {job.primary_details?.Experience && (
              <Chip 
                mode="outlined" 
                compact 
                style={styles.experienceChip}
                textStyle={styles.chipText}
              >
                {job.primary_details.Experience}
              </Chip>
            )}
          </View>

          <View style={styles.details}>
            <View style={styles.detailGrid}>
              {job.primary_details?.Place && (
                <View style={styles.detailItem}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="location" size={16} color="#6200ee" />
                  </View>
                  <Text style={styles.detailText}>{job.primary_details.Place}</Text>
                </View>
              )}

              <View style={styles.detailItem}>
                <View style={styles.iconContainer}>
                  <Ionicons name="wallet" size={16} color="#4CAF50" />
                </View>
                <Text style={[styles.detailText, styles.salaryText]}>
                  {formatSalary(job.salary_min, job.salary_max)}
                </Text>
              </View>

              {job.primary_details?.Job_Type && (
                <View style={styles.detailItem}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="briefcase" size={16} color="#FF9800" />
                  </View>
                  <Text style={styles.detailText}>{job.primary_details.Job_Type}</Text>
                </View>
              )}

              {job.job_category && (
                <View style={styles.detailItem}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="medical" size={16} color="#E91E63" />
                  </View>
                  <Text style={styles.detailText}>{job.job_category}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.statsContainer}>
              {applicationCount > 0 && (
                <View style={styles.statItem}>
                  <Ionicons name="people-outline" size={14} color="#999" />
                  <Text style={styles.statText}>{applicationCount} applied</Text>
                </View>
              )}
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={14} color="#999" />
                <Text style={styles.statText}>
                  {new Date(job.updated_on).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </Text>
              </View>
            </View>

            {(job.whatsapp_no || job.contact_preference?.whatsapp_link) && (
              <TouchableOpacity style={styles.contactButton}>
                <Ionicons name="logo-whatsapp" size={16} color="#25D366" />
                <Text style={styles.contactButtonText}>Contact</Text>
              </TouchableOpacity>
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  premiumCard: {
    elevation: 6,
    shadowOpacity: 0.15,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  premiumBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 8,
    zIndex: 1,
  },
  premiumText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  cardContent: {
    paddingTop: 16,
    paddingBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
    lineHeight: 22,
    marginBottom: 6,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  company: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
  actionContainer: {
    alignItems: 'center',
  },
  bookmarkButton: {
    margin: 0,
    padding: 0,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 6,
  },
  urgentChip: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FF9800',
  },
  urgentChipText: {
    color: '#E65100',
    fontSize: 11,
    fontWeight: '600',
  },
  experienceChip: {
    borderColor: '#E0E0E0',
  },
  chipText: {
    fontSize: 11,
    color: '#666',
  },
  details: {
    marginBottom: 12,
  },
  detailGrid: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  detailText: {
    fontSize: 14,
    color: '#444',
    flex: 1,
    fontWeight: '500',
  },
  salaryText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
    fontWeight: '500',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#25D366',
  },
  contactButtonText: {
    color: '#25D366',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default JobCard;