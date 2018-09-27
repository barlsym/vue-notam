<template>
  <div id="app2">
    <b-container fluid>
      <!-- User Interface controls -->
      <b-row>
        <b-col md="6" class="my-1">
          <b-form-group horizontal label="Filtre" class="mb-0">
            <b-input-group>
              <b-form-input v-model="filter" placeholder="Arama metni"/>
              <b-input-group-append>
                <b-btn :disabled="!filter" @click="filter = ''">Temizle</b-btn>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col md="6" class="my-1">
          <b-form-group horizontal label="Sırala" class="mb-0">
            <b-input-group>
              <b-form-select v-model="sortBy" :options="sortOptions">
                <option slot="first" :value="null">----</option>
              </b-form-select>
              <b-form-select :disabled="!sortBy" v-model="sortDesc" slot="append">
                <option :value="false">Azalan</option>
                <option :value="true">Artan</option>
              </b-form-select>
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col md="6" class="my-1">
          <b-form-group horizontal label="Sıralama yönü" class="mb-0">
            <b-input-group>
              <b-form-select v-model="sortDirection" slot="append">
                <option value="asc">Azalan</option>
                <option value="desc">Artan</option>
                <option value="last">Sonuncu</option>
              </b-form-select>
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col md="6" class="my-1">
          <b-form-group horizontal label="Her sayfada" class="mb-0">
            <b-form-select :options="pageOptions" v-model="perPage"/>
          </b-form-group>
        </b-col>
      </b-row>

      <!-- Main table element -->
      <b-table show-empty
               stacked="md"
               :items="items"
               :fields="fields"
               :current-page="currentPage"
               :per-page="perPage"
               :filter="filter"
               :sort-by.sync="sortBy"
               :sort-desc.sync="sortDesc"
               :sort-direction="sortDirection"
               @filtered="onFiltered"
      >
        <template slot="notam_no" slot-scope="row">{{row.value}}</template>
        <template slot="notam_tipi" slot-scope="row">{{row.value}}</template>
        <template slot="islemler" slot-scope="row">
          <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
          <b-button size="sm" @click.stop="info(row.item, row.index, $event.target)" class="mr-1">
            Model Bilgisi
          </b-button>
          <b-button size="sm" @click.stop="row.toggleDetails">
            Detayları {{ row.detailsShowing ? 'Sakla' : 'Göster' }}
          </b-button>
        </template>
        <template slot="row-details" slot-scope="row">
          <b-card>
            <ul>
              <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value}}</li>
            </ul>
          </b-card>
        </template>
      </b-table>

      <b-row>
        <b-col md="6" class="my-1">
          <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0"/>
        </b-col>
      </b-row>

      <!-- Info modal -->
      <b-modal id="modalInfo" @hide="resetModal" :title="modalInfo.title" ok-only>
        <pre>{{ modalInfo.content }}</pre>
      </b-modal>

    </b-container>
  </div>
</template>

<script>
  import 'bootstrap/dist/css/bootstrap.css'
  import 'bootstrap-vue/dist/bootstrap-vue.css'

  const items = [
    {notam_tipi: 'Saha', validity_start: "01 Nisan 2018 21:05", notam_no: 'G3304/06'},
    {notam_tipi: 'Meydan', validity_start: "01 Nisan 2018 22:07", notam_no: 'G3333/05'},
    {notam_tipi: 'Meydan', validity_start: "02 Nisan 2018 05:00", notam_no: 'G7896/07'},
    {notam_tipi: 'Saha', validity_start: "02 Nisan 2018 06:00", notam_no: 'A2345/05'},
    {notam_tipi: 'Saha', validity_start: "03 Nisan 2018 07:00", notam_no: 'A1111/06'},
    {notam_tipi: 'Saha', validity_start: "03 Nisan 2018 08:00", notam_no: 'A1234/05'},
    {notam_tipi: 'Meydan', validity_start: "03 Nisan 2018 12:30", notam_no: 'G1567/07'},
    {notam_tipi: 'Meydan', validity_start: "03  Nisan 2018 03:55", notam_no: 'G2765/05'},
    {notam_tipi: 'Meydan', validity_start: "04 Nisan 2018 16:40", notam_no: 'G3409/09'},
    {notam_tipi: 'Meydan', validity_start: "04 Nisan 2018 07:30", notam_no: 'G1234/09'},
    {notam_tipi: 'Meydan', validity_start: "04 Nisan 2018 09:45", notam_no: 'G3421/07'},
    {notam_tipi: 'Meydan', validity_start: "05 Nisan 2018 20:00", notam_no: 'G5432/04',}
  ]

  export default {
    name: 'app2',
    data() {
      return {
        items: items,
        fields: [
          {key: 'notam_no', label: 'NOTAM NO', sortable: true, sortDirection: 'desc'},
          {key: 'validity_start', label: 'Geçerlilik Başlangıcı', sortable: true, 'class': 'text-center'},
          {key: 'notam_tipi', label: 'NOTAM Tipi', sortable: true},
          {key: 'islemler', label: 'İşlemler'}
        ],
        currentPage: 1,
        perPage: 5,
        totalRows: items.length,
        pageOptions: [5, 10, 15],
        sortBy: null,
        sortDesc: false,
        sortDirection: 'asc',
        filter: null,
        modalInfo: {title: '', content: ''}
      }
    },
    computed: {
      sortOptions() {
        // Create an options list from our fields
        return this.fields
          .filter(f => f.sortable)
          .map(f => {
            return {text: f.label, value: f.key}
          })
      }
    },
    methods: {
      info(item, index, button) {
        this.modalInfo.title = `Sıra no: ${index}`
        this.modalInfo.content = JSON.stringify(item, null, 2)
        this.$root.$emit('bv::show::modal', 'modalInfo', button)
      },
      resetModal() {
        this.modalInfo.title = ''
        this.modalInfo.content = ''
      },
      onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length
        this.currentPage = 1
      }
    }
  }
</script>

<!-- Table1.vue -->
