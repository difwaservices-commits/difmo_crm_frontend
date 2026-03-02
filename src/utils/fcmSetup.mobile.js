/**
 * FCM Push Notification Setup for React Native Mobile App
 * ────────────────────────────────────────────────────────
 * 
 * 1. Install Firebase:
 *    npm install @react-native-firebase/app @react-native-firebase/messaging
 * 
 * 2. Follow platform setup:
 *    - Android: google-services.json in android/app/
 *    - iOS: GoogleService-Info.plist in iOS project + APNs cert in Firebase console
 * 
 * 3. Use this helper in your app:
 */

import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE = 'https://difmo-crm-backend.onrender.com'; // or your local dev URL

/**
 * Request notification permission and register FCM token with the backend.
 * Call this after user login.
 */
export async function registerFcmToken(authToken) {
    try {
        // 1. Request permission (iOS requires explicit permission)
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
            console.warn('[FCM] Notification permission denied');
            return;
        }

        // 2. Get FCM token
        const fcmToken = await messaging().getToken();
        if (!fcmToken) return;

        // 3. Save to AsyncStorage so we can remove it on logout
        await AsyncStorage.setItem('fcmToken', fcmToken);

        // 4. Register with backend
        await axios.post(
            `${API_BASE}/notifications/fcm-token`,
            {
                token: fcmToken,
                platform: Platform.OS, // 'android' or 'ios'
                deviceId: await getDeviceId(), // optional, see below
            },
            {
                headers: { Authorization: `Bearer ${authToken}` },
            },
        );

        console.log('[FCM] Token registered:', fcmToken.substring(0, 20) + '...');

        // 5. Listen for token refresh
        return messaging().onTokenRefresh(async (newToken) => {
            await AsyncStorage.setItem('fcmToken', newToken);
            await axios.post(
                `${API_BASE}/notifications/fcm-token`,
                { token: newToken, platform: Platform.OS },
                { headers: { Authorization: `Bearer ${authToken}` } },
            );
        });
    } catch (err) {
        console.error('[FCM] Token registration failed:', err);
    }
}

/**
 * Remove FCM token on logout.
 */
export async function unregisterFcmToken(authToken) {
    try {
        const fcmToken = await AsyncStorage.getItem('fcmToken');
        if (!fcmToken) return;

        await axios.delete(
            `${API_BASE}/notifications/fcm-token`,
            {
                data: { token: fcmToken },
                headers: { Authorization: `Bearer ${authToken}` },
            },
        );

        await AsyncStorage.removeItem('fcmToken');
        console.log('[FCM] Token unregistered');
    } catch (err) {
        console.error('[FCM] Token unregister failed:', err);
    }
}

/**
 * Setup notification handlers for foreground + background messages.
 * Call this once at app startup (e.g., in App.js).
 */
export function setupNotificationHandlers(navigation) {
    // Foreground messages (app is open)
    const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
        console.log('[FCM] Foreground message:', remoteMessage);
        // Show an in-app toast / alert
        Alert.alert(
            remoteMessage.notification?.title || 'New Notification',
            remoteMessage.notification?.body || '',
        );
    });

    // Background messages (app is in background or quit)
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log('[FCM] Background message:', remoteMessage);
        // This is handled by the system automatically
    });

    // When user taps a notification from the background
    const unsubscribeOpenedApp = messaging().onNotificationOpenedApp((remoteMessage) => {
        console.log('[FCM] Tapped notification (background):', remoteMessage);
        // Navigate based on data payload
        if (remoteMessage.data?.screen) {
            navigation.navigate(remoteMessage.data.screen);
        }
    });

    // When app was quit and user tapped a notification
    messaging()
        .getInitialNotification()
        .then((remoteMessage) => {
            if (remoteMessage) {
                console.log('[FCM] Initial notification:', remoteMessage);
                if (remoteMessage.data?.screen) {
                    navigation.navigate(remoteMessage.data.screen);
                }
            }
        });

    return () => {
        unsubscribeForeground();
        unsubscribeOpenedApp();
    };
}

// Helper to get device ID (install react-native-device-info for real implementation)
async function getDeviceId() {
    try {
        const DeviceInfo = require('react-native-device-info');
        return await DeviceInfo.getUniqueId();
    } catch {
        return 'unknown';
    }
}
