import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';

export default function App() {
  // --- STATE MANAGEMENT ---
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState([]); // Menyimpan array angka
  const [zeroHits, setZeroHits] = useState(0); // Hitungan 0 berturut-turut
  const [isLocked, setIsLocked] = useState(false); // Status kunci tombol

  // --- LOGIC ---

  // Helper: Cek Ganjil/Genap
  const getParity = (val) => (val % 2 === 0 ? 'Genap' : 'Ganjil');

  // Fungsi Utama untuk mengubah nilai (Tambah/Kurang)
  const updateValue = (type) => {
    if (isLocked) return;

    let newValue = count;
    
    if (type === 'INCREMENT') {
      newValue = count + 1;
    } else if (type === 'DECREMENT') {
      // Logic: Batasi di 0 agar bisa memicu kondisi "0 berturut-turut"
      newValue = count > 0 ? count - 1 : 0;
    }

    // 1. Update History (Max 5 items, LIFO)
    const newHistory = [newValue, ...history].slice(0, 5);
    setHistory(newHistory);
    setCount(newValue);

    // 2. Cek Logika Consecutive Zero
    let newZeroHits = zeroHits;
    if (newValue === 0) {
      newZeroHits = zeroHits + 1;
    } else {
      newZeroHits = 0; // Reset jika muncul angka bukan 0
    }
    setZeroHits(newZeroHits);

    // 3. Cek apakah sudah 3x berturut-turut
    if (newZeroHits >= 3) {
      setIsLocked(true);
      Alert.alert(
        "Peringatan Logika",
        "Nilai 0 tercapai 3 kali berturut-turut! Tombol +/- dinonaktifkan.",
        [{ text: "OK" }]
      );
    }
  };

  // Fungsi Reset
  const handleReset = () => {
    const resetValue = 0;
    
    // Reset state logika
    setCount(resetValue);
    setZeroHits(0);
    setIsLocked(false);

    // Update history sesuai instruksi (Reset dianggap sebagai aksi perubahan)
    const newHistory = [resetValue, ...history].slice(0, 5);
    setHistory(newHistory);
  };

  // --- UI RENDER ---
  const renderHistoryItem = ({ item, index }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyBadge}>
        <Text style={styles.historyIndex}>{index + 1}</Text>
      </View>
      <View>
        <Text style={styles.historyText}>Nilai: {item}</Text>
        <Text style={styles.historySubtext}>{getParity(item)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f0f0" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Buttons of Logic</Text>
      </View>

      <View style={styles.content}>
        {/* Tampilan Utama Angka */}
        <View style={styles.displayContainer}>
          <Text style={styles.label}>Nilai Saat Ini:</Text>
          <Text style={styles.counterText}>{count}</Text>
          
          <View style={[
            styles.badge, 
            { backgroundColor: count % 2 === 0 ? '#BBDEFB' : '#FFE0B2' }
          ]}>
            <Text style={[
              styles.badgeText,
              { color: count % 2 === 0 ? '#0D47A1' : '#E65100' }
            ]}>
              {getParity(count)}
            </Text>
          </View>
        </View>

        {/* Tombol Kontrol */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.btn, styles.btnAction, isLocked && styles.btnDisabled]}
            onPress={() => updateValue('DECREMENT')}
            disabled={isLocked}
          >
            <Text style={styles.btnText}>Kurang (-)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.btnReset]}
            onPress={handleReset}
          >
            <Text style={[styles.btnText, styles.btnResetText]}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.btnAction, isLocked && styles.btnDisabled]}
            onPress={() => updateValue('INCREMENT')}
            disabled={isLocked}
          >
            <Text style={styles.btnText}>Tambah (+)</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Riwayat List */}
        <Text style={styles.historyHeader}>Riwayat 5 Perubahan Terakhir:</Text>
        <FlatList
          data={history}
          keyExtractor={(item, index) => index.toString() + Math.random()}
          renderItem={renderHistoryItem}
          style={styles.list}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#6200EE',
    alignItems: 'center',
    elevation: 4,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  displayContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  counterText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#333',
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  badgeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    minWidth: 90,
  },
  btnAction: {
    backgroundColor: '#6200EE',
  },
  btnReset: {
    backgroundColor: '#FFCDD2',
  },
  btnDisabled: {
    backgroundColor: '#BDBDBD',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  btnResetText: {
    color: '#B71C1C',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 16,
  },
  historyHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  list: {
    flex: 1,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 1,
  },
  historyBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  historyIndex: {
    fontWeight: 'bold',
    color: '#666',
  },
  historyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  historySubtext: {
    fontSize: 14,
    color: '#757575',
  },
});