import React from 'react'
import { Row, Button, Icon } from 'antd'
import ButtonTransparent from '../../../common/elements/ButtonTransparent'
import styles from './headerSection.less'

const Profile = function ({ ...props }) {
  const module = props.appState.get('extensions').valueSeq();

  return (
    <Row type="flex" justify="space-around" align="middle" className={styles.profile}>
      {
        module.map(module => {
          {/*let isSelected = this.state.selectedModuleCode && this.state.selectedModuleCode === module.get('code');*/ }
          return (
            <Button
              key={module.get('code')}
            //onClick={this.onClickModule.bind(this, module.get('code'))}
            >
              <Icon type={module.get('icon')} />
              <span>{module.get('title')}</span>
            </Button>
          )
        })
      }
      <img src="favicon.ico" alt="profile" className={styles.img} />
      <ButtonTransparent><Icon type="interface-13" /></ButtonTransparent>
    </Row>
  )
}

export default Profile;
