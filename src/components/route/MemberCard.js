import {TouchableOpacity, View} from "react-native";
import {Avatar, Chip, IconButton, MD3Colors, Text, Switch} from "react-native-paper";
import React from "react";

const MemberCard = ({user, removeMember = null, role = null, addMember, updateRight = null, route = null}) => {

    const [isSwitchOn, setIsSwitchOn] = React.useState(user.edition);
    const onChange = () => {
        setIsSwitchOn(!isSwitchOn);
        if (updateRight) {
            updateRight();
        }
    }

    return (
        <TouchableOpacity style={{
            paddingStart: 15,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            height: 80}}>
            <View  style={{
                flexDirection: "row",
                alignItems: "center",
            }}>
                <View style={{paddingEnd: 15}}>
                    <Avatar.Text label={user.username[0]} size={45} />
                </View>

                <Text variant="titleLarge" style={{paddingEnd: 10}} h4>{user.username}</Text>
                {role != null && <Chip style={{}} icon="information">Organisateur</Chip>}
                {updateRight != null &&
                    <Switch value={isSwitchOn} onValueChange={ onChange } />}

            </View>


            { removeMember && <IconButton icon={"close"} size={30}
                onPress={removeMember} >Retirer</IconButton> }
            { addMember && <IconButton icon={"plus"} size={30}   iconColor={MD3Colors.secondary50}

                onPress={addMember} >Ajouter</IconButton> }
        </TouchableOpacity>
    )
}
export default MemberCard