import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Dimensions
} from 'react-native';
import api from '../config/api';

const { width, height } = Dimensions.get('window');

const SwipeProfiles = ({ navigation }) => {
    const [profiles, setProfiles] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

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
        if (currentIndex >= profiles.length) return;

        const profile = profiles[currentIndex];

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
                <Text style={styles.emptyTitle}>No More Profiles</Text>
                <Text style={styles.emptyText}>Check back later for new matches!</Text>
                <TouchableOpacity
                    style={styles.resetButton}
                    onPress={() => setCurrentIndex(0)}
                >
                    <Text style={styles.resetButtonText}>Start Over</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const profile = profiles[currentIndex];

    return (
        <View style={styles.container}>
            {/* Profile Card */}
            <View style={styles.card}>
                <Image
                    source={
                        profile.profile_photo_url
                            ? { uri: profile.profile_photo_url }
                            : require('../assets/icon.png')
                    }
                    style={styles.image}
                />

                <View style={styles.infoContainer}>
                    <Text style={styles.name}>
                        {profile.first_name} {profile.last_name}
                        {profile.date_of_birth && `, ${getAge(profile.date_of_birth)}`}
                    </Text>

                    {profile.city && (
                        <Text style={styles.location}>
                            📍 {profile.city}{profile.state && `, ${profile.state}`}
                        </Text>
                    )}

                    <View style={styles.detailsContainer}>
                        {profile.profession && (
                            <Text style={styles.detail}>💼 {profile.profession}</Text>
                        )}
                        {profile.highest_qualification && (
                            <Text style={styles.detail}>
                                🎓 {profile.highest_qualification.replace('-', ' ')}
                            </Text>
                        )}
                        {profile.height && (
                            <Text style={styles.detail}>📏 {profile.height}</Text>
                        )}
                        {profile.religion && (
                            <Text style={styles.detail}>🕉️ {profile.religion}</Text>
                        )}
                    </View>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                    <Text style={styles.skipButtonText}>✕</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
                    <Text style={styles.likeButtonText}>♥</Text>
                </TouchableOpacity>
            </View>

            {/* Progress */}
            <Text style={styles.progress}>
                {currentIndex + 1} of {profiles.length}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fef2f2',
        padding: 16,
        justifyContent: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#ec4899',
    },
    emptyText: {
        fontSize: 16,
        color: '#6b7280',
        marginBottom: 24,
        textAlign: 'center',
    },
    resetButton: {
        backgroundColor: '#ec4899',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 24,
    },
    resetButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        height: height * 0.65,
    },
    image: {
        width: '100%',
        height: '60%',
        backgroundColor: '#f3f4f6',
    },
    infoContainer: {
        padding: 20,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
    },
    location: {
        fontSize: 16,
        color: '#6b7280',
        marginBottom: 16,
    },
    detailsContainer: {
        gap: 8,
    },
    detail: {
        fontSize: 14,
        color: '#4b5563',
        marginBottom: 4,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 32,
        gap: 32,
    },
    skipButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        borderWidth: 2,
        borderColor: '#ef4444',
    },
    skipButtonText: {
        fontSize: 32,
        color: '#ef4444',
        fontWeight: 'bold',
    },
    likeButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#ec4899',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#ec4899',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
    },
    likeButtonText: {
        fontSize: 40,
        color: 'white',
    },
    progress: {
        textAlign: 'center',
        marginTop: 16,
        color: '#6b7280',
        fontSize: 14,
    },
});

export default SwipeProfiles;
