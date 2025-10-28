import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SwipeProfiles from './SwipeProfiles';
import Messages from './Messages';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

const ProfileScreen = ({ navigation }) => {
    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        navigation.replace('Login');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Profile</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
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
                    tabBarIcon: () => <Text style={{ fontSize: 24 }}>♥</Text>,
                }}
            />
            <Tab.Screen
                name="Messages"
                component={Messages}
                options={{
                    title: 'Messages',
                    tabBarLabel: 'Messages',
                    tabBarIcon: () => <Text style={{ fontSize: 24 }}>💬</Text>,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: 'Profile',
                    tabBarLabel: 'Profile',
                    tabBarIcon: () => <Text style={{ fontSize: 24 }}>👤</Text>,
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
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ec4899',
        marginBottom: 32,
    },
    logoutButton: {
        backgroundColor: '#ef4444',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 24,
    },
    logoutText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Home;
