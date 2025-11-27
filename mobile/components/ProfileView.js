import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Image,
    TouchableOpacity,
    RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api';

const ProfileView = ({ navigation }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get('/profiles/me');
            setProfile(data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load profile');
            console.error('Profile fetch error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchProfile();
    };

    const getAge = (dateOfBirth) => {
        if (!dateOfBirth) return null;
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const formatLabel = (str) => {
        if (!str) return '';
        return str.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ec4899" />
            </View>
        );
    }

    if (!profile) {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="alert-circle" size={60} color="#ec4899" />
                <Text style={styles.emptyText}>Profile not found</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="#ec4899"
                    colors={['#ec4899']}
                />
            }
        >
            {/* Profile Photo */}
            <View style={styles.photoSection}>
                {profile.profile_photo_url ? (
                    <Image
                        source={{ uri: profile.profile_photo_url }}
                        style={styles.profilePhoto}
                    />
                ) : (
                    <View style={styles.photoPlaceholder}>
                        <Ionicons name="person" size={80} color="#ec4899" />
                    </View>
                )}
                <TouchableOpacity
                    style={styles.editPhotoButton}
                    onPress={() => navigation.navigate('EditProfile', { photoOnly: true })}
                >
                    <Ionicons name="camera" size={20} color="white" />
                </TouchableOpacity>
            </View>

            {/* Name and Age */}
            <View style={styles.nameSection}>
                <Text style={styles.name}>
                    {profile.first_name} {profile.last_name}
                </Text>
                {profile.date_of_birth && (
                    <Text style={styles.age}>{getAge(profile.date_of_birth)} years old</Text>
                )}
            </View>

            {/* Edit Button */}
            <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('EditProfile')}
            >
                <Ionicons name="create-outline" size={20} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>

            {/* Profile Details */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contact Information</Text>
                <InfoRow icon="mail" label="Email" value={profile.email || 'N/A'} />
                <InfoRow icon="call" label="Mobile" value={profile.mobile_number || 'N/A'} />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Location</Text>
                <InfoRow icon="location" label="City" value={profile.city || 'N/A'} />
                <InfoRow icon="map" label="State" value={profile.state || 'N/A'} />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Personal Details</Text>
                <InfoRow icon="book" label="Religion" value={profile.religion ? formatLabel(profile.religion) : 'N/A'} />
                <InfoRow icon="heart-circle" label="Marital Status" value={profile.marital_status ? formatLabel(profile.marital_status) : 'N/A'} />
                <InfoRow icon="resize" label="Height" value={profile.height ? formatLabel(profile.height) : 'N/A'} />
                <InfoRow icon="home" label="Lives With Family" value={profile.lives_with_family !== null ? (profile.lives_with_family ? 'Yes' : 'No') : 'N/A'} />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Lifestyle</Text>
                <InfoRow icon="restaurant" label="Diet" value={profile.diet ? formatLabel(profile.diet) : 'N/A'} />
                <InfoRow icon="ban" label="Smoking" value={profile.smoking ? formatLabel(profile.smoking) : 'N/A'} />
                <InfoRow icon="wine" label="Drinking" value={profile.drinking ? formatLabel(profile.drinking) : 'N/A'} />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education & Career</Text>
                <InfoRow icon="school" label="Education" value={profile.highest_qualification ? formatLabel(profile.highest_qualification) : 'N/A'} />
                <InfoRow icon="briefcase" label="Profession" value={profile.profession || 'N/A'} />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Looking For</Text>
                <InfoRow icon="search" label="Interested In" value={profile.interested_in ? formatLabel(profile.interested_in) : 'N/A'} />
                <InfoRow icon="people" label="Looking For" value={profile.interested_for ? formatLabel(profile.interested_for) : 'N/A'} />
            </View>
        </ScrollView>
    );
};

const InfoRow = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
        <View style={styles.infoLeft}>
            <Ionicons name={icon} size={20} color="#6b7280" />
            <Text style={styles.infoLabel}>{label}</Text>
        </View>
        <Text style={styles.infoValue}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fef2f2',
    },
    scrollContent: {
        paddingBottom: 30,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fef2f2',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        backgroundColor: '#fef2f2',
    },
    emptyText: {
        fontSize: 18,
        color: '#6b7280',
        marginTop: 16,
    },
    photoSection: {
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 16,
        position: 'relative',
    },
    profilePhoto: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 4,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
    },
    photoPlaceholder: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#ec4899',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
    },
    editPhotoButton: {
        position: 'absolute',
        bottom: 0,
        right: '35%',
        backgroundColor: '#ec4899',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    nameSection: {
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 24,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
    },
    age: {
        fontSize: 18,
        color: '#6b7280',
        marginTop: 4,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ec4899',
        marginHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        marginBottom: 24,
        shadowColor: '#ec4899',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    editButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    section: {
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    infoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    infoLabel: {
        fontSize: 15,
        color: '#6b7280',
        marginLeft: 12,
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 15,
        color: '#1f2937',
        fontWeight: '600',
        flex: 1,
        textAlign: 'right',
    },
});

export default ProfileView;
