import { StyleSheet } from 'react-native';
import RecuperarContra from '../screens/RecuperarContra';
<style>@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap');
@import url("https://fonts.googleapis.com/css2?family=Nunito:wght@200..700;700&display=swap");</style>
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
    alignItems: 'center',
    width: '90%', 
    overflow: "hidden",
  },
  cardHeader: {
    backgroundColor: "#9A0000",
    textAlign: "center",
    width: "100%", // Asegura que ocupe todo el ancho del card
    alignItems: "center", // Centra los elementos dentro del cardHeader
    borderTopLeftRadius: 10, // Opcional: Bordes redondeados en la parte superior
    borderTopRightRadius: 10,
    padding:10,
    paddingVertical: 15,
    
    
  },
  cardBody: {
    padding: 20, // Espaciado interno en el contenido
    width: "100%", // Para que no se desborde
    alignItems: "center", // Asegura que todo se alinee al centro
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: 'center', // Añadido para centrar el texto
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    width: "100%",
  },
  icon: {
    marginRight: 10, // Espacio entre el ícono y el input
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  forgotText: {
    color: "#007BFF",
    textAlign: 'center', 
    padding:10,
  },
  loginButton: {
    backgroundColor: "#E74C3C",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  regisButton: {
    position: 'absolute',
    top: 10,  
    right: 10,
    paddingVertical: 5,
    paddingHorizontal: 5,
    backgroundColor: '#FF5958',
    borderRadius: 5,
    fontSize:10,
    alignItems:"center"
  },
  regisText:{
    fontFamily:"bold",
    color:"white",
    fontSize:10,
    textAlign:"center"
    },
  loginText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",

  },
  header: {
    backgroundColor: '#a40000',
    width: '100%',
    padding: 20,
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20, // Añadido para separar del contenido siguiente
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginTop: 5,
  },
  button: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  
  },
  TextField: {
    color: 'black',
    fontFamily: 'Oswald',
    fontSize:15,
    textAlign:"justify"
  },
  RecuperarContra: {
    width: 110,
    height: 110,
    marginBottom: 20,
  },
  Titles: {
    fontFamily: 'Nunito',
  }
});


export default styles;