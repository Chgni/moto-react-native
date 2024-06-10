import {Text} from "react-native-paper";
import {Image, StyleSheet, View} from "react-native";
import {SPEED_TRIPLE_IMAGE} from "../../assets";

const WelcomePage = ({title, subtitle, image, text}) => {
    return <View style={{margin: 10}}>
        {title && <Text variant="titleLarge" style={{textAlign: "center"}}>{title}</Text>}
        {subtitle && <Text variant="titleMedium" style={{...styles.text, textAlign: "center"}}>{subtitle}</Text>}
        {image && <Image source={image} style={{width:"fit-content", height: 150,  marginTop: 20, marginBottom: 20, borderRadius: 15}} />}
        {text && <Text variant="bodyLarge" style={{...styles.text, textAlign: "justify"}}>
            {text}
        </Text>}

    </View>
}
const styles = StyleSheet.create({
    text: {
        color: "#00000080",
        fontFamily: "Roboto",
        fontSize: 15,
    }
})
export default WelcomePage