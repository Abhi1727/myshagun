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
    ActivityIndicator
} from 'react-native';
import api from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        const interval = setInterval(fetchMessages, 2000); // Poll every 2s
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

        setSending(true);
        try {
            await api.post('/chat/send', {
                receiverId: otherUserId,
                message: newMessage.trim()
            });

            setNewMessage('');
            await fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    const renderMessage = ({ item }) => {
        const isOwnMessage = item.sender_id === currentUserId;

        return (
            <View
                style={[
                    styles.messageContainer,
                    isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer
                ]}
            >
                <View
                    style={[
                        styles.messageBubble,
                        isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble
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
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messagesContainer}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message..."
                    multiline
                    maxLength={500}
                />
                <TouchableOpacity
                    style={[styles.sendButton, (!newMessage.trim() || sending) && styles.sendButtonDisabled]}
                    onPress={handleSendMessage}
                    disabled={!newMessage.trim() || sending}
                >
                    <Text style={styles.sendButtonText}>{sending ? '...' : '➤'}</Text>
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
    },
    messagesContainer: {
        padding: 16,
    },
    messageContainer: {
        marginBottom: 12,
        maxWidth: '80%',
    },
    ownMessageContainer: {
        alignSelf: 'flex-end',
    },
    otherMessageContainer: {
        alignSelf: 'flex-start',
    },
    messageBubble: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    ownMessageBubble: {
        backgroundColor: '#ec4899',
    },
    otherMessageBubble: {
        backgroundColor: 'white',
    },
    messageText: {
        fontSize: 16,
    },
    ownMessageText: {
        color: 'white',
    },
    otherMessageText: {
        color: '#1f2937',
    },
    messageTime: {
        fontSize: 10,
        marginTop: 4,
    },
    ownMessageTime: {
        color: 'rgba(255,255,255,0.7)',
    },
    otherMessageTime: {
        color: '#9ca3af',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 8,
        maxHeight: 100,
    },
    sendButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#ec4899',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
    sendButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default Chat;
