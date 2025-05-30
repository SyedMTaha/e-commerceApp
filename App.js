"use client"

import { useState, useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Icon from "react-native-vector-icons/Ionicons"

// Import screens
import SignupScreen from "./src/screens/SignUpScreen"
import LoginScreen from "./src/screens/LoginScreen"
import HomeScreen from "./src/screens/HomeScreen"
import ProductDetailScreen from "./src/screens/ProductDetailScreen"
import DashboardScreen from "./src/screens/DashboardScreen"
import AddProductScreen from "./src/screens/AddProductScreen"
import EditProductScreen from "./src/screens/EditProductScreen"

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = ""

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Dashboard") {
            iconName = focused ? "grid" : "grid-outline"
          }

          return <Icon name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#e0e0e0",
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
    </Tab.Navigator>
  )
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkLoginStatus()
  }, [])

  const checkLoginStatus = async () => {
    try {
      const user = await AsyncStorage.getItem("currentUser")
      setIsLoggedIn(!!user)
    } catch (error) {
      console.error("Error checking login status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return null // You can add a loading screen here
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
            <Stack.Screen name="AddProduct" component={AddProductScreen} />
            <Stack.Screen name="EditProduct" component={EditProductScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
