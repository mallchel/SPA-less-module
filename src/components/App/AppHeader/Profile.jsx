import React from 'react'
import { Row, Button, Icon } from 'antd'
import ButtonTransparent from '../../common/elements/ButtonTransparent'
import { connect } from '../../StateProvider'

import styles from './appHeader.less'

const Profile = function (props) {
  const modules = props.extensions.valueSeq();

  console.log(111)

  return (
    <Row type="flex" justify="space-around" align="middle" className={styles.profile}>
      {
        modules.map(module => {
          {/*let isSelected = this.state.selectedModuleCode && this.state.selectedModuleCode === module.get('code');*/ }
          return (
            <Button
              key={module.get('code')}
            //onClick={this.onClickModule.bind(this, module.get('code'))}
            >
              <Icon type={`icon ${module.get('icon')}`} />
              <span>{module.get('title')}</span>
            </Button>
          )
        })
      }
      <img src="favicon.ico" alt="profile" className={styles.img} />
      <ButtonTransparent><Icon type="icon interface-13" /></ButtonTransparent>
    </Row>
  )
}

export default connect(Profile, ['extensions']);
