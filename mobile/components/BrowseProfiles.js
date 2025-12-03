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
    TextInput,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

const BrowseProfiles = ({ navigation }) => {
    const [profiles, setProfiles] = useState([]);
    const [filteredProfiles, setFilteredProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [likingProfile, setLikingProfile] = useState(null);

    useEffect(() => {
        fetchProfiles();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredProfiles(profiles);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = profiles.filter(profile => 
                profile.first_name?.toLowerCase().includes(query) ||
                profile.last_name?.toLowerCase().includes(query) ||
                profile.city?.toLowerCase().includes(query) ||
                profile.state?.toLowerCase().includes(query) ||
                profile.profession?.toLowerCase().includes(query)
            );
            setFilteredProfiles(filtered);
        }
    }, [searchQuery, profiles]);

    const fetchProfiles = async () => {
        try {
            const { data } = await api.get('/profiles/browse');
            setProfiles(data);
            setFilteredProfiles(data);
        } catch (error) {
            console.error('Error fetching profiles:', error);
            Alert.alert('Error', 'Failed to load profiles');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchProfiles();
    };

    const handleLike = async (profile) => {
        setLikingProfile(profile.id);
        try {
            const { data } = await api.post('/chat/like', { likedUserId: profile.id });
            
            if (data.match) {
                Alert.alert(
                    "🎉 It's a Match!",
                    `You and ${profile.first_name} liked each other!`,
                    [
                        { text: 'Keep Browsing', style: 'cancel' },
                        { text: 'Send Message', onPress: () => navigation.navigate('Messages') }
                    ]
                );
            } else {
                Alert.alert('Liked!', `You liked ${profile.first_name}'s profile`);
            }
        } catch (error) {
            console.error('Like error:', error);
            Alert.alert('Error', 'Failed to like profile');
        } finally {
            setLikingProfile(null);
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

    const renderProfileCard = ({ item }) => (
        <View style={styles.card}>
            <Image
                source={
                    item.profile_photo_url
                        ? { uri: item.profile_photo_url }
                        : require('../assets/icon.png')
                }
                style={styles.photo}
            />
            <View style={styles.cardContent}>
                <View style={styles.nameRow}>
                    <Text style={styles.name} numberOfLines={1}>
                        {item.first_name}
                    </Text>
                    {item.date_of_birth && (
                        <Text style={styles.age}>, {getAge(item.date_of_birth)}</Text>
                    )}
                </View>
                {item.city && (
                    <View style={styles.locationRow}>
                        <Ionicons name="location-outline" size={12} color="#6b7280" />
                        <Text style={styles.location} numberOfLines={1}>
                            {item.city}
                        </Text>
                    </View>
                )}
                {item.profession && (
                    <Text style={styles.profession} numberOfLines={1}>
                        {item.profession}
                    </Text>
                )}
            </View>
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={[styles.likeButton, likingProfile === item.id && styles.buttonDisabled]}
                    onPress={() => handleLike(item)}
                    disabled={likingProfile === item.id}
                >
                    {likingProfile === item.id ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Ionicons name="heart" size={18} color="white" />
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.chatButton}
                    onPress={() => handleStartChat(item)}
                >
                    <Ionicons name="chatbubble" size={18} color="white" />
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

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by name, city, profession..."
                    placeholderTextColor="#9ca3af"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={20} color="#9ca3af" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Results count */}
            <View style={styles.resultsHeader}>
                <Text style={styles.resultsCount}>
                    {filteredProfiles.length} {filteredProfiles.length === 1 ? 'profile' : 'profiles'}
                </Text>
            </View>

            {filteredProfiles.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="search-outline" size={60} color="#d1d5db" />
                    <Text style={styles.emptyText}>No profiles found</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredProfiles}
                    renderItem={renderProfileCard}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
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
            )}
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        margin: 16,
        marginBottom: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#1f2937',
    },
    resultsHeader: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    resultsCount: {
        fontSize: 14,
        color: '#6b7280',
        fontWeight: '500',
    },
    listContent: {
        padding: 16,
        paddingTop: 8,
    },
    row: {
        justifyContent: 'space-between',
    },
    card: {
        width: CARD_WIDTH,
        backgroundColor: 'white',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    photo: {
        width: '100%',
        height: CARD_WIDTH * 1.1,
        backgroundColor: '#f3f4f6',
    },
    cardContent: {
        padding: 12,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
        maxWidth: '70%',
    },
    age: {
        fontSize: 14,
        color: '#6b7280',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 4,
    },
    location: {
        fontSize: 13,
        color: '#6b7280',
        flex: 1,
    },
    profession: {
        fontSize: 12,
        color: '#9ca3af',
        marginTop: 4,
    },
    actionButtons: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        flexDirection: 'row',
        gap: 6,
    },
    likeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
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
        width: 36,
        height: 36,
        borderRadius: 18,
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyText: {
        fontSize: 16,
        color: '#6b7280',
        marginTop: 16,
    },
});

export default BrowseProfiles;
