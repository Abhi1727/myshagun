import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Animated,
    PanResponder,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../config/api';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_OUT_DURATION = 250;

const SwipeProfiles = ({ navigation }) => {
    const [profiles, setProfiles] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const position = useRef(new Animated.ValueXY()).current;

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        try {
            const { data } = await api.get('/profiles/discover');
            setProfiles(data);
            setCurrentIndex(0);
        } catch (error) {
            console.error('Error fetching profiles:', error);
            Alert.alert('Error', 'Failed to load profiles');
        } finally {
            setLoading(false);
        }
    };

    const rotate = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: ['-10deg', '0deg', '10deg'],
        extrapolate: 'clamp',
    });

    const rotateAndTranslate = {
        transform: [
            { rotate },
            ...position.getTranslateTransform(),
        ],
    };

    const likeOpacity = position.x.interpolate({
        inputRange: [0, SCREEN_WIDTH / 4],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const nopeOpacity = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 4, 0],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const nextCardOpacity = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 4, 0, SCREEN_WIDTH / 4],
        outputRange: [1, 0.5, 1],
        extrapolate: 'clamp',
    });

    const nextCardScale = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 4, 0, SCREEN_WIDTH / 4],
        outputRange: [1, 0.9, 1],
        extrapolate: 'clamp',
    });

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gesture) => {
                position.setValue({ x: gesture.dx, y: gesture.dy });
            },
            onPanResponderRelease: (_, gesture) => {
                if (gesture.dx > SWIPE_THRESHOLD) {
                    swipeRight();
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                    swipeLeft();
                } else {
                    resetPosition();
                }
            },
        })
    ).current;

    const swipeRight = () => {
        Animated.timing(position, {
            toValue: { x: SCREEN_WIDTH + 100, y: 0 },
            duration: SWIPE_OUT_DURATION,
            useNativeDriver: false,
        }).start(() => {
            handleLike();
        });
    };

    const swipeLeft = () => {
        Animated.timing(position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: 0 },
            duration: SWIPE_OUT_DURATION,
            useNativeDriver: false,
        }).start(() => {
            handlePass();
        });
    };

    const resetPosition = () => {
        Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
        }).start();
    };

    const handleLike = async () => {
        const likedProfile = profiles[currentIndex];
        if (!likedProfile) return;

        try {
            const { data } = await api.post('/chat/like', { likedUserId: likedProfile.id });
            
            if (data.match) {
                Alert.alert(
                    "🎉 It's a Match!",
                    `You and ${likedProfile.first_name} liked each other!`,
                    [
                        { text: 'Keep Swiping', style: 'cancel' },
                        { text: 'Send Message', onPress: () => navigation.navigate('Messages') }
                    ]
                );
            }
        } catch (error) {
            console.error('Like error:', error);
        }

        goToNextCard();
    };

    const handlePass = () => {
        goToNextCard();
    };

    const goToNextCard = () => {
        setCurrentIndex((prev) => prev + 1);
        position.setValue({ x: 0, y: 0 });
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

    const renderCards = () => {
        if (loading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#ec4899" />
                    <Text style={styles.loadingText}>Finding matches...</Text>
                </View>
            );
        }

        if (currentIndex >= profiles.length) {
            return (
                <View style={styles.noMoreCards}>
                    <Ionicons name="heart-outline" size={80} color="#ec4899" />
                    <Text style={styles.noMoreText}>No more profiles</Text>
                    <Text style={styles.noMoreSubtext}>Check back later for new matches!</Text>
                    <TouchableOpacity style={styles.refreshButton} onPress={fetchProfiles}>
                        <Ionicons name="refresh" size={24} color="white" />
                        <Text style={styles.refreshButtonText}>Refresh</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return profiles
            .map((profile, index) => {
                if (index < currentIndex) return null;

                if (index === currentIndex) {
                    return (
                        <Animated.View
                            key={profile.id}
                            style={[styles.card, rotateAndTranslate]}
                            {...panResponder.panHandlers}
                        >
                            <Image
                                source={
                                    profile.profile_photo_url
                                        ? { uri: profile.profile_photo_url }
                                        : require('../assets/icon.png')
                                }
                                style={styles.cardImage}
                            />
                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.9)']}
                                style={styles.cardGradient}
                            >
                                <View style={styles.cardInfo}>
                                    <Text style={styles.cardName}>
                                        {profile.first_name}{profile.date_of_birth && `, ${getAge(profile.date_of_birth)}`}
                                    </Text>
                                    {profile.city && (
                                        <View style={styles.locationRow}>
                                            <Ionicons name="location-outline" size={16} color="white" />
                                            <Text style={styles.cardLocation}>{profile.city}</Text>
                                        </View>
                                    )}
                                    {profile.profession && (
                                        <Text style={styles.cardProfession}>{profile.profession}</Text>
                                    )}
                                </View>
                            </LinearGradient>

                            {/* LIKE stamp */}
                            <Animated.View style={[styles.stamp, styles.likeStamp, { opacity: likeOpacity }]}>
                                <Text style={styles.likeText}>LIKE</Text>
                            </Animated.View>

                            {/* NOPE stamp */}
                            <Animated.View style={[styles.stamp, styles.nopeStamp, { opacity: nopeOpacity }]}>
                                <Text style={styles.nopeText}>NOPE</Text>
                            </Animated.View>
                        </Animated.View>
                    );
                }

                // Next card (behind)
                if (index === currentIndex + 1) {
                    return (
                        <Animated.View
                            key={profile.id}
                            style={[
                                styles.card,
                                styles.nextCard,
                                {
                                    opacity: nextCardOpacity,
                                    transform: [{ scale: nextCardScale }],
                                },
                            ]}
                        >
                            <Image
                                source={
                                    profile.profile_photo_url
                                        ? { uri: profile.profile_photo_url }
                                        : require('../assets/icon.png')
                                }
                                style={styles.cardImage}
                            />
                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.9)']}
                                style={styles.cardGradient}
                            >
                                <View style={styles.cardInfo}>
                                    <Text style={styles.cardName}>
                                        {profile.first_name}{profile.date_of_birth && `, ${getAge(profile.date_of_birth)}`}
                                    </Text>
                                </View>
                            </LinearGradient>
                        </Animated.View>
                    );
                }

                return null;
            })
            .reverse();
    };

    return (
        <View style={styles.container}>
            <View style={styles.cardsContainer}>{renderCards()}</View>

            {!loading && currentIndex < profiles.length && (
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.passButton]}
                        onPress={swipeLeft}
                    >
                        <Ionicons name="close" size={35} color="#ff6b6b" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.likeButton]}
                        onPress={swipeRight}
                    >
                        <Ionicons name="heart" size={35} color="#4ade80" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    cardsContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
    },
    card: {
        position: 'absolute',
        width: SCREEN_WIDTH * 0.9,
        height: SCREEN_HEIGHT * 0.65,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
    },
    nextCard: {
        top: 10,
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    cardGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%',
        justifyContent: 'flex-end',
        padding: 20,
    },
    cardInfo: {
        marginBottom: 10,
    },
    cardName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    cardLocation: {
        fontSize: 16,
        color: 'white',
        marginLeft: 4,
    },
    cardProfession: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    stamp: {
        position: 'absolute',
        top: 50,
        padding: 10,
        borderWidth: 4,
        borderRadius: 10,
    },
    likeStamp: {
        left: 20,
        borderColor: '#4ade80',
        transform: [{ rotate: '-20deg' }],
    },
    nopeStamp: {
        right: 20,
        borderColor: '#ff6b6b',
        transform: [{ rotate: '20deg' }],
    },
    likeText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4ade80',
    },
    nopeText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ff6b6b',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 30,
        gap: 40,
    },
    button: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 3,
    },
    passButton: {
        borderWidth: 2,
        borderColor: '#ff6b6b',
    },
    likeButton: {
        borderWidth: 2,
        borderColor: '#4ade80',
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 18,
        color: '#6b7280',
    },
    noMoreCards: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    noMoreText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginTop: 20,
    },
    noMoreSubtext: {
        fontSize: 16,
        color: '#6b7280',
        marginTop: 8,
        textAlign: 'center',
    },
    refreshButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ec4899',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
        marginTop: 24,
        gap: 8,
    },
    refreshButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SwipeProfiles;
