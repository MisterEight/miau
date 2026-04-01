import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function FotoScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image
        source={require('../../assets/images/noticia.webp')}
        style={styles.imagem}
        resizeMode="cover"
      />

      <View style={styles.card}>
        <Text style={styles.titulo}>
          Jesus Esclarece que Retorno Será Estritamente Limitado ao Negócio de Carpintaria
        </Text>
        <Text style={styles.data}>Publicado: 30 de março de 2026</Text>
        <Text style={styles.texto}>
          JERUSALÉM — Numa tentativa de amenizar o golpe para uma raça humana que aguardava
          ansiosamente Sua gloriosa chegada, Jesus Cristo, o Filho de Deus, esclareceu na
          segunda-feira que Seu retorno seria estritamente limitado ao Seu negócio de carpintaria.
        </Text>
        <Text style={styles.texto}>
          "Embora Eu vá em breve aparecer mais uma vez no reino terrestre, Meu único foco durante
          esta Segunda Vinda será em diversos projetos de marcenaria e não no estabelecimento de um
          reino messiânico", disse Cristo, a Luz do Mundo, acrescentando que estava ansioso para
          terminar a ilha de cozinha de nogueira que havia deixado de lado por conta de Seu
          martírio dois milênios atrás.
        </Text>
        <Text style={styles.texto}>
          "Eu sei que muitos de vocês estavam ansiosos para Me ver realizando vários milagres e
          lançando Satanás em um lago de fogo, mas sinceramente mal posso esperar para passar Meu
          tempo construindo estantes, armários artesanais e jogos de xadrez feitos à mão — vocês
          não conseguem aquele jacarandá perfeito para as peças no céu. Não tínhamos ferramentas
          elétricas na Galileia naquela época, então também estou empolgado para descobrir o que
          consigo realizar com uma serra de fita e uma tupia, mesmo que os justos,
          infelizmente, não serão ressuscitados."
        </Text>
        <Text style={styles.texto}>
          O Rei dos Reis prosseguiu solicitando que Seus seguidores não orassem para Ele, a menos
          que fossem potenciais clientes entrando em contato para pedir um orçamento.
        </Text>
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
    paddingBottom: 24,
  },
  imagem: {
    width: '100%',
    height: 250,
  },
  card: {
    margin: 16,
    backgroundColor: '#16213E',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#E94560',
  },
  titulo: {
    color: '#E94560',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 26,
  },
  data: {
    color: '#888',
    fontSize: 12,
    marginBottom: 12,
  },
  texto: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
});
