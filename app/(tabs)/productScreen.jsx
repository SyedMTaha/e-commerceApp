import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

// Sample product data with specific categories
const initialProducts = [
  {
    id: '1',
    name: 'Nike Air Max',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    description: 'Comfortable running shoes with air cushioning',
    category: 'Shoes',
  },
  {
    id: '2',
    name: 'iPhone 13 Pro',
    price: 999.99,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
    description: 'Latest iPhone with pro camera system',
    category: 'Mobile',
  },
  {
    id: '3',
    name: 'Sony WH-1000XM4',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    description: 'Premium noise-cancelling headphones',
    category: 'Headphone',
  },
  {
    id: '4',
    name: 'MacBook Pro',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
    description: 'Powerful laptop for professionals',
    category: 'Laptop',
  },
  {
    id: '5',
    name: 'Samsung 4K TV',
    price: 799.99,
    image: 'https://images.unsplash.com/photo-1601944179066-29786cb9d32a',
    description: 'Smart TV with crystal clear display',
    category: 'TV',
  },
  {
    id: '6',
    name: 'MAC Lipstick Collection',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa',
    description: 'Luxurious lipstick collection with vibrant, long-lasting colors',
    category: 'Cosmetics',
  },
];

export default function ProductScreen() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Categories"));
      const categoriesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().CatName,
      }));

      // Add default categories if they don't exist
      const defaultCategories = ['Shoes', 'Mobile', 'Headphone', 'Laptop', 'TV', 'Cosmetics'];
      const existingCategoryNames = categoriesList.map(cat => cat.name);
      
      for (const defaultCat of defaultCategories) {
        if (!existingCategoryNames.includes(defaultCat)) {
          try {
            const docRef = await addDoc(collection(db, "Categories"), {
              CatName: defaultCat,
              createdAt: serverTimestamp(),
            });
            categoriesList.push({
              id: docRef.id,
              name: defaultCat,
            });
          } catch (error) {
            console.error(`Error adding category ${defaultCat}:`, error);
          }
        }
      }

      setCategories(categoriesList);
      setSelectedCategory(null); // Start with "All" selected
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let firebaseProducts = [];
      let productsQuery;
      
      if (selectedCategory) {
        productsQuery = query(
          collection(db, "Products"),
          where("category", "==", selectedCategory)
        );
      } else {
        productsQuery = collection(db, "Products");
      }
      
      const querySnapshot = await getDocs(productsQuery);
      firebaseProducts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter initial products based on selected category
      const filteredInitialProducts = selectedCategory
        ? initialProducts.filter(p => {
            const categoryDoc = categories.find(c => c.id === selectedCategory);
            return categoryDoc && p.category === categoryDoc.name; // Exact match
          })
        : initialProducts;

      // Combine and deduplicate products
      const allProducts = [...filteredInitialProducts, ...firebaseProducts];
      const uniqueProducts = allProducts.filter((product, index, self) =>
        index === self.findIndex((p) => p.id === product.id)
      );

      // Sort products by category
      const sortedProducts = uniqueProducts.sort((a, b) => {
        const categoryA = categories.find(c => c.id === a.category)?.name || a.category;
        const categoryB = categories.find(c => c.id === b.category)?.name || b.category;
        return categoryA.localeCompare(categoryB);
      });

      setProducts(sortedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const ProductCard = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push({
        pathname: "/productDetail",
        params: {
          id: item.id,
          name: item.name,
          price: item.price.toString(),
          image: item.image,
          description: item.description,
        }
      })}
    >
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
            onPress={() => alert('More Feature Coming Soon! 🚀')}
          >
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome to Our Store</Text>
        <Text style={styles.subTitle}>Discover Amazing Products</Text>
      </View>

      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          <TouchableOpacity
            style={[
              styles.categoryChip,
              !selectedCategory && styles.selectedCategoryChip,
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[
              styles.categoryChipText,
              !selectedCategory && styles.selectedCategoryChipText,
            ]}>
              All
            </Text>
          </TouchableOpacity>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.selectedCategoryChip,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={[
                styles.categoryChipText,
                selectedCategory === category.id && styles.selectedCategoryChipText,
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={({ item }) => <ProductCard item={item} />}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No products found in this category</Text>
          }
        />
      )}
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
  categoryContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryList: {
    paddingHorizontal: 15,
  },
  categoryChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedCategoryChip: {
    backgroundColor: '#007AFF',
    borderColor: '#0056b3',
  },
  categoryChipText: {
    color: '#333',
    fontSize: 14,
  },
  selectedCategoryChipText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
}); 