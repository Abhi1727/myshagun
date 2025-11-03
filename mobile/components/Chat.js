import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Avatar from './ui/Avatar';

const Chat = ({ route, navigation }) => {
    const { conversationId, otherUserId, otherUserName } = route.params;

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUserId, setCurrentUserId] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const flatListRef = useRef(null);

    useEffect(() => {
        navigation.setOptions({ title: otherUserName });
        fetchUserAndMessages();
        const interval = setInterval(fetchMessages, 2000);
        return () => clearInterval(interval);
    }, []);

    const fetchUserAndMessages = async () => {
        try {
            const { data: userData } = await api.get('/auth');
            setCurrentUserId(userData.id);
            await fetchMessages();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchMessages = async () => {
        try {
            const { data } = await api.get(`/chat/messages/${conversationId}`);
            setMessages(data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const messageText = newMessage.trim();
        setSending(true);
        setNewMessage('');

        try {
            await api.post('/chat/send', {
                receiverId: otherUserId,
                message: messageText
            });

            await fetchMessages();
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        } catch (error) {
            console.error('Error sending message:', error);
            setNewMessage(messageText);
        } finally {
            setSending(false);
        }
    };

    const renderMessage = ({ item, index }) => {
        const isOwnMessage = item.sender_id === currentUserId;
        const prevMessage = index > 0 ? messages[index - 1] : null;
        const showAvatar = !prevMessage || prevMessage.sender_id !== item.sender_id;

        return (
            <View
                style={[
                    styles.messageRow,
                    isOwnMessage ? styles.ownMessageRow : styles.otherMessageRow
                ]}
            >
                {!isOwnMessage && (
                    <View style={styles.avatarContainer}>
                        {showAvatar ? (
                            <Avatar uri={null} size="sm" name={otherUserName} />
                        ) : (
                            <View style={styles.avatarPlaceholder} />
                        )}
                    </View>
                )}

                <View
                    style={[
                        styles.messageBubble,
                        isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble,
                        !showAvatar && styles.messageBubbleGrouped,
                    ]}
                >
                    <Text
                        style={[
                            styles.messageText,
                            isOwnMessage ? styles.ownMessageText : styles.otherMessageText
                        ]}
                    >
                        {item.message}
                    </Text>
                    <Text
                        style={[
                            styles.messageTime,
                            isOwnMessage ? styles.ownMessageTime : styles.otherMessageTime
                        ]}
                    >
                        {new Date(item.created_at).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit'
                        })}
                    </Text>
                </View>

                {isOwnMessage && <View style={styles.avatarPlaceholder} />}
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ec4899" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            {messages.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconContainer}>
                        <Ionicons name="chatbubble-ellipses-outline" size={60} color="#ec4899" />
                    </View>
                    <Text style={styles.emptyTitle}>Start the conversation!</Text>
                    <Text style={styles.emptyText}>
                        Send a message to {otherUserName.split(' ')[0]}
                    </Text>
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.messagesContainer}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    showsVerticalScrollIndicator={false}
                    inverted={false}
                />
            )}

            <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Type a message..."
                        placeholderTextColor="#9ca3af"
                        multiline
                        maxLength={500}
                    />
                </View>

                <TouchableOpacity
                    style={styles.sendButtonWrapper}
                    onPress={handleSendMessage}
                    disabled={!newMessage.trim() || sending}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={
                            !newMessage.trim() || sending
                                ? ['#d1d5db', '#9ca3af']
                                : ['#ec4899', '#db2777']
                        }
                        style={styles.sendButton}
                    >
                        {sending ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Ionicons name="send" size={20} color="white" />
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
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
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
    },
    messagesContainer: {
        padding: 16,
        paddingBottom: 8,
    },
    messageRow: {
        flexDirection: 'row',
        marginBottom: 8,
        alignItems: 'flex-end',
    },
    ownMessageRow: {
        justifyContent: 'flex-end',
    },
    otherMessageRow: {
        justifyContent: 'flex-start',
    },
    avatarContainer: {
        marginRight: 8,
        marginBottom: 2,
    },
    avatarPlaceholder: {
        width: 40,
    },
    messageBubble: {
        maxWidth: '70%',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    messageBubbleGrouped: {
        marginTop: 2,
    },
    ownMessageBubble: {
        backgroundColor: '#ec4899',
        borderBottomRightRadius: 4,
    },
    otherMessageBubble: {
        backgroundColor: 'white',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    ownMessageText: {
        color: 'white',
    },
    otherMessageText: {
        color: '#1f2937',
    },
    messageTime: {
        fontSize: 11,
        marginTop: 4,
        fontWeight: '500',
    },
    ownMessageTime: {
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'right',
    },
    otherMessageTime: {
        color: '#9ca3af',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 12,
        paddingBottom: Platform.OS === 'ios' ? 16 : 12,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        alignItems: 'flex-end',
    },
    inputWrapper: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 8,
        maxHeight: 100,
    },
    input: {
        fontSize: 16,
        color: '#1f2937',
        maxHeight: 80,
    },
    sendButtonWrapper: {
        marginBottom: 2,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Chat;
