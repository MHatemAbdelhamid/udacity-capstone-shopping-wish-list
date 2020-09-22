import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createShoppingItem, deleteShoppingItem, getShoppingItems, patchShoppingItem } from '../api/shoppingItems-api'
import Auth from '../auth/Auth'
import { ShoppingItem } from '../types/ShoppingItem'

interface ShoppingItemsProps {
  auth: Auth
  history: History
}

interface ShoppingItemsState {
  shoppingItems: ShoppingItem[]
  newShoppingItemName: string
  loadingShoppingItems: boolean
}

export class ShoppingItems extends React.PureComponent<ShoppingItemsProps, ShoppingItemsState> {
  state: ShoppingItemsState = {
    shoppingItems: [],
    newShoppingItemName: '',
    loadingShoppingItems: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newShoppingItemName: event.target.value })
  }

  onEditButtonClick = (shoppingItemId: string) => {
    this.props.history.push(`/shoppingItems/${shoppingItemId}/edit`)
  }

  onShoppingItemCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newShoppingItem = await createShoppingItem(this.props.auth.getIdToken(), {
        name: this.state.newShoppingItemName,
        dueDate
      })
      this.setState({
        shoppingItems: [...this.state.shoppingItems, newShoppingItem],
        newShoppingItemName: ''
      })
    } catch {
      alert('ShoppingItem creation failed')
    }
  }

  onShoppingItemDelete = async (shoppingItemId: string) => {
    try {
      await deleteShoppingItem(this.props.auth.getIdToken(), shoppingItemId)
      this.setState({
        shoppingItems: this.state.shoppingItems.filter(shoppingItem => shoppingItem.shoppingItemId != shoppingItemId)
      })
    } catch {
      alert('ShoppingItem deletion failed')
    }
  }

  onShoppingItemCheck = async (pos: number) => {
    try {
      const shoppingItem = this.state.shoppingItems[pos]
      await patchShoppingItem(this.props.auth.getIdToken(), shoppingItem.shoppingItemId, {
        name: shoppingItem.name,
        dueDate: shoppingItem.dueDate,
        done: !shoppingItem.done
      })
      this.setState({
        shoppingItems: update(this.state.shoppingItems, {
          [pos]: { done: { $set: !shoppingItem.done } }
        })
      })
    } catch {
      alert('ShoppingItem deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const shoppingItems = await getShoppingItems(this.props.auth.getIdToken())
      this.setState({
        shoppingItems,
        loadingShoppingItems: false
      })
    } catch (e) {
      alert(`Failed to fetch shoppingItems: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Shopping Items</Header>

        {this.renderCreateShoppingItemInput()}

        {this.renderShoppingItems()}
      </div>
    )
  }

  renderCreateShoppingItemInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Shopping item', 
              onClick: this.onShoppingItemCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Save it now, buy it later..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderShoppingItems() {
    if (this.state.loadingShoppingItems) {
      return this.renderLoading()
    }

    return this.renderShoppingItemsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Shopping Items
        </Loader>
      </Grid.Row>
    )
  }

  renderShoppingItemsList() {
    return (
      <Grid padded>
        {this.state.shoppingItems.map((shoppingItem, pos) => {
          return (
            <Grid.Row key={shoppingItem.shoppingItemId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onShoppingItemCheck(pos)}
                  checked={shoppingItem.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {shoppingItem.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {shoppingItem.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(shoppingItem.shoppingItemId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onShoppingItemDelete(shoppingItem.shoppingItemId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {shoppingItem.attachmentUrl && (
                <Image src={shoppingItem.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
