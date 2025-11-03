import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api';
import Button from './ui/Button';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.9;

const SwipeProfiles = ({ navigation }) => {
    const [profiles, setProfiles] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [liking, setLiking] = useState(false);

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        try {
            const { data } = await api.get('/profiles/featured');
            setProfiles(data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load profiles');
        } finally {
            setLoading(false);
        }
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

    const handleLike = async () => {
        if (currentIndex >= profiles.length || liking) return;

        const profile = profiles[currentIndex];
        setLiking(true);

        try {
            const { data } = await api.post('/chat/like', { likedUserId: profile.id });

            if (data.match) {
                Alert.alert(
                    "🎉 It's a Match!",
                    `You and ${profile.first_name} liked each other!`,
                    [{ text: 'Start Chatting', onPress: () => navigation.navigate('Messages') }]
                );
            }

            setCurrentIndex(currentIndex + 1);
        } catch (error) {
            Alert.alert('Error', 'Failed to like profile');
        } finally {
            setLiking(false);
        }
    };

    const handleSkip = () => {
        setCurrentIndex(currentIndex + 1);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ec4899" />
            </View>
        );
    }

    if (currentIndex >= profiles.length) {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="heart-dislike" size={80} color="#ec4899" />
                <Text style={styles.emptyTitle}>No More Profiles</Text>
                <Text style={styles.emptyText}>Check back later for new matches!</Text>
                <Button onPress={() => setCurrentIndex(0)} style={styles.resetButton}>
                    Start Over
                </Button>
            </View>
        );
    }

    const profile = profiles[currentIndex];

    return (
        <View style={styles.container}>
            {/* Next card preview */}
            {currentIndex + 1 < profiles.length && (
                <View style={[styles.card, styles.nextCard]} />
            )}

            {/* Current card */}
            <View style={styles.card}>
                <Image
                    source={
                        profile.profile_photo_url
                            ? { uri: profile.profile_photo_url }
                            : require('../assets/icon.png')
                    }
                    style={styles.image}
                />

                {/* Profile info */}
                <View style={styles.infoContainer}>
                    <View style={styles.nameRow}>
                        <Text style={styles.name}>
                            {profile.first_name} {profile.last_name}
                        </Text>
                        {profile.date_of_birth && (
                            <Text style={styles.age}>{getAge(profile.date_of_birth)}</Text>
                        )}
                    </View>

                    <View style={styles.detailsGrid}>
                        {profile.city && (
                            <View style={styles.detailItem}>
                                <Ionicons name="location" size={16} color="#6b7280" />
                                <Text style={styles.detailText}>
                                    {profile.city}{profile.state && `, ${profile.state}`}
                                </Text>
                            </View>
                        )}
                        {profile.profession && (
                            <View style={styles.detailItem}>
                                <Ionicons name="briefcase" size={16} color="#6b7280" />
                                <Text style={styles.detailText}>{profile.profession}</Text>
                            </View>
                        )}
                        {profile.highest_qualification && (
                            <View style={styles.detailItem}>
                                <Ionicons name="school" size={16} color="#6b7280" />
                                <Text style={styles.detailText}>
                                    {profile.highest_qualification.replace(/-/g, ' ')}
                                </Text>
                            </View>
                        )}
                        {profile.height && (
                            <View style={styles.detailItem}>
                                <Ionicons name="resize" size={16} color="#6b7280" />
                                <Text style={styles.detailText}>{profile.height}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>

            {/* Action buttons */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={handleSkip}
                    activeOpacity={0.7}
                >
                    <Ionicons name="close" size={32} color="#ef4444" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.likeButton, liking && styles.likeButtonDisabled]}
                    onPress={handleLike}
                    disabled={liking}
                    activeOpacity={0.7}
                >
                    {liking ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Ionicons name="heart" size={32} color="white" />
                    )}
                </TouchableOpacity>
            </View>

            {/* Progress indicator */}
            <Text style={styles.progress}>
                {currentIndex + 1} / {profiles.length}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fef2f2',
        alignItems: 'center',
        justifyContent: 'center',
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
    emptyTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 24,
        marginBottom: 12,
        color: '#1f2937',
    },
    emptyText: {
        fontSize: 16,
        color: '#6b7280',
        marginBottom: 32,
        textAlign: 'center',
    },
    resetButton: {
        minWidth: 160,
    },
    card: {
        width: CARD_WIDTH,
        height: SCREEN_HEIGHT * 0.7,
        backgroundColor: 'white',
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 10,
    },
    nextCard: {
        position: 'absolute',
        backgroundColor: '#f3f4f6',
        transform: [{ scale: 0.95 }],
    },
    image: {
        width: '100%',
        height: '65%',
        backgroundColor: '#f3f4f6',
    },
    infoContainer: {
        padding: 24,
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1f2937',
        marginRight: 8,
    },
    age: {
        fontSize: 28,
        fontWeight: '400',
        color: '#6b7280',
    },
    detailsGrid: {
        gap: 12,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        fontSize: 15,
        color: '#4b5563',
    },
    actionsContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 100,
        gap: 24,
    },
    skipButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#ef4444',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    likeButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#ec4899',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#ec4899',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    likeButtonDisabled: {
        opacity: 0.6,
    },
    progress: {
        position: 'absolute',
        bottom: 60,
        fontSize: 16,
        fontWeight: '600',
        color: '#6b7280',
    },
});

export default SwipeProfiles;
