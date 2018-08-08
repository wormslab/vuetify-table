<template>
  <section ref="container">
    <vuetify-table :columns="columns"
                   :data="data"
                   :page="page"
                   :rows-per-page="rowsPerPage"
                   :total-elements="totalElements"
                   @next="_handleClickNext"
                   @prev="_handleClickPrev"
    />
  </section>
</template>

<script>
  import VuetifyTable from './VuetifyTable'
  export default {
    data () {
      const columns = [
        { key: 'id', text: '아이디' },
        { key: 'name', text: '이름' },
        { key: 'servicePeriod.startAt', text: '시작일' },
        { key: 'servicePeriod.endAt', text: '종료일' },
      ]

      const data = [
        { id: 1000, name: 'foo', servicePeriod: { startAt: '2018-07-01', endAt: '2018-07-31' } },
        { id: 1000, name: 'foo', servicePeriod: { startAt: '2018-07-01', endAt: '2018-07-31' } },
        { id: 1000, name: 'foo', servicePeriod: { startAt: '2018-07-01', endAt: '2018-07-31' } },
        { id: 1000, name: 'foo', servicePeriod: { startAt: '2018-07-01', endAt: '2018-07-31' } },
        { id: 1000, name: 'foo', servicePeriod: { startAt: '2018-07-01', endAt: '2018-07-31' } },
      ]
      return {
        columns,
        data,
        page: 1,
        totalElements: 10,
        rowsPerPage: 5
      }
    },
    methods: {
      _handleClickNext () {
      },
      _handleClickPrev () {
      }
    },
    components: {
      VuetifyTable
    }
  }
</script>

<style scoped>

</style>
