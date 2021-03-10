<template>
  <div class="search-modal pt-5" v-if="showSearchBox">
    <div class="col-lg-6 mt-5 mx-auto">
      <div class="form-inline px-0">
        <input
          type="text"
          placeholder="search customer"
          v-model="search"
          class="form-control form-control-sm col mx-1"
          autofocus="true"
          autocomplete="true"
          @keyup.enter="querySearchKeyword()"
          @keyup.right="querySearchKeyword(pagination_meta.next_page_url, true)"
          @keyup.left="querySearchKeyword(pagination_meta.prev_page_url, true)"
        />
        <button
          type="button"
          class="btn btn-sm btn-primary"
          @click="querySearchKeyword()"
          :disabled="!search"
        >
          <span class="fa fa-search"></span>
        </button>
        <button
          type="button"
          class="btn btn-sm btn-danger"
          @click="closeSearchBox"
        >
          &times;
        </button>
      </div>
      <div class="search-result shadow rounded" v-if="searchResult.length">
        <slot name="view" :data="searchResult"></slot>
      </div>
      <div v-else-if="searchStart" class="bg-white">
        <loader-component></loader-component>
      </div>
      <div v-else-if="fetched" class="bg-white p-3">
        <no-data-to-show />
      </div>
      <div
        class="bg-white d-flex justify-content-center"
        v-if="paginate && searchResult.length"
      >
        <button
          type="button"
          class="btn btn-sm btn-primary"
          :disabled="!pagination_meta.prev_page_url"
          @click="querySearchKeyword(pagination_meta.prev_page_url, true)"

        >
          <span class="fa fa-chevron-circle-left"></span>
        </button>
        <span class="border p-2 rounded"
          >{{ pagination_meta.current_page }} /
          {{ pagination_meta.last_page }}</span
        >
        <button
          type="button"
          class="btn btn-sm btn-primary"
          :disabled="!pagination_meta.next_page_url"
          @click="querySearchKeyword(pagination_meta.next_page_url, true)"

        >
          <span class="fa fa-chevron-circle-right"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { httpCall } from "../helpers/http-service";
import NoDataToShow from './NoDataToShow.vue';
let token = document.getElementById("token").value;
export default {
  components: { NoDataToShow },
  props: {
    show: {
      type: Boolean,
      default: () => false
    },
    ajaxUrl: {
      type: String,
      required: true
    },
    paginate: {
      type: Number,
      default: () => null
    },
    method: {
      type: String,
      default: () => "post"
    },
    dataSrc: {
      type: String,
      default: () => "data"
    },
    onClose: {
      type: Function,
      required: true
    },
    searchBrick: {
      type: String,
      default: () => null
    }
  },
  computed: {
    showSearchBox() {

      return this.show;
    }
  },
  data: () => ({
    searchResult: {},
    searchStart: false,
    fetched: false,
    forceHideSearchBox: false,
    search: null,
    pagination_meta: {}
  }),
  methods: {
    querySearchKeyword(url = null, base = null) {
      this.searchStart = true;
      let rpp = null;
      if (this.paginate) {
        rpp = this.paginate;
      }
      if (!url) {
        url = this.ajaxUrl;
      } else {
        url = this.prepareUrl(url);
      }
      this.fetched = false;
      this.searchResult = [];

      httpCall[this.method](url, { name: this.search, paginate: rpp, brick: this.searchBrick },base)
        .then(({ data }) => {
          if (this.paginate) {
            this.searchResult = data[this.dataSrc].data;
            this.pagination_meta = data[this.dataSrc];
            delete this.pagination_meta.data;
          } else {
            this.fetched = true;
            this.searchResult = data[this.dataSrc];
          }
        })
        .finally(() => {
          this.searchStart = false;
          this.fetched = true;
        })
        .catch(err => console.log(err));
    },
    closeSearchBox() {
      this.onClose()
    },
    prepareUrl(url) {
      return url + "&api_token=" + token;
    }
  }
};
</script>

<style lang="scss">
.search-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  z-index: 100000;
  background-color: rgba(0, 0, 0, 0.5);
  animation-name: fade_effect;
  animation-duration: 0.5s;
  .search-result {
    position: relative;
    max-height: 200px;
    overflow: auto;
    margin-top: 0.3rem;
    background-color: white;
    animation-name: fade_effect;
    animation-duration: 0.5s;
  }
}

@keyframes fade_effect {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
