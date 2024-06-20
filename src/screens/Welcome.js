import {Image, StyleSheet, View} from "react-native";
import {Button, Text} from "react-native-paper";
import {BALADE_MOTO, ROUTE_66, SPEED_TRIPLE_IMAGE, VFR_800_F, VITPILEN_401} from "../assets";
import {useState} from "react";
import WelcomePage from "../components/welcome/WelcomePage";

const WelcomeScreen = ({ username, goToCreatePage}) => {
    const [displayPageIndex, setDisplayPageIndex] = useState(0)
    const previousPage = () => {
        setDisplayPageIndex(displayPageIndex - 1)
    }
    const nextPage = () => {
        setDisplayPageIndex(displayPageIndex + 1)
    }
    const content = [
        {
            key: 1,
            title: `Salut ${username}✌`,
            subtitle:"Bienvenue sur notre application",
            image: SPEED_TRIPLE_IMAGE,
            text: "Laisse-moi te guider pour découvrir CommuMoto et créer ta première" +
                " balade à partager avec tes amis"
        },
        {
            key: 2,
            title: "Consulte tes trajets 🗺",
            image: VFR_800_F,
            text: "Dans la page d'accueil de CommuMoto, tu trouveras la liste des trajets que tu as créée," +
                    "et tu pourras consulter les trajets auxquels tes amis t'ont invité dans l'onglet \"Trajets Rejoints\""
        },
        {
            key: 3,
            title: "Ajoute tes amis !️",
            subtitle: "Une balade, c'est (presque) toujours mieux à plusieurs",
            image: VITPILEN_401,
            text: "Après avoir invité tes amis à télécharger CommuMoto, tu pourras les ajouter à ta liste d'amis" +
                "dans la section \"Amis\"."
        },
        {
            key: 4,
            title: "Créés et partage tes balades !",
            image: BALADE_MOTO,
            text: "Dans la page d'accueil de CommuMoto, clique sur le bouton \"Créer un trajet\" pour commencer à planifier ta prochaine balade. " +
                "Tu pourras ensuite placer les points de passage que tu souhaites emprunter. Après avoir sauvegardé, tu peux inviter tes amis à rejoindre ta balade.\n" +
                "Pour ceux qui rejoindront en cours de route, ils peuvent ajouter leur point de départ qui apparaîtra en orange.\n"
        },
        {
            key: 5,
            title: "Lance ton GPS",
            subtitle: "Il est temps de monter en selle",
            image: ROUTE_66,
            text: "Lorsque tout est prêt, utilise l'icône en bas à droite de la carte pour ouvrir ton trajet dans Google Maps ou exporter un fichier pour ton GPS !",
        }
    ]
    const lastPageIndex = content.length - 1;
    return (
        <View>
            <View>
                {content.map((page, index) => {
                    return (
                        <View key={page.key}>
                            {displayPageIndex == index && <WelcomePage
                                title={page.title}
                                subtitle={page.subtitle}
                                image={page.image}
                                text={page.text}
                            />}
                        </View>
                    )
                })}
            </View>
            <View
                style={{flexDirection:"row", justifyContent:"space-around", marginTop: 20}}>
                {displayPageIndex !== 0 && <Button mode="outlined" onPress={previousPage} >Précédent</Button>}
                {displayPageIndex < content.length-1 && <Button mode="contained" onPress={nextPage} >Suivant</Button>}
                {lastPageIndex == displayPageIndex &&  <Button mode="contained" onPress={goToCreatePage} >Créer mon premier trajet</Button>}
            </View>


        </View>
    )
}

export default WelcomeScreen;