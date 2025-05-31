import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

// Sample product data
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

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    category: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Categories"));
      const categoriesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().CatName,
      }));
      setCategories(categoriesList);
    } catch (error) {
      console.error("Error fetching categories:", error);
      Alert.alert('Error', 'Failed to load categories');
    }
  };

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.image && newProduct.description) {
      const productToAdd = {
        ...newProduct,
        id: (products.length + 1).toString(),
        price: parseFloat(newProduct.price),
      };
      setProducts([...products, productToAdd]);
      setNewProduct({
        name: '',
        price: '',
        image: '',
        description: '',
        category: '',
      });
      setModalVisible(false);
      Alert.alert('Success', 'Product added successfully!');
    } else {
      Alert.alert('Error', 'Please fill all fields!');
    }
  };

  const handleEditProduct = () => {
    if (editingProduct) {
      const updatedProducts = products.map(product =>
        product.id === editingProduct.id ? editingProduct : product
      );
      setProducts(updatedProducts);
      setEditingProduct(null);
      setModalVisible(false);
      Alert.alert('Success', 'Product updated successfully!');
    }
  };

  const handleDeleteProduct = (productId) => {
    const updatedProducts = products.filter(product => product.id !== productId);
    setProducts(updatedProducts);
    Alert.alert('Success', 'Product deleted successfully!');
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setModalVisible(true);
  };

  const openEditModal = (product) => {
    setEditingProduct({ ...product });
    setModalVisible(true);
  };

  const ProductCard = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        <Text style={styles.productCategory}>Category: {item.category}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => openEditModal(item)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteProduct(item.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ProductForm = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.formContainer}
    >
      <ScrollView>
        <Text style={styles.modalTitle}>
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Product Name"
          value={editingProduct ? editingProduct.name : newProduct.name}
          onChangeText={(text) =>
            editingProduct
              ? setEditingProduct({ ...editingProduct, name: text })
              : setNewProduct({ ...newProduct, name: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Price"
          keyboardType="numeric"
          value={editingProduct ? editingProduct.price.toString() : newProduct.price}
          onChangeText={(text) =>
            editingProduct
              ? setEditingProduct({ ...editingProduct, price: text })
              : setNewProduct({ ...newProduct, price: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Image URL"
          value={editingProduct ? editingProduct.image : newProduct.image}
          onChangeText={(text) =>
            editingProduct
              ? setEditingProduct({ ...editingProduct, image: text })
              : setNewProduct({ ...newProduct, image: text })
          }
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          value={editingProduct ? editingProduct.description : newProduct.description}
          onChangeText={(text) =>
            editingProduct
              ? setEditingProduct({ ...editingProduct, description: text })
              : setNewProduct({ ...newProduct, description: text })
          }
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={editingProduct ? handleEditProduct : handleAddProduct}
        >
          <Text style={styles.buttonText}>
            {editingProduct ? 'Update Product' : 'Add Product'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.addButton, styles.categoryButton]}
            onPress={() => router.push('/categoryManagement')}
          >
            <Text style={styles.buttonText}>Categories</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
            <Text style={styles.buttonText}>Add Product</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCard item={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.productList}
      />

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalView}>
          <ProductForm />
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setModalVisible(false);
              setEditingProduct(null);
            }}
          >
            <Text style={[styles.buttonText, styles.cancelText]}>Cancel</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  addButton: {
    backgroundColor: '#2ecc71',
    padding: 10,
    borderRadius: 8,
  },
  categoryButton: {
    backgroundColor: '#3498db',
  },
  productList: {
    padding: 15,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 14,
    color: '#2ecc71',
    marginTop: 5,
  },
  productCategory: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  actionButtons: {
    flexDirection: 'column',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#3498db',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalView: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  cancelText: {
    color: '#e74c3c',
  },
}); 