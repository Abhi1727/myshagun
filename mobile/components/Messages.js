import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../config/api';
import Avatar from './ui/Avatar';
import Button from './ui/Button';

const Messages = ({ navigation }) => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchConversations();
        const interval = setInterval(fetchConversations, 5000);
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
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchConversations();
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

    const renderConversation = ({ item, index }) => (
        <TouchableOpacity
            style={[
                styles.conversationCard,
                index === 0 && styles.firstCard,
            ]}
            onPress={() => navigation.navigate('Chat', {
                conversationId: item.id,
                otherUserId: item.other_user_id,
                otherUserName: `${item.other_first_name} ${item.other_last_name}`
            })}
            activeOpacity={0.7}
        >
            <Avatar
                uri={item.other_photo}
                size="md"
                name={`${item.other_first_name} ${item.other_last_name}`}
            />

            <View style={styles.conversationContent}>
                <View style={styles.conversationHeader}>
                    <Text style={styles.name} numberOfLines={1}>
                        {item.other_first_name} {item.other_last_name}
                    </Text>
                    <Text style={styles.time}>{formatTime(item.last_message_at)}</Text>
                </View>

                {item.last_message && (
                    <Text style={styles.lastMessage} numberOfLines={2}>
                        {item.last_message}
                    </Text>
                )}
            </View>

            <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
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
                <View style={styles.emptyIconContainer}>
                    <Ionicons name="chatbubbles-outline" size={80} color="#ec4899" />
                </View>
                <Text style={styles.emptyTitle}>No Messages Yet</Text>
                <Text style={styles.emptyText}>
                    Start swiping to find your perfect match!
                </Text>
                <Button
                    onPress={() => navigation.navigate('Swipe')}
                    style={styles.browseButton}
                >
                    <Ionicons name="heart" size={20} color="white" style={styles.buttonIcon} />
                    <Text style={styles.browseButtonText}>Browse Profiles</Text>
                </Button>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={conversations}
                renderItem={renderConversation}
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
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    emptyTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#1f2937',
    },
    emptyText: {
        fontSize: 16,
        color: '#6b7280',
        marginBottom: 32,
        textAlign: 'center',
        lineHeight: 24,
    },
    browseButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 28,
    },
    buttonIcon: {
        marginRight: 8,
    },
    browseButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    listContent: {
        padding: 16,
        paddingTop: 8,
    },
    conversationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        marginBottom: 12,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    firstCard: {
        marginTop: 8,
    },
    conversationContent: {
        flex: 1,
        marginLeft: 12,
        marginRight: 8,
    },
    conversationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    name: {
        fontSize: 17,
        fontWeight: '600',
        color: '#1f2937',
        flex: 1,
        marginRight: 8,
    },
    time: {
        fontSize: 13,
        color: '#9ca3af',
        fontWeight: '500',
    },
    lastMessage: {
        fontSize: 15,
        color: '#6b7280',
        lineHeight: 20,
    },
});

export default Messages;
