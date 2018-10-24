<template>
  <section class="vuetify-table-container">
    <section class="table-header">
      <slot class="table-title" name="table-title" />
    </section>
    <section class="table-action">
      <section class="table-pagination" >
        <vuetify-table-column-menu class="mr-2" :name="name" :columns="columns" />
        <v-pagination :value="page"
                      :length="pages"
                      :total-visible="4"
                      @input="_handleChangeInput"
        />
      </section>
    </section>
    <section class="table-container" >
      <table>
        <caption>{{caption}}</caption>
        <thead>
        <tr key="head-tr">
          <th v-if="key.display !== false" v-for="(key, index) in columns" @click="_handleClickHeader(key)" :class="{ fold: key.fold }" :key="`th-${index}`" :width="colWidth(key)">
            <slot :name="`${keyName(key)}-header`" :row="{ column: key, index }">
              <div class="header-cell" v-if="!key.fold">{{textName(key)}}</div>
              <div class="header-cell" v-else>
                <v-tooltip top>
                  <v-icon small dark slot="activator">keyboard_arrow_right</v-icon>
                  {{textName(key)}}
                </v-tooltip>
              </div>
            </slot>
            <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'" v-if="sortKey && sortKey.length > 0"></span>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="!data || data.length <= 0">
          <td :colspan="columns.length" class="text-xs-center pa-2">
            <slot name="no-data">No data available</slot>
          </td>
        </tr>
        <tr v-for="(entry, entryIndex) in data" :key="`entry-${_keyField(entry, entryIndex)}`">
          <td v-if="columns[keyIndex].display !== false" v-for="(key, keyIndex) in columns" :key="`td-${keyIndex}`" :class="activeClass(entryIndex)">
            <transition :name="transition">
              <div v-if="show" :style="contentStyle(entry, key, entryIndex, keyIndex)">
                <slot :name="`${keyName(key)}-column`" :row="{ column: key, data: entry, index: entryIndex }">
                  <div class="data-cell">{{columnData(entry, key)}}</div>
                </slot>
              </div>
            </transition>
          </td>
        </tr>
        </tbody>
      </table>
    </section>
  </section>
</template>

<script>
  import _ from 'underscore'
  import dot from 'dot-object'
  import VuetifyTableColumnMenu from './VuetifyTableColumnMenu'
  import transformByType from './transform-by-type'
  export default {
    data () {
      const sortOrders = {}
      this.columns.forEach(function (column) {
        const key = (column.key && column.text) ? column.key : column
        sortOrders[key] = 1
      })
      return {
        transition: 'table-slide-x-transition',
        sortKey: '',
        sortOrders: sortOrders,
        show: true
      }
    },
    props: {
      name: {
        type: String,
        default: null
      },
      data: {
        type: Array,
        default () {
          return []
        }
      },
      caption: {
        type: String,
        default: 'Caption'
      },
      columns: {
        type: Array,
        default () {
          return []
        }
      },
      foldWith: {
        type: Number,
        default: 30
      },
      page: {
        type: Number,
        default: 1
      },
      totalElements: {
        type: Number,
        default: 0
      },
      rowsPerPage: {
        type: Number,
        default: 10,
      },
      filterKey: {
        type: String,
      },
      textModule: {
        type: Object,
        default () { return {} }
      },
      activeIndex: {
        type: Number,
        default: -1
      },
      keyField: {
        type: String,
        default () {
          return null
        }
      },
      transitionGap: {
        type: Number,
        default: 300,
      }
    },
    methods: {
      activeClass (entryIndex) {
        const isActive = this.activeIndex === entryIndex
        return {
          active: isActive
        }
      },
      contentStyle (entry, key) {
        const ret = {}
        if (key.align) {
          ret.textAlign = key.align
        }
        return ret
      },
      _keyField (data, alter) {
        return this.keyField ? data[this.keyField] : alter
      },
      keyName (column) {
        return column.key && column.text ? column.key : column
      },
      textName (column) {
        return column.key && column.text ? column.text : column
      },
      colWidth (header) {
        if (header.fold) {
          return this.foldWith
        }
        return header.width ? header.width : null
      },
      columnData (data, column) {
        const keyName = this.keyName(column)
        const fn = dot.pick(keyName.toLowerCase(), this.textModule)

        /**
         * module 을 통해 컬럼이름에 해당하는 function 이 제공되었을 경우 해당 function 을 이용해 값을 전달한다
         */
        if (_.isFunction(fn)) {
          return fn(data[keyName])
        }

        /**
         * column 정보에서 type 이 추가적으로 제공되었을 경우 타입에 맞게 값을 변경한다
         */
        return transformByType(column, keyName, data)
      },
      _handleClickHeader: function (header) {
        this.$emit('click-header', header)
      },
      _handleChangeInput (page) {
        if (this.page === page) {
          return
        }
        this.transition = this.page < page ? 'table-slide-x-transition' : 'table-slide-x-reverse-transition'
        /**
         * TODO: 페이지 변경이 일어날 때 event 전달 후 테이블이 바뀌는 경우를 캐치할 수 없기 때문에 코드를 변경해야 할 필요가 있다
         */
        setTimeout(() => {
          this.show = false
          setTimeout(() => {
            this.$emit('page', page)

            setTimeout(() => {
              this.show = true
            })
          }, this.transitionGap)
        })
      }
    },
    computed: {
      startIndex () {
        return (this.rowsPerPage * (this.page - 1)) + 1
      },
      endIndex () {
        return Math.min(this.startIndex + this.rowsPerPage - 1, this.totalElements)
      },
      pages () {
        return Math.ceil(this.totalElements / this.rowsPerPage)
      }
    },
    filters: {
      capitalize: function (column) {
        const str = (column.key && column.text) ? column.key : column
        return str.charAt(0).toUpperCase() + str.slice(1)
      }
    },
    components: {
      VuetifyTableColumnMenu
    }
  }
</script>

<style scoped>
  .vuetify-table-container {
    position: relative;
  }
  .table-action {
    display: flex;
    align-items: center;
  }
  .table-action > .table-pagination {
    flex: 1 1 300px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .table-container {
    width: 100%;
    overflow-x: scroll;
    position: relative;
  }
  
  table {
    width: 100%;
    table-layout: fixed;
    border-radius: 3px;
    background-color: #fff;
  }

  table > caption {
    visibility: hidden;
    height: 0;
  }

  th {
    background-color: #176BCC;
    color: rgba(255,255,255,0.66);
    cursor: pointer;
    transition: width 0.1s ease-in-out;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  td {
    background-color: #f9f9f9;
    position: relative;
  }

  td.active {
    background-color: #D6D9DD;
  }

  th, td {
    white-space: nowrap;
    height: 35px;
  }

  td {
    padding: 7px 21px;
  }

  th.active {
    color: #fff;
  }

  th .checkbox, td .checkbox {
    height: 21px;
    width: 21px;
    margin-top: -8px
  }

  th .header-cell {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  td .data-cell {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .display-arrow {
    visibility: hidden;
  }

  .table-slide-x-transition-enter-active,
  .table-slide-x-transition-leave-active {
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  }
  .table-slide-x-transition-enter {
    opacity: 0;
    -webkit-transform: translateX(100px);
    transform: translateX(100px);
  }
  .table-slide-x-transition-leave-to {
    opacity: 0;
    -webkit-transform: translateX(-100px);
    transform: translateX(-100px);
  }
  .table-slide-x-reverse-transition-enter-active,
  .table-slide-x-reverse-transition-leave-active {
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  }
  .table-slide-x-reverse-transition-enter {
    opacity: 0;
    -webkit-transform: translateX(-100px);
    transform: translateX(-100px);
  }
  .table-slide-x-reverse-transition-leave-to {
    opacity: 0;
    -webkit-transform: translateX(100px);
    transform: translateX(100px);
  }

</style>
