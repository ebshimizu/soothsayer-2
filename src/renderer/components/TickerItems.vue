<template>
  <v-card>
    <v-card-title>Ticker Items</v-card-title>
    <v-card-subtitle
      >The ticker automatically picks up schedule information. You can add
      additional ticker items here.</v-card-subtitle
    >
    <v-card-text>
      <v-row dense>
        <v-col cols="12">
          <v-btn block color="green" @click="addItem()">Add Item</v-btn>
        </v-col>
        <v-col cols="12" v-for="item in tickerItems" :key="item.id">
          <v-text-field
            label="Item Text"
            :value="item.text"
            append-outer-icon="mdi-delete"
            @click:append-outer="deleteItem(item.id)"
            @input="(v) => setItemProp(item.id, 'text', v)"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { MUTATION } from '../store/actions'
export default {
  name: 'ticker-items',
  computed: {
    tickerItems() {
      return Object.entries(this.$store.state.show.tickerItems).map(
        ([id, data]) => {
          return { id, ...data }
        },
      )
    },
  },
  methods: {
    addItem() {
      this.$store.commit(MUTATION.ADD_TICKER_ITEM)
    },
    deleteItem(id) {
      this.$store.commit(MUTATION.DELETE_TICKER_ITEM, id)
    },
    setItemProp(id, key, value) {
      this.$store.commit(MUTATION.SET_TICKER_ITEM_PROP, { id, key, value })
    },
  },
}
</script>
