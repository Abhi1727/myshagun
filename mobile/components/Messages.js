import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Image
} from 'react-native';
import api from '../config/api';

const Messages = ({ navigation }) => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConversations();
        const interval = setInterval(fetchConversations, 5000); // Refresh every 5s
        return () => clearInterval(interval);
    }, []);

    const fetchConversations = async () => {
        try {
            const { data } = await api.get('/chat/conversations');
            setConversations(data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        } else if (days === 1) {
            return 'Yesterday';
        } else if (days < 7) {
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const renderConversation = ({ item }) => (
        <TouchableOpacity
            style={styles.conversationCard}
            onPress={() => navigation.navigate('Chat', {
                conversationId: item.id,
                otherUserId: item.other_user_id,
                otherUserName: `${item.other_first_name} ${item.other_last_name}`
            })}
        >
            <Image
                source={
                    item.other_photo
                        ? { uri: item.other_photo }
                        : require('../assets/icon.png')
                }
                style={styles.avatar}
            />

            <View style={styles.conversationInfo}>
                <View style={styles.conversationHeader}>
                    <Text style={styles.name}>
                        {item.other_first_name} {item.other_last_name}
                    </Text>
                    <Text style={styles.time}>{formatTime(item.last_message_at)}</Text>
                </View>

                {item.last_message && (
                    <Text style={styles.lastMessage} numberOfLines={1}>
                        {item.last_message}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ec4899" />
            </View>
        );
    }

    if (conversations.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No Messages Yet</Text>
                <Text style={styles.emptyText}>Start swiping to find matches!</Text>
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
            <Text style={styles.header}>Messages</Text>
            <FlatList
                data={conversations}
                renderItem={renderConversation}
                keyExtractor={(item) => item.id}
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
    },
    browseButton: {
        backgroundColor: '#ec4899',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 24,
    },
    browseButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        padding: 16,
        color: '#ec4899',
    },
    conversationCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#f3f4f6',
    },
    conversationInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    conversationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    time: {
        fontSize: 12,
        color: '#9ca3af',
    },
    lastMessage: {
        fontSize: 14,
        color: '#6b7280',
    },
});

export default Messages;
