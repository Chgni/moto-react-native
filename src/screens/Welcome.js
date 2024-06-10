import {Image, View} from "react-native";
import {Button, Text} from "react-native-paper";
import {ROUTE_66, SPEED_TRIPLE_IMAGE, VFR_800_F, VITPILEN_401} from "../assets";
import {useState} from "react";
import WelcomePage from "../components/welcome/WelcomePage";

const WelcomeScreen = ({ navigation, username }) => {
    const [displayPage, setDisplayPage] = useState(0)
    const previousPage = () => {
        setDisplayPage(displayPage - 1)
    }
    const nextPage = () => {
        setDisplayPage(displayPage + 1)
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
            text: "Après avoir invité tes amis à télécharger CommuMoto, tu pourras les ajouter à ta liste d'ami" +
                "dans la séction \"Amis\"."
        },
        {
            key: 4,
            title: "Créés et partages tes balades !",
            image: ROUTE_66,
            text: "Dans la page d'accueil de CommuMoto, cliques sur le bouton \"Créer un trajet\" pour commencer à planifier ta prochaine balade. " +
                "Tu pourras ensuite placer les points de passage que tu souhaites emprunter. Après avoir sauvegardé, tu peux inviter tes amis à rejoindre ta balade.\n"
        },
        {
            key: 5,
            subtitle: "Il est temps de monter en selle",
            text: "Lorsque tout est prêt, utilise l'icone en bas a droite de la carte pour ouvrir ton trajet dans Google Maps ou exporter un fichier pour ton GPS !",
            actionText: "Créer ton premier trajet",
            action: () => {

            }
        }
    ]
    return (
        <View>
            <View>
                {content.map((page, index) => {
                    return (
                        <View key={page.key}>
                            {displayPage == index && <WelcomePage
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
                <Button mode="contained" onPress={previousPage} disabled={displayPage==0 ? true: false}>Précédent</Button>
                <Button mode="contained" onPress={nextPage} disabled={displayPage==content.length-1 ? true: false}>Suivant</Button>
            </View>


        </View>
    )
}

export default WelcomeScreen;