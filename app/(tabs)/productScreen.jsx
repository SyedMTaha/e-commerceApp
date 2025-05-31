import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';

// Sample product data
const products = [
  {
    id: '1',
    name: 'Nike Air Max',
    price: 129.99,
    image: 'https://via.placeholder.com/150',
    description: 'Comfortable running shoes with air cushioning',
  },
  {
    id: '2',
    name: 'iPhone 13 Pro',
    price: 999.99,
    image: 'https://via.placeholder.com/150',
    description: 'Latest iPhone with pro camera system',
  },
  {
    id: '3',
    name: 'Sony WH-1000XM4',
    price: 349.99,
    image: 'https://via.placeholder.com/150',
    description: 'Premium noise-cancelling headphones',
  },
  {
    id: '4',
    name: 'MacBook Pro',
    price: 1299.99,
    image: 'https://via.placeholder.com/150',
    description: 'Powerful laptop for professionals',
  },
  {
    id: '5',
    name: 'Samsung 4K TV',
    price: 799.99,
    image: 'https://via.placeholder.com/150',
    description: 'Smart TV with crystal clear display',
  },
];

const ProductCard = ({ item }) => (
  <View style={styles.card}>
    <Image
      source={{ uri: item.image }}
      style={styles.image}
      resizeMode="cover"
    />
    <View style={styles.cardContent}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => Alert.alert('Coming Soon! 🚀', 'More features will be added soon!')}
      >
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function ProductScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome to Our Store</Text>
        <Text style={styles.subTitle}>Discover Amazing Products</Text>
      </View>
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCard item={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subTitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  listContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  cardContent: {
    padding: 15,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginTop: 10,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 