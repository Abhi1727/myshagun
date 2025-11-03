import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import SwipeProfiles from './SwipeProfiles';
import Messages from './Messages';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from './ui/Button';

const Tab = createBottomTabNavigator();

const ProfileScreen = ({ navigation }) => {
    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        navigation.replace('Login');
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileIconContainer}>
                <Ionicons name="person-circle-outline" size={100} color="#ec4899" />
            </View>
            <Text style={styles.title}>My Profile</Text>
            <Text style={styles.subtitle}>Profile settings coming soon</Text>
            <Button
                onPress={handleLogout}
                variant="outline"
                style={styles.logoutButton}
            >
                <Ionicons name="log-out-outline" size={20} color="#ec4899" style={{ marginRight: 8 }} />
                <Text style={styles.logoutText}>Logout</Text>
            </Button>
        </View>
    );
};

const Home = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#ec4899',
                tabBarInactiveTintColor: '#9ca3af',
                tabBarStyle: { paddingBottom: 8, paddingTop: 8, height: 60 },
                headerShown: true,
                headerStyle: { backgroundColor: '#ec4899' },
                headerTintColor: 'white',
                headerTitleStyle: { fontWeight: 'bold' }
            }}
        >
            <Tab.Screen
                name="Swipe"
                component={SwipeProfiles}
                options={{
                    title: 'Browse',
                    tabBarLabel: 'Browse',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="heart" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Messages"
                component={Messages}
                options={{
                    title: 'Messages',
                    tabBarLabel: 'Messages',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="chatbubbles" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: 'Profile',
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fef2f2',
        padding: 24,
    },
    profileIconContainer: {
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
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
        marginBottom: 32,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 28,
    },
    logoutText: {
        color: '#ec4899',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default Home;
