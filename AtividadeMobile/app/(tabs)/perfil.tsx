import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../context/auth';

type RoleInfo = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  cor: string;
  desc: string;
  permissoes: string[];
};

const ROLE_INFO: Record<string, RoleInfo> = {
  leitor: {
    label: 'Leitor',
    icon: 'book',
    cor: '#4A90D9',
    desc: 'Acesso de leitura ao portal',
    permissoes: ['Ler notícias', 'Buscar por UF e Tag', 'Comentar artigos', 'Favoritar notícias'],
  },
  autor: {
    label: 'Autor',
    icon: 'create',
    cor: '#E94560',
    desc: 'Criação e publicação de conteúdo',
    permissoes: ['Ler notícias', 'Criar novos artigos', 'Editar próprios artigos', 'Comentar artigos'],
  },
  editor: {
    label: 'Editor',
    icon: 'pencil',
    cor: '#2ECC71',
    desc: 'Moderação e edição do portal',
    permissoes: ['Ler notícias', 'Publicar / Despublicar artigos', 'Editar qualquer artigo', 'Gerenciar comentários'],
  },
  admin: {
    label: 'Super Admin',
    icon: 'shield-checkmark',
    cor: '#F0A500',
    desc: 'Controle total do sistema',
    permissoes: ['Todos os acessos acima', 'CRUD de usuários', 'CRUD de tags e UFs', 'Gerenciar perfis', 'Ver dashboard completo'],
  },
};

export default function PerfilScreen() {
  const { role, logout } = useAuth();
  const router = useRouter();

  const info = ROLE_INFO[role as string] ?? ROLE_INFO.leitor;

  function handleLogout() {
    logout();
    router.replace('/login');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={[styles.avatar, { borderColor: info.cor }]}>
          <Ionicons name={info.icon} size={52} color={info.cor} />
        </View>
        <Text style={styles.nome}>Usuário Demo</Text>
        <Text style={styles.email}>demo@miaunews.com.br</Text>
        <View style={[styles.badge, { borderColor: info.cor, backgroundColor: info.cor + '22' }]}>
          <Ionicons name={info.icon} size={13} color={info.cor} />
          <Text style={[styles.badgeTexto, { color: info.cor }]}>{info.label}</Text>
        </View>
        <Text style={styles.desc}>{info.desc}</Text>
      </View>

      {/* Permissões */}
      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Permissões do perfil</Text>
        {info.permissoes.map((p, i) => (
          <View key={i} style={styles.permissaoRow}>
            <Ionicons name="checkmark-circle" size={16} color={info.cor} />
            <Text style={styles.permissaoTexto}>{p}</Text>
          </View>
        ))}
      </View>

      {/* Dados da conta */}
      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Dados da conta</Text>
        <View style={styles.dadoRow}>
          <Ionicons name="mail-outline" size={18} color="#666" />
          <Text style={styles.dadoTexto}>demo@miaunews.com.br</Text>
        </View>
        <View style={styles.dadoRow}>
          <Ionicons name="location-outline" size={18} color="#666" />
          <Text style={styles.dadoTexto}>São Paulo — SP</Text>
        </View>
        <View style={styles.dadoRow}>
          <Ionicons name="calendar-outline" size={18} color="#666" />
          <Text style={styles.dadoTexto}>Membro desde abril de 2026</Text>
        </View>
        <View style={styles.dadoRow}>
          <Ionicons name="phone-portrait-outline" size={18} color="#666" />
          <Text style={styles.dadoTexto}>Modo simulação ativo</Text>
        </View>
      </View>

      {/* Ações */}
      <TouchableOpacity style={styles.botaoEditar} activeOpacity={0.8}>
        <Ionicons name="pencil-outline" size={18} color="#fff" />
        <Text style={styles.botaoEditarTexto}>Editar perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoSair} onPress={handleLogout} activeOpacity={0.8}>
        <Ionicons name="log-out-outline" size={18} color="#E94560" />
        <Text style={styles.botaoSairTexto}>Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E' },
  content: { padding: 24, paddingBottom: 48 },
  avatarSection: { alignItems: 'center', marginBottom: 28 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#16213E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: 12,
  },
  nome: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 2 },
  email: { color: '#666', fontSize: 13, marginBottom: 10 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 6,
  },
  badgeTexto: { fontSize: 13, fontWeight: '600' },
  desc: { color: '#666', fontSize: 12, textAlign: 'center' },
  secao: {
    backgroundColor: '#16213E',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#0F3460',
    gap: 10,
  },
  secaoTitulo: {
    color: '#888',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  permissaoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  permissaoTexto: { color: '#ccc', fontSize: 13 },
  dadoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dadoTexto: { color: '#ccc', fontSize: 14 },
  botaoEditar: {
    backgroundColor: '#0F3460',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
  },
  botaoEditarTexto: { color: '#fff', fontSize: 15, fontWeight: '600' },
  botaoSair: {
    borderWidth: 1,
    borderColor: '#E94560',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  botaoSairTexto: { color: '#E94560', fontSize: 15, fontWeight: '600' },
});
