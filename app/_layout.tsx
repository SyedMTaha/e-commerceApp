import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="signUp" 
          options={{ 
            title: 'Create Account', 
            headerBackTitle: 'Back',
            presentation: 'modal',
            headerStyle: {
              backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
            },
            headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
            headerRight: () => (
              <MaterialCommunityIcons 
                name="account-plus" 
                size={24} 
                color={colorScheme === 'dark' ? '#fff' : '#000'} 
                style={{ marginRight: 10 }}
              />
            ),
          }} 
        />
        <Stack.Screen 
          name="signIn" 
          options={{ 
            title: 'Sign In', 
            headerBackTitle: 'Back',
            presentation: 'modal',
            headerStyle: {
              backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
            },
            headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
            headerRight: () => (
              <MaterialCommunityIcons 
                name="login" 
                size={24} 
                color={colorScheme === 'dark' ? '#fff' : '#000'} 
                style={{ marginRight: 10 }}
              />
            ),
          }} 
        />
        <Stack.Screen 
          name="adminLogin" 
          options={{ 
            title: 'Admin Login', 
            headerBackTitle: 'Back',
            presentation: 'modal',
            headerStyle: {
              backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
            },
            headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
            headerRight: () => (
              <MaterialIcons 
                name="admin-panel-settings" 
                size={24} 
                color={colorScheme === 'dark' ? '#fff' : '#000'} 
                style={{ marginRight: 10 }}
              />
            ),
          }} 
        />
        <Stack.Screen 
          name="productDetail" 
          options={{ 
            title: 'Product Details',
            headerBackTitle: 'Back',
            headerStyle: {
              backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
            },
            headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
            headerRight: () => (
              <MaterialIcons 
                name="shopping-cart" 
                size={24} 
                color={colorScheme === 'dark' ? '#fff' : '#000'} 
                style={{ marginRight: 10 }}
              />
            ),
          }} 
        />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
