import React from 'react';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SettingsIcon from '@material-ui/icons/Settings';
import GamesIcon from '@material-ui/icons/Games';
import { Link as RouterLink } from 'react-router-dom';

class ListItemLink extends React.Component<{icon: any, primary: string, to: string}> {
    renderLink: any = React.forwardRef((itemProps, ref: any) => (
    // with react-router-dom@^5.0.0 use `ref` instead of `innerRef`
    <RouterLink to={this.props.to} {...itemProps} innerRef={ref} />
    ));

    render() {
    const { icon, primary } = this.props;
    return (
        <li>
        <ListItem button component={this.renderLink}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={primary} />
        </ListItem>
        </li>
    );
    }
}

const KubeCardsDrawerContent: React.FunctionComponent = () => {
    return (
        <div>
            <List>
                <ListItemLink to='/play' primary='Play' icon={<GamesIcon />} />
            </List>
            <Divider />
            <List>
                <ListItem button key={'Settings'}>
                    <ListItemIcon><SettingsIcon /></ListItemIcon>
                    <ListItemText primary='Settings' />
                </ListItem>
            </List>
        </div>
    );
};

export default KubeCardsDrawerContent;
