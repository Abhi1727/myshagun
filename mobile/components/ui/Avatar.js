import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const Avatar = ({ uri, size = 'md', name }) => {
    const sizeStyle = styles[size];
    const textSizeStyle = styles[`text_${size}`];

    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name[0].toUpperCase();
    };

    return (
        <View style={[styles.container, sizeStyle]}>
            {uri ? (
                <Image source={{ uri }} style={[styles.image, sizeStyle]} />
            ) : (
                <View style={[styles.placeholder, sizeStyle]}>
                    <Text style={[styles.initials, textSizeStyle]}>
                        {getInitials(name)}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 9999,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        backgroundColor: '#ec4899',
        justifyContent: 'center',
        alignItems: 'center',
    },
    initials: {
        color: 'white',
        fontWeight: 'bold',
    },
    sm: {
        width: 40,
        height: 40,
    },
    md: {
        width: 56,
        height: 56,
    },
    lg: {
        width: 80,
        height: 80,
    },
    xl: {
        width: 120,
        height: 120,
    },
    text_sm: {
        fontSize: 14,
    },
    text_md: {
        fontSize: 20,
    },
    text_lg: {
        fontSize: 28,
    },
    text_xl: {
        fontSize: 42,
    },
});

export default Avatar;
