import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    StatusBar,
    Image,
    TouchableOpacity,
    Animated,
    ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const LandingScreen = ({ navigation }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            
            {/* Background with gradient overlay */}
            <ImageBackground
                source={require('../assets/hero-couple.jpg')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.3)', 'rgba(236,72,153,0.85)', 'rgba(190,24,93,0.95)']}
                    style={styles.gradient}
                    locations={[0, 0.5, 1]}
                >
                    {/* Top Section - Logo & Branding */}
                    <Animated.View 
                        style={[
                            styles.topSection,
                            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                        ]}
                    >
                        <Image
                            source={require('../assets/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.brandName}>MyShagun</Text>
                        <Text style={styles.tagline}>Find Your Soulmate</Text>
                    </Animated.View>

                    {/* Middle Section - Hero Text */}
                    <View style={styles.middleSection}>
                        <Text style={styles.heroTitle}>Where Destiny{'\n'}Meets Technology</Text>
                        <Text style={styles.heroSubtitle}>
                            Join millions finding meaningful connections and beautiful beginnings
                        </Text>
                        
                        {/* Trust Badges */}
                        <View style={styles.trustBadges}>
                            <View style={styles.badge}>
                                <Ionicons name="shield-checkmark" size={16} color="#fbbf24" />
                                <Text style={styles.badgeText}>Verified Profiles</Text>
                            </View>
                            <View style={styles.badge}>
                                <Ionicons name="heart" size={16} color="#fbbf24" />
                                <Text style={styles.badgeText}>6M+ Matches</Text>
                            </View>
                        </View>
                    </View>

                    {/* Bottom Section - CTA Buttons */}
                    <View style={styles.bottomSection}>
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={() => navigation.navigate('Register')}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={['#ffffff', '#f9fafb']}
                                style={styles.buttonGradient}
                            >
                                <Text style={styles.primaryButtonText}>Create Free Account</Text>
                                <Ionicons name="arrow-forward" size={20} color="#ec4899" />
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={() => navigation.navigate('Login')}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.secondaryButtonText}>Already have an account? </Text>
                            <Text style={styles.signInText}>Sign In</Text>
                        </TouchableOpacity>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <View style={styles.ratingContainer}>
                                <Ionicons name="star" size={14} color="#fbbf24" />
                                <Ionicons name="star" size={14} color="#fbbf24" />
                                <Ionicons name="star" size={14} color="#fbbf24" />
                                <Ionicons name="star" size={14} color="#fbbf24" />
                                <Ionicons name="star" size={14} color="#fbbf24" />
                            </View>
                            <Text style={styles.footerText}>America's Most Trusted Matrimony Platform</Text>
                        </View>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    gradient: {
        flex: 1,
        paddingTop: StatusBar.currentHeight || 50,
    },
    topSection: {
        alignItems: 'center',
        paddingTop: 20,
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 12,
    },
    brandName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    tagline: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 4,
        fontWeight: '500',
    },
    middleSection: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    heroTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        lineHeight: 44,
        marginBottom: 16,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    heroSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    trustBadges: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
        gap: 16,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    badgeText: {
        fontSize: 12,
        color: 'white',
        fontWeight: '600',
    },
    bottomSection: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    primaryButton: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 32,
        gap: 8,
    },
    primaryButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ec4899',
    },
    secondaryButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
    },
    secondaryButtonText: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.8)',
    },
    signInText: {
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    footer: {
        alignItems: 'center',
        marginTop: 16,
    },
    ratingContainer: {
        flexDirection: 'row',
        gap: 2,
        marginBottom: 8,
    },
    footerText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '500',
    },
});

export default LandingScreen;
