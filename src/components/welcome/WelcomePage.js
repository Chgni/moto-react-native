import {Text} from "react-native-paper";
import {Image, View} from "react-native";
import {SPEED_TRIPLE_IMAGE} from "../../assets";

const WelcomePage = ({title, subtitle, image, text}) => {
    return <View>
        {title && <Text variant="titleLarge" style={{textAlign: "center"}}>{title}</Text>}
        {subtitle && <Text variant="titleMedium" style={{textAlign: "center"}}>{subtitle}</Text>}
        {image && <Image source={image} style={{width:"fit-content", height: 150, margin: 20}} />}
        {text && <Text variant="bodyLarge" style={{textAlign: "justify"}}>
            {text}
        </Text>}

    </View>
}
export default WelcomePage