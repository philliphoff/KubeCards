import React from 'react';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SettingsIcon from '@material-ui/icons/Settings';
import GamesIcon from '@material-ui/icons/Games';
import AllOutIcon from '@material-ui/icons/AllOut';

const KubeCardsDrawerContent: React.FunctionComponent = () => {
    return (
        <div>
            <List>
                <ListItem button key='Play'>
                    <ListItemIcon><GamesIcon /></ListItemIcon>
                    <ListItemText primary='Play' />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button key={'Settings'}>
                    <ListItemIcon><SettingsIcon /></ListItemIcon>
                    <ListItemText primary='Settings' />
                </ListItem>
                <ListItem button key='Sign Out'>
                    <ListItemIcon><AllOutIcon /></ListItemIcon>
                    <ListItemText primary='Sign Out' />
                </ListItem>
            </List>
        </div>
    );
};

export default KubeCardsDrawerContent;
