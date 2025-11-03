import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Button = ({
    children,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    style,
    textStyle
}) => {
    const buttonStyles = [
        styles.base,
        styles[size],
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'outline' && styles.outline,
        disabled && styles.disabled,
        style
    ];

    const textStyles = [
        styles.text,
        styles[`text_${size}`],
        variant === 'primary' && styles.textPrimary,
        variant === 'secondary' && styles.textSecondary,
        variant === 'outline' && styles.textOutline,
        disabled && styles.textDisabled,
        textStyle
    ];

    if (variant === 'primary' && !disabled) {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled || loading}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={['#ec4899', '#db2777']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.base, styles[size], style]}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={textStyles}>{children}</Text>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' ? '#ec4899' : 'white'} />
            ) : typeof children === 'string' ? (
                <Text style={textStyles}>{children}</Text>
            ) : (
                children
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    sm: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    md: {
        paddingVertical: 14,
        paddingHorizontal: 24,
    },
    lg: {
        paddingVertical: 18,
        paddingHorizontal: 32,
    },
    primary: {
        backgroundColor: '#ec4899',
    },
    secondary: {
        backgroundColor: '#fef2f2',
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#ec4899',
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        fontWeight: '600',
    },
    text_sm: {
        fontSize: 14,
    },
    text_md: {
        fontSize: 16,
    },
    text_lg: {
        fontSize: 18,
    },
    textPrimary: {
        color: 'white',
    },
    textSecondary: {
        color: '#ec4899',
    },
    textOutline: {
        color: '#ec4899',
    },
    textDisabled: {
        color: '#9ca3af',
    },
});

export default Button;
