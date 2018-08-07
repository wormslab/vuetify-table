<template>
  <section class="admin-custom-table-container">
    <section class="table-custom-header">
      <slot class="table-custom-caption" name="custom-caption" />
      <section class="custom-table-pagination" v-if="totalElements != 0" >
        <div class="mr-3"><span>{{startIndex}} - {{endIndex}} of {{totalElements}}</span></div>
        <v-btn icon small :class="{ 'mr-3': true, 'display-arrow': totalElements <= 0 }" :disabled="totalElements === 0 || page === 1" @click="_handleClickPrev">
          <v-icon>chevron_left</v-icon>
        </v-btn>
        <v-btn icon small :class="{ 'mr-3': true, 'display-arrow': totalElements <= 0 }" :disabled="totalElements === 0 || (rowsPerPage * page) >= totalElements" @click="_handleClickNext">
          <v-icon>chevron_right</v-icon>
        </v-btn>
      </section>
    </section>
    <section>
      <table>
        <caption>{{caption}}</caption>
        <thead>
        <tr>
          <th v-for="(key, index) in columns" @click="sortBy(key)" :class="{ active: sortKey == key }" :key="`th-${index}`" >
            <slot :name="`${keyName(key)}-header`" :row="{ column: key, index }">
              <span>{{textName(key)}}</span>
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
        <tr v-for="(entry, entryIndex) in data" :key="`entry-${entryIndex}`">
          <td v-for="(key, keyIndex) in columns" :key="`td-${keyIndex}`" :class="activeClass(entryIndex)">
            <slot :name="`${keyName(key)}-column`" :row="{ column: key, data: entry }">
              <span>{{columnData(entry, key)}}</span>
            </slot>
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
  import moment from 'moment'
  export default {
    props: {
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
        default: 1
      }
    },
    data: function () {
      const sortOrders = {}
      this.columns.forEach(function (column) {
        const key = (column.key && column.text) ? column.key : column
        sortOrders[key] = 1
      })
      return {
        sortKey: '',
        sortOrders: sortOrders
      }
    },
    methods: {
      activeClass (entryIndex) {
        const isActive = this.activeIndex === entryIndex
        return {
          active: isActive
        }
      },
      keyName (column) {
        return column.key && column.text ? column.key : column
      },
      textName (column) {
        return column.key && column.text ? column.text : column
      },
      numberWithCommas (x) {
        if (!x) {
          return x
        }
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
         * Date: 가자고 주문관련 시간정보는 TIMESTAMP 로 되어있으므로 UTC 를 사용한다. 사용자가 읽기 어렵기 때문에 날짜까지만 기본적으로 표기하도록 한다
         */
        if (column['type'] && column['type'] === 'date') {
          const format = 'YYYY-MM-DD'
          const v = dot.pick(keyName, data)
          if (!v) {
            return v
          }
          return moment(new Date(v)).format(format)
        } else if (column['type'] && column['type'] === 'datetime') {
          const format = 'YYYY-MM-DD HH:mm:ss'
          const v = dot.pick(keyName, data)
          if (!v) {
            return v
          }
          return moment(new Date(v)).format(format)
        } else if (column['type'] && column['type'] === 'currency') {
          const v = dot.pick(keyName, data)
          return `${this.numberWithCommas(Math.floor(v))} 원`
        } else if (column['type'] && column['type'] === 'phone') {
          const v = dot.pick(keyName, data)
          if (!v) {
            return v
          }
          if (v.length === 11) {
            return `${v.substring(0,3)}-${v.substring(3, 7)}-${v.substring(7, 11)}`
          } else if (v.length === 10) {
            return `${v.substring(0,3)}-${v.substring(3, 6)}-${v.substring(6, 10)}`
          } else {
            return v
          }
        }
        return dot.pick(keyName, data)
      },
      sortBy: function (key) {
        this.sortKey = key
        this.sortOrders[key] = this.sortOrders[key] * -1
      },
      _handleClickPrev (event) {
        return this.$emit('prev', event)
      },
      _handleClickNext (event) {
        return this.$emit('next', event)
      }
    },
    computed: {
      startIndex () {
        return (this.rowsPerPage * (this.page - 1)) + 1
      },
      endIndex () {
        return Math.min(this.startIndex + this.rowsPerPage - 1, this.totalElements)
      }
    },
    filters: {
      capitalize: function (column) {
        const str = (column.key && column.text) ? column.key : column
        return str.charAt(0).toUpperCase() + str.slice(1)
      }
    }
  }
</script>

<style scoped>
  .admin-custom-table-container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: auto;
  }
  .table-custom-header {
    display: flex;
    align-items: center;
  }
  .table-custom-header > .table-custom-caption {
    flex: 0 0 500px;
  }
  .table-custom-header > .custom-table-pagination {
    flex: 1 1 300px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 5px;
  }
  table {
    width: 100%;
  }
  body {
    font-family: Helvetica Neue, Arial, sans-serif;
    font-size: 14px;
    color: #444;
  }

  table {
    /*border: 2px solid #176BCC;*/
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
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  td {
    background-color: #f9f9f9;
  }

  td.active {
    background-color: #D6D9DD;
  }

  th, td {
    white-space: nowrap;
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

  th.active .arrow {
    opacity: 1;
  }

  .display-arrow {
    visibility: hidden;
  }

  .arrow {
    display: inline-block;
    vertical-align: middle;
    width: 0;
    height: 0;
    margin-left: 5px;
    opacity: 0.66;
  }

  .arrow.asc {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid #fff;
  }

  .arrow.dsc {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid #fff;
  }
</style>
