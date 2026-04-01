import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const icones = [
  { lib: 'ionicons', nome: 'heart',           label: 'Curtir'       },
  { lib: 'ionicons', nome: 'star',            label: 'Favorito'     },
  { lib: 'ionicons', nome: 'home',            label: 'Home'         },
  { lib: 'ionicons', nome: 'search',          label: 'Buscar'       },
  { lib: 'ionicons', nome: 'settings',        label: 'Config'       },
  { lib: 'ionicons', nome: 'notifications',   label: 'Notificações' },
  { lib: 'material', nome: 'school',          label: 'Escola'       },
  { lib: 'material', nome: 'code',            label: 'Código'       },
  { lib: 'material', nome: 'coffee',          label: 'Café'         },
  { lib: 'material', nome: 'smartphone',      label: 'Mobile'       },
  { lib: 'fa',       nome: 'github',          label: 'GitHub'       },
  { lib: 'fa',       nome: 'rocket',          label: 'Lançar'       },
];

type IconeItemProps = {
  lib: string;
  nome: string;
  label: string;
};

function IconeItem({ lib, nome, label }: IconeItemProps) {
  return (
    <View style={styles.iconeCard}>
      {lib === 'ionicons' && (
        <Ionicons name={nome as any} size={36} color="#E94560" />
      )}
      {lib === 'material' && (
        <MaterialIcons name={nome as any} size={36} color="#E94560" />
      )}
      {lib === 'fa' && (
        <FontAwesome name={nome as any} size={36} color="#E94560" />
      )}
      <Text style={styles.iconeLabel}>{label}</Text>
    </View>
  );
}

export default function IconesScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Galeria de Ícones</Text>
      <Text style={styles.sub}>@expo/vector-icons</Text>

      <View style={styles.grid}>
        {icones.map((icone, index) => (
          <IconeItem key={index} {...icone} />
        ))}
      </View>

      <View style={styles.legendaContainer}>
        <Text style={styles.legendaTitulo}>Bibliotecas usadas:</Text>
        <Text style={styles.legendaItem}>• Ionicons</Text>
        <Text style={styles.legendaItem}>• MaterialIcons</Text>
        <Text style={styles.legendaItem}>• FontAwesome</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  heading: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  sub: {
    color: '#888',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  iconeCard: {
    backgroundColor: '#16213E',
    borderRadius: 12,
    width: '30%',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#0F3460',
  },
  iconeLabel: {
    color: '#fff',
    fontSize: 11,
    marginTop: 8,
    textAlign: 'center',
  },
  legendaContainer: {
    marginTop: 24,
    backgroundColor: '#16213E',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0F3460',
  },
  legendaTitulo: {
    color: '#E94560',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  legendaItem: {
    color: '#ccc',
    fontSize: 13,
    marginBottom: 4,
  },
});
