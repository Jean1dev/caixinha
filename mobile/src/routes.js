import { createAppContainer, createSwitchNavigator } from 'react-navigation'

import Main from './pages/main'
import Box from './pages/box'

const Routes = createAppContainer(
    createSwitchNavigator({
        Main,
        Box
    })
)

export default Routes