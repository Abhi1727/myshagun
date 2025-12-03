import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api';

const LikesReceived = ({ navigation }) => {
    const [likes, setLikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [likingBack, setLikingBack] = useState(null);

    useEffect(() => {
        fetchLikes();
    }, []);

    const fetchLikes = async () => {
        try {
            const { data } = await api.get('/profiles/likes-received');
            setLikes(data);
        } catch (error) {
            console.error('Error fetching likes:', error);
            Alert.alert('Error', 'Failed to load likes');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchLikes();
    };

    const handleLikeBack = async (profile) => {
        setLikingBack(profile.id);
        try {
            const { data } = await api.post('/chat/like', { likedUserId: profile.id });
            
            if (data.match) {
                Alert.alert(
                    "🎉 It's a Match!",
                    `You and ${profile.first_name} are now connected!`,
                    [
                        { text: 'Keep Browsing', style: 'cancel', onPress: fetchLikes },
                        { text: 'Send Message', onPress: () => navigation.navigate('Messages') }
                    ]
                );
            }
            
            // Remove from list after liking back
            setLikes(likes.filter(l => l.id !== profile.id));
        } catch (error) {
            console.error('Like back error:', error);
            Alert.alert('Error', 'Failed to like back');
        } finally {
            setLikingBack(null);
        }
    };

    const handleStartChat = async (profile) => {
        try {
            // Create or get conversation
            const { data } = await api.post('/chat/send', {
                receiverId: profile.id,
                message: `Hi ${profile.first_name}! 👋`
            });
            
            // Navigate to chat
            navigation.navigate('Chat', {
                conversationId: data.conversationId,
                otherUserId: profile.id,
                otherUserName: `${profile.first_name} ${profile.last_name || ''}`
            });
        } catch (error) {
            console.error('Start chat error:', error);
            Alert.alert('Error', 'Failed to start chat');
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

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return 'Today';
        } else if (days === 1) {
            return 'Yesterday';
        } else if (days < 7) {
            return `${days} days ago`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const renderLikeItem = ({ item }) => (
        <View style={styles.card}>
            <Image
                source={
                    item.profile_photo_url
                        ? { uri: item.profile_photo_url }
                        : require('../assets/icon.png')
                }
                style={styles.photo}
            />
            <View style={styles.info}>
                <View style={styles.nameRow}>
                    <Text style={styles.name}>
                        {item.first_name} {item.last_name}
                    </Text>
                    {item.date_of_birth && (
                        <Text style={styles.age}>, {getAge(item.date_of_birth)}</Text>
                    )}
                </View>
                {item.city && (
                    <View style={styles.locationRow}>
                        <Ionicons name="location-outline" size={14} color="#6b7280" />
                        <Text style={styles.location}>
                            {item.city}{item.state && `, ${item.state}`}
                        </Text>
                    </View>
                )}
                <Text style={styles.likedAt}>
                    <Ionicons name="heart" size={12} color="#ec4899" /> Liked you {formatTime(item.liked_at)}
                </Text>
            </View>
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={[styles.likeBackButton, likingBack === item.id && styles.buttonDisabled]}
                    onPress={() => handleLikeBack(item)}
                    disabled={likingBack === item.id}
                >
                    {likingBack === item.id ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Ionicons name="heart" size={20} color="white" />
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.chatButton}
                    onPress={() => handleStartChat(item)}
                >
                    <Ionicons name="chatbubble" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ec4899" />
            </View>
        );
    }

    if (likes.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                    <Ionicons name="heart-outline" size={80} color="#ec4899" />
                </View>
                <Text style={styles.emptyTitle}>No Likes Yet</Text>
                <Text style={styles.emptyText}>
                    When someone likes your profile, they'll appear here!
                </Text>
                <TouchableOpacity
                    style={styles.browseButton}
                    onPress={() => navigation.navigate('Swipe')}
                >
                    <Text style={styles.browseButtonText}>Browse Profiles</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>
                    {likes.length} {likes.length === 1 ? 'person likes' : 'people like'} you
                </Text>
                <Text style={styles.headerSubtitle}>
                    Like them back to start chatting!
                </Text>
            </View>
            <FlatList
                data={likes}
                renderItem={renderLikeItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#ec4899"
                        colors={['#ec4899']}
                    />
                }
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fef2f2',
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
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#fce7f3',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 24,
    },
    browseButton: {
        backgroundColor: '#ec4899',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 25,
    },
    browseButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    header: {
        padding: 20,
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 4,
    },
    listContent: {
        padding: 16,
        paddingTop: 8,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    photo: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#f3f4f6',
    },
    info: {
        flex: 1,
        marginLeft: 16,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    age: {
        fontSize: 16,
        color: '#6b7280',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 4,
    },
    location: {
        fontSize: 14,
        color: '#6b7280',
    },
    likedAt: {
        fontSize: 12,
        color: '#9ca3af',
        marginTop: 6,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    likeBackButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#ec4899',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#ec4899',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    chatButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#8B4513',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#8B4513',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
});

export default LikesReceived;
