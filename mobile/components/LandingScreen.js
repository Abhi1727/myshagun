import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Button from './ui/Button';

const { width, height } = Dimensions.get('window');

const LandingScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <LinearGradient
                colors={['#ec4899', '#db2777', '#be185d']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Hero Section */}
                    <View style={styles.heroSection}>
                        <View style={styles.logoContainer}>
                            <Ionicons name="heart" size={80} color="white" />
                        </View>

                        <Text style={styles.title}>MyShagun</Text>
                        <Text style={styles.tagline}>
                            Find Your Perfect Match
                        </Text>
                        <Text style={styles.description}>
                            Connect with people who share your values, culture, and dreams
                        </Text>
                    </View>

                    {/* Features Section */}
                    <View style={styles.featuresSection}>
                        <View style={styles.featureCard}>
                            <View style={styles.featureIconContainer}>
                                <Ionicons name="shield-checkmark" size={32} color="#ec4899" />
                            </View>
                            <Text style={styles.featureTitle}>Safe & Secure</Text>
                            <Text style={styles.featureDescription}>
                                Verified profiles with advanced security
                            </Text>
                        </View>

                        <View style={styles.featureCard}>
                            <View style={styles.featureIconContainer}>
                                <Ionicons name="people" size={32} color="#ec4899" />
                            </View>
                            <Text style={styles.featureTitle}>Quality Matches</Text>
                            <Text style={styles.featureDescription}>
                                Smart algorithm for perfect compatibility
                            </Text>
                        </View>

                        <View style={styles.featureCard}>
                            <View style={styles.featureIconContainer}>
                                <Ionicons name="chatbubbles" size={32} color="#ec4899" />
                            </View>
                            <Text style={styles.featureTitle}>Easy Communication</Text>
                            <Text style={styles.featureDescription}>
                                Connect instantly with your matches
                            </Text>
                        </View>
                    </View>

                    {/* CTA Buttons */}
                    <View style={styles.ctaSection}>
                        <Button
                            onPress={() => navigation.navigate('Register')}
                            variant="primary"
                            size="lg"
                            style={styles.signupButton}
                        >
                            Create Account
                        </Button>

                        <Button
                            onPress={() => navigation.navigate('Login')}
                            variant="outline"
                            size="lg"
                            style={styles.loginButton}
                            textStyle={styles.loginButtonText}
                        >
                            Sign In
                        </Button>

                        <Text style={styles.footerText}>
                            Join thousands of happy couples
                        </Text>
                    </View>
                </ScrollView>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    heroSection: {
        alignItems: 'center',
        paddingTop: height * 0.1,
        paddingHorizontal: 24,
        marginBottom: 40,
    },
    logoContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 12,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    tagline: {
        fontSize: 24,
        color: 'white',
        marginBottom: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    featuresSection: {
        paddingHorizontal: 24,
        marginBottom: 40,
    },
    featureCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
    },
    featureIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#fef2f2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    featureTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
    },
    featureDescription: {
        fontSize: 15,
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: 22,
    },
    ctaSection: {
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    signupButton: {
        width: '100%',
        marginBottom: 16,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
    },
    loginButton: {
        width: '100%',
        backgroundColor: 'transparent',
        borderColor: 'white',
        borderWidth: 2,
        marginBottom: 24,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    footerText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        fontWeight: '500',
    },
});

export default LandingScreen;
