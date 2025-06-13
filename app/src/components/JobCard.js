// JobCard.js placeholder
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Chip, IconButton } from 'react-native-paper';

const JobCard = ({ job, onPress, onBookmark, isBookmarked }) => {
  const formatSalary = (min, max) => {
    if (min && max) {
      return `₹${min} - ₹${max}`;
    } else if (min) {
      return `₹${min}+`;
    } else if (max) {
      return `Up to ₹${max}`;
    }
    return 'Salary not specified';
  };

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {job.title || 'Job Title Not Available'}
            </Text>
            {job.company_name && (
              <Text style={styles.company}>{job.company_name}</Text>
            )}
          </View>
          <IconButton
            icon={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            iconColor={isBookmarked ? '#6200ee' : '#666'}
            size={24}
            onPress={onBookmark}
          />
        </View>

        <View style={styles.details}>
          {job.primary_details?.Place && (
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.detailText}>{job.primary_details.Place}</Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Ionicons name="cash-outline" size={16} color="#666" />
            <Text style={styles.detailText}>
              {formatSalary(job.salary_min, job.salary_max)}
            </Text>
          </View>

          {(job.whatsapp_no || job.contact_preference?.whatsapp_link) && (
            <View style={styles.detailRow}>
              <Ionicons name="call-outline" size={16} color="#666" />
              <Text style={styles.detailText}>
                {job.whatsapp_no || 'Contact available'}
              </Text>
            </View>
          )}
        </View>

        {job.job_type && (
          <View style={styles.chipContainer}>
            <Chip mode="outlined" compact>
              {job.job_type}
            </Chip>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  company: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  details: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default JobCard;