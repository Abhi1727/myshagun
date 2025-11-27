import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import SwipeProfiles from './SwipeProfiles';
import Messages from './Messages';
import ProfileView from './ProfileView';

const Tab = createBottomTabNavigator();

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
                component={ProfileView}
                options={{
                    title: 'My Profile',
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default Home;
