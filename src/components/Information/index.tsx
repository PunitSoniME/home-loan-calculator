import { SyntheticEvent } from 'react';
import { SwipeableDrawer, List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import blue from '@mui/material/colors/blue';

export default function Information({ showInfo, setShowInfo }) {
    return (
        <SwipeableDrawer
            anchor="bottom"
            open={showInfo}
            onClose={function (event: SyntheticEvent<{}, Event>): void {
                setShowInfo(prevState => !prevState)
            }}
            onOpen={function (event: SyntheticEvent<{}, Event>): void {
                throw new Error('Function not implemented.');
            }}
        >

            <List>
                <ListItem style={{ color: blue[500], fontWeight: "bold" }}>
                    <ListItemText primary="Made with ❤️ By Punit Soni" />
                </ListItem>
                <ListItemButton component="a" href="mailto:punit.soni33@gmail.com" target="_blank">
                    <ListItemText primary="Email - punit.soni33@gmail.com" />
                </ListItemButton>
                <ListItemButton component="a" href="https://twitter.com/PunitSoniME" target="_blank">
                    <ListItemText primary="Twitter - @PunitSoniME" />
                </ListItemButton>
                <ListItemButton component="a" href="https://www.linkedin.com/in/PunitSoniME" target="_blank">
                    <ListItemText primary="Linkedin - PunitSoniME" />
                </ListItemButton>
            </List>

        </SwipeableDrawer>
    )
}
