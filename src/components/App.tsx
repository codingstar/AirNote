import * as React from 'react'
import { observer } from 'mobx-react'
import DevTools from 'mobx-react-devtools'

import { EmptyProps } from '../types'
import Sidebar from './Sidebar'
import Pages from './Pages'
import Note from './Note'
import i18nStore from '../global/I18nStore'
import './app.less'

@observer
export default class App extends React.Component<EmptyProps, void> {
  render() {
    return (
      <div id="app-wrap">
        <div id="app">
          <Sidebar />
          <Pages />
          <Note />
        </div>

        <div className="for-debug">
          <button onClick={() => i18nStore.toggleLanguage()}>Switch language</button>
          <DevTools />
        </div>
      </div>
    )
  }
}
