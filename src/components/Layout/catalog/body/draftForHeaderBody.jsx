<Layout>
  <Prompt
    when={true}
    message={e => 'Вы изменили запись «», но не сохранили её.\nЗакрыть запись без сохранения?'}
  />
  <Layout layoutWidth='flex'>
    <Row type="flex" justify="space-between" align="middle" style={{ borderBottom: '1px solid #dedcdc' }}>
      <Col span={4}>
        <Row type="flex" justify="space-between" align="middle" style={{ padding: '0 15px' }}>
          <h2 style={{ fontWeight: 'normal' }}>Клиенты</h2>
          <Dropdown
            overlay={menu}
            trigger={['click']}
          >
            <a href="#"><Icon type="setting-10" className={styles.icon} /></a>
          </Dropdown>
        </Row>
      </Col>
      <Col span={20} style={{ borderLeft: '1px solid #dedcdc' }}>
        <Row type="flex" justify="space-between" align="middle" style={{ padding: '0 15px' }}>
          <div>
            <Menu
              className="ant-menu ant-menu-horizontal"
            >
              {
                tabs.map(tab => (
                  <NavLink key={tab.id} route={routes.tab} params={{ tabId: tab.id }} component={(props) => {
                    return (
                      <Menu.Item className={props.isActive ? 'ant-menu-item ant-menu-item-selected' : 'ant-menu-item'}>
                        <Link to={props.link}>{tab.name}</Link>
                      </Menu.Item>
                    )
                  }} />
                ))
              }
            </Menu>
          </div>

          <div>
            <Input placeholder="быстрый поиск" style={{ width: '250px' }} />
          </div>

          <div>
            <Row type="flex" justify="space-between" align="middle">
              <div style={{ marginRight: '8px', marginTop: '3px' }}>
                <Icon type="content-42" style={{ cursor: 'pointer' }} />
              </div>
              <Dropdown.Button
                overlay={menu}
                style={{ marginLeft: 8 }}
              >
                {/*<Icon type="content-42" style={{ cursor: 'pointer' }} />*/}
                <Icon type="play-circle-o" />
                Dropdown
                      </Dropdown.Button>
              <div className="ant-btn-group ant-dropdown-button" style={{ display: 'flex' }}>
                <Button type="primary" style={{ display: 'flex', alignItems: 'center' }}><Icon type="interface-72"></Icon>Создать</Button>
                <Button style={{ display: 'flex', alignItems: 'center' }}>
                  <Dropdown
                    overlay={menu}
                    trigger={['click']}
                  >
                    <Icon type="arrows-chevron-medium-thin-4-01" />
                  </Dropdown>
                </Button>
              </div>
            </Row>
          </div>
        </Row>
      </Col>
    </Row>
    <div>
      <Button type="default" onClick={this.show}>Modal</Button>
      <ModalConfirm
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        nameCatalog={'Клиенты'}
      >
      </ModalConfirm>
    </div>
    <Button><Link to={'/section/1/catalog/1/view/1/record/1'}></Link></Button>
  </Layout>
</Layout>
